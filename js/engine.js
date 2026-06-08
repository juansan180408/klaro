// ============================================================
// KLARO — MOTOR ADAPTATIVO v3.0
// Fixes: repetición en sesión, sesgo opción B, selector de nivel
// ============================================================

const Engine = (() => {

  // Cache de preguntas por sesión
  let _cache = {
    preguntas: [],
    cargadas: false
  };

  // IDs ya usados EN LA SESIÓN ACTUAL (se limpia al iniciar cada sesión)
  let _usadosEnSesion = new Set();

  // ── INICIAR NUEVA SESIÓN ──────────────────────────────────
  // Llamar al inicio de cada sesión para limpiar el tracking
  const iniciarSesion = () => {
    _usadosEnSesion = new Set();
  };

  // ── CARGA DESDE SUPABASE ──────────────────────────────────

  const cargarPreguntas = async (area = null, nivel = null) => {
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

      const normalizadas = (data || []).map(p => ({
        ...p,
        opciones: Array.isArray(p.opciones) ? p.opciones : JSON.parse(p.opciones)
      }));

      if (!area && !nivel) {
        _cache.preguntas = normalizadas;
        _cache.cargadas  = true;
      }

      return normalizadas;

    } catch (e) {
      console.error('Error cargando preguntas:', e);
      return [];
    }
  };

  const limpiarCache = () => {
    _cache = { preguntas: [], cargadas: false };
  };

  // ── BARAJAR OPCIONES ─────────────────────────────────────
  // Resuelve el sesgo de opción B: baraja opciones y actualiza
  // el índice de la respuesta correcta para que coincida

  const barajarOpciones = (pregunta) => {
    const opciones  = [...pregunta.opciones];
    const correctaTxt = opciones[pregunta.correcta];

    // Fisher-Yates shuffle
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }

    return {
      ...pregunta,
      opciones,
      correcta: opciones.indexOf(correctaTxt)
    };
  };

  // ── SELECCIÓN ADAPTATIVA ──────────────────────────────────

  const seleccionarPregunta = (state, todasLasPreguntas, areaFiltro = null, nivelFiltro = null) => {
    const historialGlobal = new Set(state.historialPreguntas);

    let pool = todasLasPreguntas;
    if (areaFiltro)  pool = pool.filter(p => p.area  === areaFiltro);
    if (nivelFiltro) pool = pool.filter(p => p.nivel === nivelFiltro);

    // PRIORIDAD 1: no usadas en esta sesión NI en historial global
    let candidatos = pool.filter(p =>
      !_usadosEnSesion.has(p.id) && !historialGlobal.has(p.id)
    );

    // PRIORIDAD 2: no usadas en esta sesión (aunque estén en historial global)
    if (candidatos.length === 0) {
      candidatos = pool.filter(p => !_usadosEnSesion.has(p.id));
    }

    // PRIORIDAD 3: todas (sesión muy larga o banco pequeño)
    if (candidatos.length === 0) {
      candidatos = [...pool];
      _usadosEnSesion = new Set(); // reset sesión
    }

    if (candidatos.length === 0) return null;

    // Adaptar nivel si no hay filtro explícito
    if (!nivelFiltro) {
      const precision = {};
      for (const area of ['biologia', 'quimica', 'matematicas', 'lectura_critica']) {
        precision[area] = getPrecisionArea(state, area);
      }

      const areaElegida = areaFiltro || elegirAreaAdaptativa(state, precision, candidatos);
      const nivelObj    = getNivelAdaptativo(precision[areaElegida] || 0);

      let filtrados = candidatos.filter(p => p.area === areaElegida && p.nivel === nivelObj);
      if (filtrados.length === 0) filtrados = candidatos.filter(p => p.area === areaElegida);
      if (filtrados.length === 0) filtrados = candidatos;

      candidatos = filtrados;
    }

    const idx      = Math.floor(Math.random() * candidatos.length);
    const elegida  = candidatos[idx];

    // Registrar como usada en esta sesión
    _usadosEnSesion.add(elegida.id);

    // Barajar opciones para eliminar sesgo posicional
    return barajarOpciones(elegida);
  };

  const getNivelAdaptativo = (precision) => {
    if (precision >= 75) return 'heavy';
    if (precision >= 45) return 'maso';
    return 'suave';
  };

  const elegirAreaAdaptativa = (state, precision, candidatos) => {
    const areas = ['biologia', 'quimica', 'matematicas', 'lectura_critica'];
    const disponibles = areas.filter(a => candidatos.some(p => p.area === a));
    if (disponibles.length === 0) return areas[0];

    const pesos    = disponibles.map(a => Math.max(10, 100 - (precision[a] || 0)));
    const total    = pesos.reduce((a, b) => a + b, 0);
    let rand       = Math.random() * total;

    for (let i = 0; i < disponibles.length; i++) {
      rand -= pesos[i];
      if (rand <= 0) return disponibles[i];
    }
    return disponibles[disponibles.length - 1];
  };

  const getPrecisionArea = (state, areaId) => {
    const prog = state.progresoPorArea?.[areaId];
    if (!prog || prog.respondidas === 0) return 0;
    return Math.round((prog.correctas / prog.respondidas) * 100);
  };

  // ── FEEDBACK CONTEXTUAL ───────────────────────────────────

  const generarFeedback = (pregunta, esCorrecta, state) => {
    const precision = getPrecisionArea(state, pregunta.area);

    const nivelLabel = { suave: 'Suave 🟢', maso: 'Maso 🟡', heavy: 'Heavy 🔴' };

    const motivacion = {
      biologia:        ['¡El cuerpo humano es fascinante!', 'La biología es la base de tu carrera.', '¡Excelente razonamiento científico!'],
      quimica:         ['¡La química explica todo!', 'Dominar la química te da ventaja clínica.', '¡Base sólida en construcción!'],
      matematicas:     ['¡Los números son tus aliados!', 'Un nutricionista calcula con precisión.', '¡Cada cálculo te acerca al examen!'],
      lectura_critica: ['¡Analizar bien es pensar bien!', 'La evidencia científica es tu herramienta.', '¡Excelente razonamiento crítico!']
    };

    const fraseMotivacion = (motivacion[pregunta.area] || motivacion.biologia)[Math.floor(Math.random() * 3)];

    if (esCorrecta) {
      const emojis = ['🎯', '✅', '🔥', '💪', '⭐'];
      return {
        tipo:     'correcto',
        emoji:    emojis[Math.floor(Math.random() * emojis.length)],
        titulo:   '¡Correcto!',
        nivel:    nivelLabel[pregunta.nivel] || '',
        mensaje:  pregunta.explicacion,
        extra:    precision >= 75 ? '¡Vas dominando esta área! Sigue así.' : fraseMotivacion,
        xpGanado: pregunta.xp
      };
    } else {
      const frases = [
        'No te preocupes — así se aprende.',
        'Este error te acerca a no volver a cometerlo.',
        'Los mejores profesionales aprendieron fallando primero.'
      ];
      return {
        tipo:     'incorrecto',
        emoji:    '💡',
        titulo:   'Casi — revisa esto:',
        nivel:    nivelLabel[pregunta.nivel] || '',
        mensaje:  pregunta.explicacion,
        extra:    frases[Math.floor(Math.random() * frases.length)],
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
    else if (pct >= 60) { mensaje = 'Buen trabajo. Sigue reforzando los temas débiles.';  emoji = '👍'; }
    else if (pct >= 40) { mensaje = 'Vas por buen camino. Repasa las explicaciones.';     emoji = '📚'; }
    else                { mensaje = 'No te rindas. Cada sesión mejoras un poco más.';     emoji = '💪'; }

    const errorsPorArea = {};
    for (const p of preguntasSesion) {
      if (!p.esCorrecta) errorsPorArea[p.area] = (errorsPorArea[p.area] || 0) + 1;
    }
    const areaMasDebil = Object.entries(errorsPorArea).sort(([,a],[,b]) => b - a)[0]?.[0];

    // Distribución por nivel en esta sesión
    const porNivel = { suave: 0, maso: 0, heavy: 0 };
    for (const p of preguntasSesion) {
      if (p.nivel) porNivel[p.nivel] = (porNivel[p.nivel] || 0) + 1;
    }

    return { correctas, total, pct, mensaje, emoji, areaMasDebil, porNivel };
  };

  // ── API PÚBLICA ───────────────────────────────────────────

  return {
    iniciarSesion,
    cargarPreguntas,
    limpiarCache,
    seleccionarPregunta,
    generarFeedback,
    generarResumenSesion
  };

})();
        
