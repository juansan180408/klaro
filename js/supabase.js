// ============================================================
// KLARO — CLIENTE SUPABASE v1.0
// Conexión a la base de datos y autenticación
// ============================================================

const SUPABASE_URL = 'https://cazfggfeakwrtvngzfta.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhemZnZ2ZlYWt3cnR2bmd6ZnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NzI3NjIsImV4cCI6MjA5NjI0ODc2Mn0.IvtKMKVSB-oUlxGapOpeK5DHg-OZWhgs0QaKcQz9CCI';

// Cliente Supabase — disponible globalmente como `sb`
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── AUTH HELPERS ─────────────────────────────────────────────

const Auth = {

  // Registrar nuevo usuario
  registrar: async (email, password) => {
    const { data, error } = await sb.auth.signUp({ email, password });
    return { data, error };
  },

  // Iniciar sesión
  login: async (email, password) => {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  // Cerrar sesión
  logout: async () => {
    const { error } = await sb.auth.signOut();
    return { error };
  },

  // Obtener usuario actual
  getUser: async () => {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  // Escuchar cambios de sesión
  onAuthChange: (callback) => {
    return sb.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// ── PROGRESO HELPERS ─────────────────────────────────────────

const DB = {

  // Cargar progreso del usuario desde Supabase
  cargarProgreso: async (userId) => {
    const { data, error } = await sb
      .from('progreso')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (primera vez)
      console.error('Error cargando progreso:', error);
      return null;
    }

    return data;
  },

  // Crear progreso inicial para usuario nuevo
  crearProgreso: async (userId, estadoInicial) => {
    const { data, error } = await sb
      .from('progreso')
      .insert({
        user_id: userId,
        xp: estadoInicial.xp,
        nivel: estadoInicial.nivel,
        racha: estadoInicial.racha,
        ultima_sesion: estadoInicial.ultimaSesion,
        preguntas_respondidas: estadoInicial.preguntasRespondidas,
        preguntas_correctas: estadoInicial.preguntasCorrectas,
        insignias_desbloqueadas: estadoInicial.insigniasDesbloqueadas,
        progreso_por_area: estadoInicial.progresoPorArea,
        historial_preguntas: estadoInicial.historialPreguntas,
        sesiones_completadas: estadoInicial.sesionesCompletadas
      })
      .select()
      .single();

    return { data, error };
  },

  // Guardar progreso (upsert — crea o actualiza)
  guardarProgreso: async (userId, state) => {
    const { error } = await sb
      .from('progreso')
      .upsert({
        user_id: userId,
        xp: state.xp,
        nivel: state.nivel,
        racha: state.racha,
        ultima_sesion: state.ultimaSesion,
        preguntas_respondidas: state.preguntasRespondidas,
        preguntas_correctas: state.preguntasCorrectas,
        insignias_desbloqueadas: state.insigniasDesbloqueadas,
        progreso_por_area: state.progresoPorArea,
        historial_preguntas: state.historialPreguntas,
        sesiones_completadas: state.sesionesCompletadas
      }, {
        onConflict: 'user_id'
      });

    if (error) console.error('Error guardando progreso:', error);
    return !error;
  },

  // Convertir formato DB → formato app
  dbAState: (dbRow) => {
    if (!dbRow) return null;
    return {
      xp: dbRow.xp || 0,
      nivel: dbRow.nivel || 1,
      racha: dbRow.racha || 0,
      ultimaSesion: dbRow.ultima_sesion || null,
      preguntasRespondidas: dbRow.preguntas_respondidas || 0,
      preguntasCorrectas: dbRow.preguntas_correctas || 0,
      insigniasDesbloqueadas: dbRow.insignias_desbloqueadas || [],
      progresoPorArea: dbRow.progreso_por_area || {
        biologia: { respondidas: 0, correctas: 0 },
        quimica: { respondidas: 0, correctas: 0 },
        matematicas: { respondidas: 0, correctas: 0 },
        lectura_critica: { respondidas: 0, correctas: 0 }
      },
      historialPreguntas: dbRow.historial_preguntas || [],
      sesionesCompletadas: dbRow.sesiones_completadas || 0,
      version: '1.0',
      carrera: 'nutricion_end'
    };
  }
};
