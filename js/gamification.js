// ============================================================
// KLARO — MOTOR DE GAMIFICACIÓN v2.0 (con Supabase)
// Estado en la nube — sincronizado entre dispositivos
// ============================================================

const Gamification = (() => {

  // Estado por defecto para usuario nuevo
  const defaultState = () => ({
    version: '1.0',
    carrera: 'nutricion_end',
    xp: 0,
    nivel: 1,
    racha: 0,
    ultimaSesion: null,
    preguntasRespondidas: 0,
    preguntasCorrectas: 0,
    insigniasDesbloqueadas: [],
    progresoPorArea: {
      biologia:        { respondidas: 0, correctas: 0 },
      quimica:         { respondidas: 0, correctas: 0 },
      matematicas:     { respondidas: 0, correctas: 0 },
      lectura_critica: { respondidas: 0, correctas: 0 }
    },
    historialPreguntas: [],
    sesionesCompletadas: 0
  });

  // ── RACHA DIARIA ─────────────────────────────────────────

  const actualizarRacha = (state) => {
    const hoy = new Date().toDateString();
    const ultima = state.ultimaSesion;

    if (!ultima) {
      state.racha = 1;
    } else {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      if (ultima === hoy) {
        // Ya estudió hoy — mantener racha
      } else if (ultima === ayer.toDateString()) {
        state.racha += 1;
      } else {
        state.racha = 1;
      }
    }
    state.ultimaSesion = hoy;
    return state;
  };

  // ── NIVELES ───────────────────────────────────────────────

  const calcularNivel = (xp) => {
    let nivelActual = NIVELES[0];
    for (const n of NIVELES) {
      if (xp >= n.xpRequerido) nivelActual = n;
      else break;
    }
    return nivelActual;
  };

  const xpParaSiguienteNivel = (xp) => {
    for (let i = 0; i < NIVELES.length - 1; i++) {
      if (xp < NIVELES[i + 1].xpRequerido) {
        return {
          siguiente: NIVELES[i + 1],
          actual: NIVELES[i],
          xpFaltante: NIVELES[i + 1].xpRequerido - xp,
          progresoPct: Math.round(
            ((xp - NIVELES[i].xpRequerido) /
              (NIVELES[i + 1].xpRequerido - NIVELES[i].xpRequerido)) * 100
          )
        };
      }
    }
    return { siguiente: null, actual: NIVELES[NIVELES.length - 1], progresoPct: 100 };
  };

  // ── INSIGNIAS ─────────────────────────────────────────────

  const verificarInsignias = (state, carreraData) => {
    const nuevas = [];
    const yaDesbloqueadas = new Set(state.insigniasDesbloqueadas);

    for (const ins of carreraData.insignias) {
      if (yaDesbloqueadas.has(ins.id)) continue;

      let desbloqueada = false;

      if (ins.tipo === 'racha')         desbloqueada = state.racha >= ins.umbral;
      else if (ins.tipo === 'nivel')    desbloqueada = state.nivel >= ins.umbral;
      else if (ins.tipo === 'preguntas') desbloqueada = state.preguntasRespondidas >= ins.umbral;
      else if (ins.area) {
        const prog = state.progresoPorArea[ins.area];
        if (prog && prog.respondidas > 0) {
          const pct = Math.round((prog.correctas / prog.respondidas) * 100);
          desbloqueada = pct >= ins.umbral;
        }
      }

      if (desbloqueada) {
        nuevas.push(ins);
        state.insigniasDesbloqueadas.push(ins.id);
      }
    }

    return { state, nuevas };
  };

  // ── REGISTRAR RESPUESTA ───────────────────────────────────

  const registrarRespuesta = async (userId, state, pregunta, esCorrecta, carreraData) => {
    state = actualizarRacha(state);

    if (esCorrecta) {
      state.xp += pregunta.xp;
      state.preguntasCorrectas += 1;
      state.progresoPorArea[pregunta.area].correctas += 1;
    }

    state.preguntasRespondidas += 1;
    state.progresoPorArea[pregunta.area].respondidas += 1;

    if (!state.historialPreguntas.includes(pregunta.id)) {
      state.historialPreguntas.push(pregunta.id);
    }

    const nivelInfo = calcularNivel(state.xp);
    state.nivel = nivelInfo.nivel;

    const { state: stateActualizado, nuevas } = verificarInsignias(state, carreraData);

    // Guardar en Supabase (no bloquea el UI — fire and forget con manejo de error)
    DB.guardarProgreso(userId, stateActualizado).catch(e =>
      console.warn('No se pudo guardar en Supabase:', e)
    );

    return { state: stateActualizado, nuevasInsignias: nuevas };
  };

  // ── ESTADÍSTICAS ─────────────────────────────────────────

  const getPrecisionArea = (state, areaId) => {
    const prog = state.progresoPorArea[areaId];
    if (!prog || prog.respondidas === 0) return 0;
    return Math.round((prog.correctas / prog.respondidas) * 100);
  };

  const getPrecisionGlobal = (state) => {
    if (state.preguntasRespondidas === 0) return 0;
    return Math.round((state.preguntasCorrectas / state.preguntasRespondidas) * 100);
  };

  // ── API PÚBLICA ───────────────────────────────────────────

  return {
    defaultState,
    actualizarRacha,
    calcularNivel,
    xpParaSiguienteNivel,
    verificarInsignias,
    registrarRespuesta,
    getPrecisionArea,
    getPrecisionGlobal
  };

})();
