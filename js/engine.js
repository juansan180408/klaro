// ============================================================
// KLARO — MOTOR ADAPTATIVO v2.0 (con Supabase)
// Las preguntas se cargan desde la BD, no desde content.js
// ============================================================

const Engine = (() => {

  // Cache local de preguntas para la sesión actual
  // Evita múltiples llamadas a Supabase durante una sesión
  let _cache = {
    preguntas: [],
    cargadas: false,
    cargando: false
  };

  // ── CARGA DESDE SUPABASE ──────────────────────────────────

  const cargarPreguntas = async (area = null, nivel = null) => {
    // Si ya están en cache y no hay filtros específicos, usar cache
    if (_cache.cargadas && !area && !nivel) return _cache.preguntas;

    try {
      let query = sb
        .from('preguntas')
        .select('id, area, nivel, tema, pregunta, opciones, correcta, explicacion, xp')
        .eq('activa', true);

      if (area)  query = query.eq('area', area);
      if (nivel) query = query.eq('nivel', nivel);

      const { data, error } = await query;

      if (error) {
        console.error('Error cargando preguntas:', error);
        return [];
      }

      // Normalizar opciones (vienen como jsonb — puede ser array o string)
      const normalizadas = (data || []).map(p => ({
        ...p,
        opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones)
      }));

      // Guardar en cache solo si es carga general
      if (!area && !nivel) {
        _cache.preguntas = normalizadas;
        _cache.cargadas = true;
      }

      return normalizadas;

    } catch (e) {
      console.error('Error inesperado cargando preguntas:', e);
      return [];
    }
  };

  // Invalidar cache (útil al cambiar de carrera en el futuro)
  const limpiarCache = () => {
    _cache = { preguntas: [], cargadas: false, cargando: false };
  };

  // ── SELECCIÓN ADAPTATIVA ──────────────────────────────────
  // Mapeo nivel texto → nivel numérico para compatibilidad con lógica existente
  const nivelTextoANum = { suave: 1, maso: 2, heavy: 3 };
  const nivelNumATexto = { 1: 'suave', 2: 'maso', 3: 'heavy' };

  const seleccionarPregunta = (state, todasLasPreguntas, areaFiltro = null) => {
    const historial = new Set(state.historialPreguntas);

    let pool = areaFiltro
      ? todasLasPreguntas.filter(p => p.area === areaFiltro)
      : todasLasPreguntas;

    // Separar nuevas vs ya respondidas
    const nuevas  = pool.filter(p => !historial.has(p.id));
    const repetir = pool.filter(p =>  historial.has(p.id));
    const candidatos = nuevas.length > 0 ? nuevas : repetir;
    if (candidatos.length === 0) return null;

    // Precisión por área
    const precision = {};
    for (const area of ['biologia', 'quimica', 'matematicas', 'lectura_critica']) {
      precision[area] = Gamification.getPrecisionArea(state, area);
    }

    // Nivel objetivo según rendimiento
    const getNivelObjetivo = (area) => {
      const pct = precision[area];
      if (pct >= 80) return 'heavy';
      if (pct >= 50) return 'maso';
      return 'suave';
    };

    // Área elegida adaptativamente
    let areaElegida = areaFiltro || elegirAreaAdaptativa(state, precision, nuevas.length > 0 ? nuevas : pool);
    const nivelObj  = getNivelObjetivo(areaElegida);

    // Filtrar por área + nivel objetivo
    let candidatosFiltrados = candidatos.filter(
      p => p.area === areaElegida && p.nivel === nivelObj
    );

    // Fallback: cualquier nivel del área
    if (candidatosFiltrados.length === 0) {
      candidatosFiltrados = candidatos.filter(p => p.area === areaElegida);
    }

    // Fallback final
    if (candidatosFiltrados.length === 0) {
      candidatosFiltrados = candidatos;
    }

    const idx = Math.floor(Math.random() * candidatosFiltrados.length);
    return candidatosFiltrados[idx];
  };

  const elegirAreaAdaptativa = (state, precision, candidatos) => {
    const areas = ['biologia', 'quimica', 'matematicas', 'lectura_critica'];
    const areasDisponibles = areas.filter(a => candidatos.some(p => p.area === a));
    if (areasDisponibles.length === 0) return areas[0];

    const pesos = areasDisponibles.map(a => Math.max(10, 100 - (precision[a] || 0)));
    const totalPeso = pesos.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalPeso;

    for (let i = 0; i < areasDisponibles.length; i++) {
      rand -= pesos[i];
      if (rand <= 0) return areasDisponibles[i];
    }
    return areasDisponibles[areasDisponibles.length - 1];
  };

  // ── FEEDBACK CONTEXTUAL ───────────────────────────────────

  const generarFeedback = (pregunta, esCorrecta, state) => {
    const precision = Gamification.getPrecisionArea(state, pregunta.area);

    const motivacion = {
      biologia:       ['¡El cuerpo humano es fascinante!', 'La biología es la base de todo lo que harás como nutricionista.', '¡Cada célula del cuerpo te lo agradece!'],
      quimica:        ['¡La química lo explica todo!', 'Entender la química te dará ventaja en cualquier área clínica.', '¡Estás construyendo una base sólida!'],
      matematicas:    ['¡Los números son tus aliados!', 'Un buen nutricionista calcula con precisión.', '¡Cada cálculo que domines te acerca al examen!'],
      lectura_critica:['¡Analizar bien es pensar bien!', 'La evidencia científica es tu mejor herramienta.', '¡Excelente razonamiento crítico!']
    };

    const fraseMotivacion = (motivacion[pregunta.area] || motivacion.biologia)[Math.floor(Math.random() * 3)];

    if (esCorrecta) {
      const emojis = ['🎯', '✅', '🔥', '💪', '⭐'];
      return {
        tipo: 'correcto',
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
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

  // ── RESUMEN DE SESIÓN ─────────────────────────────────────

  const generarResumenSesion = (preguntasSesion, state) => {
    const correctas = preguntasSesion.filter(p => p.esCorrecta).length;
    const total     = preguntasSesion.length;
    const pct       = total > 0 ? Math.round((correctas / total) * 100) : 0;

    let mensaje, emoji;
    if (pct >= 80)      { mensaje = '¡Excelente sesión! Estás listo/a para el examen.'; emoji = '🏆'; }
    else if (pct >= 60) { mensaje = 'Buen trabajo. Sigue reforzando los temas débiles.'; emoji = '👍'; }
    else if (pct >= 40) { mensaje = 'Vas por buen camino. Repasa las explicaciones de hoy.'; emoji = '📚'; }
    else                { mensaje = 'No te rindas. Cada sesión mejoras un poco más.'; emoji = '💪'; }

    const errorsPorArea = {};
    for (const p of preguntasSesion) {
      if (!p.esCorrecta) errorsPorArea[p.area] = (errorsPorArea[p.area] || 0) + 1;
    }
    const areaMasDebil = Object.entries(errorsPorArea).sort(([,a],[,b]) => b-a)[0]?.[0];

    return { correctas, total, pct, mensaje, emoji, areaMasDebil };
  };

  // ── API PÚBLICA ───────────────────────────────────────────

  return {
    cargarPreguntas,
    limpiarCache,
    seleccionarPregunta,
    generarFeedback,
    generarResumenSesion
  };

})();
