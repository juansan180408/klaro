// ============================================================
// KLARO — MOTOR ADAPTATIVO v1.0
// Decide qué pregunta mostrar según el rendimiento del estudiante
// ============================================================

const Engine = (() => {

  // ── SELECCIÓN ADAPTATIVA DE PREGUNTAS ────────────────────
  // Lógica: prioriza áreas débiles, evita repetir preguntas recientes,
  // mezcla dificultades según rendimiento

  const seleccionarPregunta = (state, todasLasPreguntas, areaFiltro = null) => {
    const historial = new Set(state.historialPreguntas);

    // Filtrar por área si se especifica
    let pool = areaFiltro
      ? todasLasPreguntas.filter(p => p.area === areaFiltro)
      : todasLasPreguntas;

    // Separar en nuevas vs ya respondidas
    const nuevas = pool.filter(p => !historial.has(p.id));
    const repetir = pool.filter(p => historial.has(p.id));

    // Si ya respondió todo el pool, reiniciar ese pool
    const candidatos = nuevas.length > 0 ? nuevas : repetir;
    if (candidatos.length === 0) return null;

    // Calcular precisión por área para adaptar dificultad
    const precision = {};
    for (const area of ['biologia', 'quimica', 'matematicas', 'lectura_critica']) {
      precision[area] = Gamification.getPrecisionArea(state, area);
    }

    // Determinar dificultad objetivo según rendimiento del área
    const getDificultadObjetivo = (area) => {
      const pct = precision[area];
      if (pct >= 80) return 3;       // Va bien → preguntas difíciles
      if (pct >= 50) return 2;       // Regular → preguntas medias
      return 1;                       // Mal → preguntas fáciles
    };

    // Si no hay filtro de área, elegir el área más débil con probabilidad mayor
    let areaElegida = areaFiltro;
    if (!areaFiltro) {
      areaElegida = elegirAreaAdaptativa(state, precision, nuevas);
    }

    const difObjetivo = getDificultadObjetivo(areaElegida);

    // Filtrar candidatos por área elegida y dificultad objetivo
    let candidatosFiltrados = candidatos.filter(
      p => p.area === areaElegida && p.dificultad === difObjetivo
    );

    // Fallback: si no hay candidatos con esa dificultad, ampliar a cualquier dificultad del área
    if (candidatosFiltrados.length === 0) {
      candidatosFiltrados = candidatos.filter(p => p.area === areaElegida);
    }

    // Fallback final: cualquier pregunta disponible
    if (candidatosFiltrados.length === 0) {
      candidatosFiltrados = candidatos;
    }

    // Selección aleatoria del pool filtrado
    const idx = Math.floor(Math.random() * candidatosFiltrados.length);
    return candidatosFiltrados[idx];
  };

  const elegirAreaAdaptativa = (state, precision, candidatos) => {
    // Construir pesos: áreas más débiles tienen mayor probabilidad
    const areas = ['biologia', 'quimica', 'matematicas', 'lectura_critica'];

    // Solo áreas que tienen preguntas disponibles en candidatos
    const areasDisponibles = areas.filter(a => candidatos.some(p => p.area === a));
    if (areasDisponibles.length === 0) return areas[0];

    // Invertir precisión para dar más peso a áreas débiles
    // Área con 0% → peso alto; área con 100% → peso bajo
    const pesos = areasDisponibles.map(a => {
      const pct = precision[a] || 0;
      return Math.max(10, 100 - pct); // Mínimo peso 10 para no excluir ninguna
    });

    const totalPeso = pesos.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalPeso;

    for (let i = 0; i < areasDisponibles.length; i++) {
      rand -= pesos[i];
      if (rand <= 0) return areasDisponibles[i];
    }

    return areasDisponibles[areasDisponibles.length - 1];
  };

  // ── MODO TUTOR CONVERSACIONAL ─────────────────────────────
  // Genera respuestas de feedback contextual basadas en la respuesta

  const generarFeedback = (pregunta, esCorrecta, state) => {
    const precision = Gamification.getPrecisionArea(state, pregunta.area);

    const motivacion = {
      biologia: ['¡El cuerpo humano es fascinante!', 'La biología es la base de todo lo que harás como nutricionista.', '¡Cada célula del cuerpo te lo agradece!'],
      quimica: ['¡La química lo explica todo!', 'Entender la química te dará ventaja en cualquier área clínica.', '¡Estás construyendo una base sólida!'],
      matematicas: ['¡Los números son tus aliados!', 'Un buen nutricionista calcula con precisión.', '¡Cada cálculo que domines te acerca al examen!'],
      lectura_critica: ['¡Analizar bien es pensar bien!', 'La evidencia científica es tu mejor herramienta.', '¡Excelente razonamiento crítico!']
    };

    const fraseMotivacion = motivacion[pregunta.area][Math.floor(Math.random() * 3)];

    if (esCorrecta) {
      const emojis = ['🎯', '✅', '🔥', '💪', '⭐'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        tipo: 'correcto',
        emoji,
        titulo: '¡Correcto!',
        mensaje: pregunta.explicacion,
        extra: precision >= 80 ? '¡Dominas esta área! Sigue así.' : fraseMotivacion,
        xpGanado: pregunta.xp
      };
    } else {
      const mensajesError = [
        'No te preocupes — así se aprende.',
        'Este error te acerca a no volver a cometerlo.',
        'Los mejores profesionales aprendieron fallando primero.'
      ];
      return {
        tipo: 'incorrecto',
        emoji: '💡',
        titulo: 'Casi — revisa esto:',
        mensaje: pregunta.explicacion,
        extra: mensajesError[Math.floor(Math.random() * mensajesError.length)],
        xpGanado: 0
      };
    }
  };

  // ── RESUMEN DE SESIÓN ────────────────────────────────────

  const generarResumenSesion = (preguntasSesion, state) => {
    const correctas = preguntasSesion.filter(p => p.esCorrecta).length;
    const total = preguntasSesion.length;
    const pct = Math.round((correctas / total) * 100);

    let mensaje = '';
    let emoji = '';

    if (pct >= 80) {
      mensaje = '¡Excelente sesión! Estás listo/a para el examen.';
      emoji = '🏆';
    } else if (pct >= 60) {
      mensaje = 'Buen trabajo. Sigue reforzando los temas débiles.';
      emoji = '👍';
    } else if (pct >= 40) {
      mensaje = 'Vas por buen camino. Repasa las explicaciones de hoy.';
      emoji = '📚';
    } else {
      mensaje = 'No te rindas. Cada sesión mejoras un poco más.';
      emoji = '💪';
    }

    // Identificar área más débil de la sesión
    const errorsPorArea = {};
    for (const p of preguntasSesion) {
      if (!p.esCorrecta) {
        errorsPorArea[p.area] = (errorsPorArea[p.area] || 0) + 1;
      }
    }

    const areaMasDebil = Object.entries(errorsPorArea)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return { correctas, total, pct, mensaje, emoji, areaMasDebil };
  };

  // ── DIAGNÓSTICO INICIAL ───────────────────────────────────

  const generarPreguntasDiagnostico = (todasLasPreguntas) => {
    // Seleccionar 2 preguntas de dificultad 1 de cada área para diagnóstico
    const diagnostico = [];
    const areas = ['biologia', 'quimica', 'matematicas', 'lectura_critica'];

    for (const area of areas) {
      const faciles = todasLasPreguntas.filter(p => p.area === area && p.dificultad === 1);
      if (faciles.length > 0) {
        const idx = Math.floor(Math.random() * faciles.length);
        diagnostico.push(faciles[idx]);
      }
    }

    return diagnostico;
  };

  // ── API PÚBLICA ───────────────────────────────────────────

  return {
    seleccionarPregunta,
    generarFeedback,
    generarResumenSesion,
    generarPreguntasDiagnostico
  };

})();
