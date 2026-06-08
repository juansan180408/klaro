// ============================================================
// KLARO — CONTROLADOR PRINCIPAL v2.0 (con Supabase Auth)
// Pantallas: auth | onboarding | dashboard | quiz | resumen
// ============================================================

const App = (() => {

  // ── ESTADO GLOBAL ────────────────────────────────────────
  let state       = null;
  let usuarioId   = null;
  let usuarioEmail = null;

  // Estado de sesión de preguntas
  let preguntaActual    = null;
  let nivelActivo       = null;
  let nivelSeleccionado = null; // elegido por el usuario en el dashboard
  let respondida        = false;
  let preguntasSesion   = [];
  let areaActiva        = null;
  let contadorSesion    = 0;
  const PREGUNTAS_POR_SESION = 10;

  // ── REFERENCIAS DOM ──────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── NAVEGACIÓN ───────────────────────────────────────────

  const ir = (screenId) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(screenId).classList.add('active');
    window.scrollTo(0, 0);
  };

  // ── INIT ─────────────────────────────────────────────────

  const init = async () => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Mostrar pantalla de carga
    ir('screen-loading');

    // Verificar si hay sesión activa
    const user = await Auth.getUser();

    if (user) {
      await cargarSesionUsuario(user);
    } else {
      ir('screen-auth');
    }

    bindEvents();
  };

  // ── CARGAR SESIÓN DE USUARIO ─────────────────────────────

  const cargarSesionUsuario = async (user) => {
    usuarioId    = user.id;
    usuarioEmail = user.email;

    // Cargar progreso desde Supabase
    const dbRow = await DB.cargarProgreso(usuarioId);

    if (dbRow) {
      // Usuario existente — cargar su progreso
      state = DB.dbAState(dbRow);
      renderDashboard();
      ir('screen-dashboard');
    } else {
      // Usuario nuevo — crear progreso inicial
      state = Gamification.defaultState();
      await DB.crearProgreso(usuarioId, state);
      ir('screen-onboarding');
    }
  };

  // ── BIND DE EVENTOS ───────────────────────────────────────

  const bindEvents = () => {

    // ── AUTH ──
    // Toggle login / registro
    $('link-ir-registro').addEventListener('click', (e) => {
      e.preventDefault();
      $('form-login').style.display    = 'none';
      $('form-registro').style.display = 'flex';
      $('auth-titulo').textContent     = 'Crear cuenta';
      limpiarErrorAuth();
    });

    $('link-ir-login').addEventListener('click', (e) => {
      e.preventDefault();
      $('form-registro').style.display = 'none';
      $('form-login').style.display    = 'flex';
      $('auth-titulo').textContent     = 'Bienvenido/a';
      limpiarErrorAuth();
    });

    // Login
    $('btn-login').addEventListener('click', async () => {
      const email    = $('input-login-email').value.trim();
      const password = $('input-login-password').value;

      if (!email || !password) {
        mostrarErrorAuth('Completa todos los campos.');
        return;
      }

      setLoadingAuth(true, 'btn-login');
      const { data, error } = await Auth.login(email, password);
      setLoadingAuth(false, 'btn-login');

      if (error) {
        mostrarErrorAuth(traducirErrorAuth(error.message));
        return;
      }

      ir('screen-loading');
      await cargarSesionUsuario(data.user);
    });

    // Registro
    $('btn-registro').addEventListener('click', async () => {
      const email    = $('input-reg-email').value.trim();
      const password = $('input-reg-password').value;
      const confirm  = $('input-reg-confirm').value;

      if (!email || !password || !confirm) {
        mostrarErrorAuth('Completa todos los campos.');
        return;
      }

      if (password.length < 6) {
        mostrarErrorAuth('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (password !== confirm) {
        mostrarErrorAuth('Las contraseñas no coinciden.');
        return;
      }

      setLoadingAuth(true, 'btn-registro');
      const { data, error } = await Auth.registrar(email, password);
      setLoadingAuth(false, 'btn-registro');

      if (error) {
        mostrarErrorAuth(traducirErrorAuth(error.message));
        return;
      }

      // Supabase puede requerir confirmación de email
      // Si el usuario ya está confirmado (sin email confirm), logueamos directo
      if (data.user && data.session) {
        ir('screen-loading');
        await cargarSesionUsuario(data.user);
      } else {
        // Modo sin confirmación de email — intentar login directo
        const loginResult = await Auth.login(email, password);
        if (loginResult.data?.user) {
          ir('screen-loading');
          await cargarSesionUsuario(loginResult.data.user);
        } else {
          mostrarErrorAuth('Cuenta creada. Ya puedes iniciar sesión.');
          $('form-registro').style.display = 'none';
          $('form-login').style.display    = 'flex';
          $('auth-titulo').textContent     = 'Bienvenido/a';
        }
      }
    });

    // ── ONBOARDING ──
    $('btn-comenzar').addEventListener('click', () => {
      renderDashboard();
      ir('screen-dashboard');
    });

    // ── DASHBOARD ──
    // Chips de nivel
    document.querySelectorAll('.nivel-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.nivel-chip').forEach(c => c.classList.remove('activo'));
        chip.classList.add('activo');
        nivelSeleccionado = chip.dataset.nivel || null;
      });
    });

    $('btn-sesion-libre').addEventListener('click', () => iniciarSesion(null, nivelSeleccionado));

    $('areas-grid').addEventListener('click', e => {
      const card = e.target.closest('.area-card');
      if (card) iniciarSesion(card.dataset.area, nivelSeleccionado);
    });

    $('btn-logout').addEventListener('click', async () => {
      await Auth.logout();
      state      = null;
      usuarioId  = null;
      ir('screen-auth');
    });

    // ── QUIZ ──
    $('btn-siguiente').addEventListener('click', () => {
      if (!respondida) return;
      siguientePregunta();
    });

    // ── RESUMEN ──
    $('btn-repetir').addEventListener('click', ()    => iniciarSesion(areaActiva, nivelActivo));
    $('btn-volver-inicio').addEventListener('click', () => {
      renderDashboard();
      ir('screen-dashboard');
    });
  };

  // ── AUTH HELPERS UI ───────────────────────────────────────

  const mostrarErrorAuth = (msg) => {
    const el = $('auth-error');
    el.textContent = msg;
    el.style.display = 'block';
  };

  const limpiarErrorAuth = () => {
    const el = $('auth-error');
    el.textContent = '';
    el.style.display = 'none';
  };

  const setLoadingAuth = (loading, btnId) => {
    const btn = $(btnId);
    btn.disabled    = loading;
    btn.textContent = loading ? 'Cargando...' : (btnId === 'btn-login' ? 'Entrar' : 'Crear cuenta');
  };

  const traducirErrorAuth = (msg) => {
    if (msg.includes('Invalid login'))      return 'Email o contraseña incorrectos.';
    if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de entrar.';
    if (msg.includes('already registered')) return 'Este email ya tiene una cuenta. Inicia sesión.';
    if (msg.includes('Password should'))    return 'La contraseña debe tener al menos 6 caracteres.';
    if (msg.includes('Unable to validate')) return 'Email o contraseña incorrectos.';
    return 'Ocurrió un error. Intenta de nuevo.';
  };

  // ── DASHBOARD ─────────────────────────────────────────────

  const renderDashboard = () => {
    const carrera  = CONTENT.carreras[state.carrera];
    const nivelInfo = Gamification.calcularNivel(state.xp);
    const xpInfo   = Gamification.xpParaSiguienteNivel(state.xp);
    const precision = Gamification.getPrecisionGlobal(state);

    // Topbar
    actualizarTopbar();

    // Email del usuario (abreviado)
    const emailCorto = usuarioEmail
      ? (usuarioEmail.length > 20 ? usuarioEmail.substring(0, 18) + '…' : usuarioEmail)
      : '';
    $('dash-email').textContent = emailCorto;

    // Saludo
    const hora = new Date().getHours();
    const saludo = hora < 12 ? '¡Buenos días!' : hora < 18 ? '¡Buenas tardes!' : '¡Buenas noches!';
    $('dash-greeting').textContent = saludo;

    const diasRestantes = calcularDiasParaExamen();
    $('dash-sub').textContent = diasRestantes !== null && diasRestantes > 0
      ? `${diasRestantes} días para el examen. ¡Cada sesión cuenta!`
      : 'Tu tutor adaptativo está listo.';

    // Nivel
    $('nivel-num').textContent     = nivelInfo.nivel;
    $('nivel-nombre').textContent  = nivelInfo.nombre;
    $('nivel-num').style.background = nivelInfo.color || 'var(--violet)';

    if (xpInfo.siguiente) {
      $('nivel-xp-txt').textContent       = `${state.xp} / ${xpInfo.siguiente.xpRequerido} XP → ${xpInfo.siguiente.nombre}`;
      $('nivel-progress').style.width     = xpInfo.progresoPct + '%';
      $('nivel-progress').style.background = nivelInfo.color || 'var(--violet)';
    } else {
      $('nivel-xp-txt').textContent   = '¡Nivel máximo alcanzado! 🎓';
      $('nivel-progress').style.width = '100%';
    }

    // Stats globales
    $('stat-respondidas').textContent = state.preguntasRespondidas;
    $('stat-precision').textContent   = precision + '%';
    $('stat-racha').textContent       = state.racha + ' 🔥';

    // Áreas
    const grid = $('areas-grid');
    grid.innerHTML = '';
    for (const areaId of carrera.areas) {
      const area  = CONTENT.areas[areaId];
      const pct   = Gamification.getPrecisionArea(state, areaId);
      const prog  = state.progresoPorArea[areaId];
      const color = area.color;

      const card = document.createElement('div');
      card.className    = 'area-card';
      card.dataset.area = areaId;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Practicar ${area.nombre}`);
      card.innerHTML = `
        <div class="area-icon">${area.icono}</div>
        <div class="area-nombre">${area.nombre}</div>
        <div class="area-pct" style="color:${color}">
          ${prog.respondidas > 0 ? pct + '% precisión' : 'Sin empezar'}
        </div>
        <div class="progress-wrap">
          <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      `;
      grid.appendChild(card);
    }

    // Insignias
    renderInsignias();
  };

  const renderInsignias = () => {
    const carrera   = CONTENT.carreras[state.carrera];
    const container = $('insignias-scroll');
    container.innerHTML = '';

    for (const ins of carrera.insignias) {
      const desbloqueada = state.insigniasDesbloqueadas.includes(ins.id);
      const chip = document.createElement('div');
      chip.className = 'insignia-chip' + (desbloqueada ? ' desbloqueada' : '');
      chip.setAttribute('aria-label', ins.nombre + (desbloqueada ? ' — desbloqueada' : ' — bloqueada'));
      chip.innerHTML = desbloqueada
        ? `<span class="insignia-icon" aria-hidden="true">${ins.icono}</span><span>${ins.nombre}</span>`
        : `<span class="insignia-lock" aria-hidden="true">🔒</span><span>${ins.nombre}</span>`;
      container.appendChild(chip);
    }
  };

  const actualizarTopbar = () => {
    document.querySelectorAll('.topbar-xp').forEach(el => {
      el.textContent = `⚡ ${state ? state.xp : 0} XP`;
    });
    document.querySelectorAll('.topbar-racha').forEach(el => {
      el.textContent = `🔥 ${state ? state.racha : 0}`;
    });
  };

  const calcularDiasParaExamen = () => {
    const examen = new Date('2026-06-11');
    const hoy    = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diff = Math.ceil((examen - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // ── SESIÓN DE PREGUNTAS ───────────────────────────────────

  const iniciarSesion = async (area, nivel = null) => {
    areaActiva      = area;
    nivelActivo     = nivel;
    contadorSesion  = 0;
    preguntasSesion = [];
    Engine.iniciarSesion(); // limpiar tracking de sesión
    ir('screen-loading');
    sesionPreguntas = await Engine.cargarPreguntas(area || null, null);
    if (sesionPreguntas.length === 0) {
      renderDashboard();
      ir('screen-dashboard');
      setTimeout(() => alert('No hay preguntas disponibles aún. ¡Vuelve pronto!'), 300);
      return;
    }
    siguientePregunta();
  };

  const siguientePregunta = () => {
    if (contadorSesion >= PREGUNTAS_POR_SESION) {
      mostrarResumen();
      return;
    }

    respondida = false;
    $('feedback-panel').classList.remove('visible', 'correcto', 'incorrecto');
    $('btn-siguiente').style.display = 'none';

    preguntaActual = Engine.seleccionarPregunta(state, sesionPreguntas, areaActiva, nivelActivo);

    if (!preguntaActual) {
      mostrarResumen();
      return;
    }

    renderPregunta(preguntaActual);
    ir('screen-quiz');
  };

  const renderPregunta = (p) => {
    const area = CONTENT.areas[p.area];

    const tag = $('quiz-area-tag');
    tag.textContent      = `${area.icono} ${area.nombre}`;
    tag.style.background = area.color + '20';
    tag.style.color      = area.color;

    $('quiz-progress-text').textContent   = `${contadorSesion + 1} / ${PREGUNTAS_POR_SESION}`;
    $('quiz-progress-bar').style.width    = (contadorSesion / PREGUNTAS_POR_SESION * 100) + '%';

    const dots = document.querySelectorAll('.dif-dot');
    dots.forEach((d, i) => d.classList.toggle('on', i < p.dificultad));

    $('quiz-pregunta').textContent = p.pregunta;

    const letras = ['A', 'B', 'C', 'D'];
    const lista  = $('opciones-list');
    lista.innerHTML = '';

    p.opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className    = 'opcion-btn';
      btn.dataset.idx  = i;
      btn.innerHTML    = `<span class="opcion-letra">${letras[i]}</span><span>${op}</span>`;
      btn.addEventListener('click', () => responder(i));
      lista.appendChild(btn);
    });
  };

  const responder = async (idx) => {
    if (respondida) return;
    respondida = true;
    contadorSesion++;

    const esCorrecta = idx === preguntaActual.correcta;
    const carrera    = CONTENT.carreras[state.carrera];

    // Marcar opciones visualmente
    document.querySelectorAll('.opcion-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === preguntaActual.correcta) btn.classList.add('correcta');
      else if (i === idx && !esCorrecta)  btn.classList.add('incorrecta');
    });

    // Registrar en gamificación (guarda en Supabase internamente)
    const resultado = await Gamification.registrarRespuesta(
      usuarioId, state, preguntaActual, esCorrecta, carrera
    );
    state = resultado.state;

    // Guardar en sesión local
    preguntasSesion.push({ ...preguntaActual, esCorrecta });

    // Feedback
    const feedback = Engine.generarFeedback(preguntaActual, esCorrecta, state);
    mostrarFeedback(feedback);

    // Toasts de insignias nuevas
    for (const ins of resultado.nuevasInsignias) {
      await mostrarToastInsignia(ins);
    }

    actualizarTopbar();

    $('btn-siguiente').style.display   = 'flex';
    $('btn-siguiente').textContent     = contadorSesion >= PREGUNTAS_POR_SESION
      ? 'Ver resumen →'
      : 'Siguiente pregunta →';
  };

  const mostrarFeedback = (fb) => {
    const panel = $('feedback-panel');
    panel.className = `feedback-panel ${fb.tipo} visible`;

    $('feedback-emoji').textContent  = fb.emoji;
    $('feedback-titulo').textContent = fb.titulo;
    const nivelEl = $('feedback-nivel');
    if (nivelEl) nivelEl.textContent = fb.nivel || '';
    $('feedback-texto').textContent  = fb.mensaje;
    $('feedback-extra').textContent  = fb.extra;

    const xpEl = $('feedback-xp');
    xpEl.style.display = fb.xpGanado > 0 ? 'inline-flex' : 'none';
    if (fb.xpGanado > 0) xpEl.textContent = `+${fb.xpGanado} XP`;
  };

  const mostrarToastInsignia = (ins) => {
    return new Promise(resolve => {
      const toast = $('toast-insignia');
      toast.innerHTML = `${ins.icono} ¡Insignia desbloqueada: <strong>${ins.nombre}</strong>!`;
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
        resolve();
      }, 3500);
    });
  };

  // ── RESUMEN DE SESIÓN ─────────────────────────────────────

  const mostrarResumen = () => {
    const resumen = Engine.generarResumenSesion(preguntasSesion, state);

    $('resumen-emoji').textContent  = resumen.emoji;
    $('resumen-titulo').textContent = resumen.pct >= 80 ? '¡Sesión excelente!' :
      resumen.pct >= 60 ? '¡Buen trabajo!' : 'Sigue adelante';
    $('resumen-msg').textContent    = resumen.mensaje;

    $('resumen-correctas').textContent = resumen.correctas;
    $('resumen-total').textContent     = resumen.total;
    $('resumen-pct').textContent       = resumen.pct + '%';

    const areaDebilEl = $('resumen-area-debil');
    if (resumen.areaMasDebil) {
      const area = CONTENT.areas[resumen.areaMasDebil];
      areaDebilEl.style.display = 'block';
      areaDebilEl.innerHTML = `${area.icono} Área a reforzar: <strong>${area.nombre}</strong>. Practica esta área en tu próxima sesión.`;
    } else {
      areaDebilEl.style.display = 'none';
    }

    actualizarTopbar();
    ir('screen-resumen');
  };

  return { init };

})();

document.addEventListener('DOMContentLoaded', App.init);
