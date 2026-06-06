// ============================================================
// KLARO — BANCO DE CONTENIDO v1.0
// Nutrición y Dietética — Escuela Nacional del Deporte
// Escalable: agregar más carreras como nuevos objetos en CARRERAS
// ============================================================

const CONTENT = {

  carreras: {
    nutricion_end: {
      id: 'nutricion_end',
      nombre: 'Nutrición y Dietética',
      institucion: 'Escuela Nacional del Deporte — Cali',
      descripcion: 'Prepárate para el examen de conocimiento y la entrevista de admisión.',
      color: '#6c63ff',
      areas: ['biologia', 'quimica', 'matematicas', 'lectura_critica'],
      insignias: [
        { id: 'bio_master', nombre: 'Biólogo/a', area: 'biologia', umbral: 80, icono: '🧬' },
        { id: 'quim_master', nombre: 'Químico/a', area: 'quimica', umbral: 80, icono: '⚗️' },
        { id: 'math_master', nombre: 'Calculista', area: 'matematicas', umbral: 80, icono: '📊' },
        { id: 'lect_master', nombre: 'Analista', area: 'lectura_critica', umbral: 80, icono: '📖' },
        { id: 'racha_3', nombre: 'En racha', tipo: 'racha', umbral: 3, icono: '🔥' },
        { id: 'racha_7', nombre: 'Imparable', tipo: 'racha', umbral: 7, icono: '⚡' },
        { id: 'primer_nivel', nombre: 'Primer nivel', tipo: 'nivel', umbral: 2, icono: '🌱' },
        { id: 'explorador', nombre: 'Explorador/a', tipo: 'preguntas', umbral: 20, icono: '🧭' },
        { id: 'dedicado', nombre: 'Dedicado/a', tipo: 'preguntas', umbral: 50, icono: '💪' },
        { id: 'listo', nombre: '¡Listo para el examen!', tipo: 'preguntas', umbral: 100, icono: '🎓' }
      ]
    }
  },

  areas: {
    biologia: {
      id: 'biologia',
      nombre: 'Biología',
      icono: '🧬',
      color: '#22c55e',
      descripcion: 'Célula, sistemas, macronutrientes y fisiología básica',
      temas: ['celula', 'macronutrientes', 'sistemas', 'genetica_basica']
    },
    quimica: {
      id: 'quimica',
      nombre: 'Química',
      icono: '⚗️',
      color: '#f59e0b',
      descripcion: 'pH, reacciones, vitaminas, minerales y digestión química',
      temas: ['conceptos_basicos', 'ph_soluciones', 'organica', 'vitaminas_minerales']
    },
    matematicas: {
      id: 'matematicas',
      nombre: 'Matemáticas',
      icono: '📊',
      color: '#3b82f6',
      descripcion: 'Proporciones, cálculo calórico, estadística y unidades',
      temas: ['proporciones', 'calorias', 'estadistica', 'unidades']
    },
    lectura_critica: {
      id: 'lectura_critica',
      nombre: 'Lectura Crítica',
      icono: '📖',
      color: '#ec4899',
      descripcion: 'Comprensión de textos científicos, análisis y argumentación',
      temas: ['idea_principal', 'argumentacion', 'tablas_graficas', 'ciencia_salud']
    }
  },

  // ============================================================
  // PREGUNTAS — 120 preguntas distribuidas en 4 áreas
  // Estructura escalable: agregar más preguntas sin tocar la lógica
  // ============================================================
  preguntas: [

    // ======================== BIOLOGÍA ========================

    // TEMA: CÉLULA
    {
      id: 'b001', area: 'biologia', tema: 'celula', dificultad: 1,
      pregunta: '¿Cuál es la unidad estructural y funcional básica de todos los seres vivos?',
      opciones: ['El tejido', 'La célula', 'El órgano', 'La molécula'],
      correcta: 1,
      explicacion: 'La célula es la unidad mínima de vida. Todo organismo vivo está compuesto por una o más células. En nutrición, los nutrientes que consumimos son procesados a nivel celular para obtener energía y mantener las funciones vitales.',
      xp: 10
    },
    {
      id: 'b002', area: 'biologia', tema: 'celula', dificultad: 1,
      pregunta: '¿Qué organelo celular es responsable de producir la mayor parte de la energía (ATP) en la célula?',
      opciones: ['El núcleo', 'El ribosoma', 'La mitocondria', 'El retículo endoplásmico'],
      correcta: 2,
      explicacion: 'La mitocondria es conocida como la "central energética" de la célula. Allí ocurre la respiración celular, proceso por el cual los nutrientes (glucosa, ácidos grasos) se convierten en ATP, la molécula de energía universal del organismo.',
      xp: 10
    },
    {
      id: 'b003', area: 'biologia', tema: 'celula', dificultad: 2,
      pregunta: '¿Cuál es la función principal de la membrana plasmática?',
      opciones: [
        'Producir proteínas para la célula',
        'Regular el paso de sustancias hacia adentro y afuera de la célula',
        'Almacenar el material genético',
        'Sintetizar ATP mediante fotosíntesis'
      ],
      correcta: 1,
      explicacion: 'La membrana plasmática es selectivamente permeable: controla qué entra y qué sale de la célula. Esta función es clave en nutrición porque así es como los nutrientes absorbidos en el intestino ingresan a las células.',
      xp: 15
    },
    {
      id: 'b004', area: 'biologia', tema: 'celula', dificultad: 2,
      pregunta: '¿Qué proceso celular transforma glucosa en energía sin necesidad de oxígeno?',
      opciones: ['Respiración aeróbica', 'Fotosíntesis', 'Glucólisis anaerobia', 'Digestión enzimática'],
      correcta: 2,
      explicacion: 'La glucólisis anaerobia ocurre sin oxígeno y produce una pequeña cantidad de ATP junto con ácido láctico. Es importante en esfuerzos físicos intensos y cortos, como sprints, donde el oxígeno no llega suficientemente rápido al músculo.',
      xp: 15
    },
    {
      id: 'b005', area: 'biologia', tema: 'celula', dificultad: 3,
      pregunta: '¿Cuál es la diferencia entre anabolismo y catabolismo?',
      opciones: [
        'Anabolismo produce energía; catabolismo la almacena',
        'Anabolismo construye moléculas complejas; catabolismo las descompone',
        'Son procesos idénticos que ocurren en lugares distintos',
        'Anabolismo ocurre en el núcleo; catabolismo en la mitocondria'
      ],
      correcta: 1,
      explicacion: 'El metabolismo tiene dos fases: el anabolismo (construye — ej: sintetizar músculo a partir de aminoácidos) y el catabolismo (destruye — ej: descomponer glucosa para obtener energía). Un nutricionista equilibra ambos procesos según el objetivo del paciente.',
      xp: 20
    },

    // TEMA: MACRONUTRIENTES
    {
      id: 'b006', area: 'biologia', tema: 'macronutrientes', dificultad: 1,
      pregunta: '¿Cuáles son los tres macronutrientes principales de la dieta humana?',
      opciones: [
        'Vitaminas, minerales y agua',
        'Carbohidratos, proteínas y lípidos',
        'Glucosa, aminoácidos y ácidos grasos',
        'Fibra, almidón y colesterol'
      ],
      correcta: 1,
      explicacion: 'Los macronutrientes son los nutrientes que el cuerpo necesita en grandes cantidades: carbohidratos (energía rápida), proteínas (construcción y reparación) y lípidos (energía de reserva, hormonas, membranas). Las vitaminas y minerales son micronutrientes.',
      xp: 10
    },
    {
      id: 'b007', area: 'biologia', tema: 'macronutrientes', dificultad: 1,
      pregunta: '¿Cuál es la unidad básica (monómero) de las proteínas?',
      opciones: ['Glucosa', 'Ácido graso', 'Aminoácido', 'Nucleótido'],
      correcta: 2,
      explicacion: 'Las proteínas están formadas por cadenas de aminoácidos unidos por enlaces peptídicos. Existen 20 aminoácidos; 9 son esenciales (el cuerpo no los produce y deben obtenerse de la dieta). Un nutricionista debe conocer las fuentes de proteína completa e incompleta.',
      xp: 10
    },
    {
      id: 'b008', area: 'biologia', tema: 'macronutrientes', dificultad: 2,
      pregunta: '¿Qué tipo de carbohidrato proporciona energía más sostenida y evita picos de glucosa en sangre?',
      opciones: [
        'Azúcares simples como la fructosa',
        'Carbohidratos complejos como el almidón',
        'La sacarosa de mesa',
        'La lactosa de la leche'
      ],
      correcta: 1,
      explicacion: 'Los carbohidratos complejos (almidón, fibra) se digieren más lentamente, liberando glucosa de forma gradual. Esto evita picos de insulina y mantiene la energía estable. Los azúcares simples se absorben rápido y pueden generar picos glucémicos.',
      xp: 15
    },
    {
      id: 'b009', area: 'biologia', tema: 'macronutrientes', dificultad: 2,
      pregunta: '¿Cuál es la función principal de los lípidos en el organismo?',
      opciones: [
        'Solo servir como fuente de energía de emergencia',
        'Formar el material genético celular',
        'Reserva energética, componente de membranas y transporte de vitaminas liposolubles',
        'Transportar oxígeno en la sangre'
      ],
      correcta: 2,
      explicacion: 'Los lípidos cumplen múltiples funciones: son la mayor reserva energética del cuerpo (9 kcal/g), forman la membrana de todas las células, son precursores de hormonas esteroideas y transportan vitaminas liposolubles (A, D, E, K).',
      xp: 15
    },
    {
      id: 'b010', area: 'biologia', tema: 'macronutrientes', dificultad: 3,
      pregunta: '¿Qué diferencia un aminoácido esencial de uno no esencial?',
      opciones: [
        'El esencial tiene más calorías',
        'El esencial debe obtenerse de la dieta porque el cuerpo no lo sintetiza',
        'El no esencial solo se encuentra en alimentos de origen animal',
        'El esencial es más grande molecularmente'
      ],
      correcta: 1,
      explicacion: 'Los 9 aminoácidos esenciales (histidina, isoleucina, leucina, lisina, metionina, fenilalanina, treonina, triptófano, valina) no pueden ser sintetizados por el organismo en cantidad suficiente y deben obtenerse de la alimentación. Los no esenciales el cuerpo los puede fabricar.',
      xp: 20
    },

    // TEMA: SISTEMAS
    {
      id: 'b011', area: 'biologia', tema: 'sistemas', dificultad: 1,
      pregunta: '¿En qué parte del sistema digestivo ocurre la mayor absorción de nutrientes?',
      opciones: ['En el estómago', 'En el intestino delgado', 'En el intestino grueso', 'En el esófago'],
      correcta: 1,
      explicacion: 'El intestino delgado, especialmente el yeyuno y el íleon, es el principal sitio de absorción de nutrientes. Sus vellosidades y microvellosidades aumentan enormemente la superficie de absorción. El intestino grueso absorbe principalmente agua y minerales.',
      xp: 10
    },
    {
      id: 'b012', area: 'biologia', tema: 'sistemas', dificultad: 1,
      pregunta: '¿Cuál es la función del hígado en el metabolismo de los nutrientes?',
      opciones: [
        'Producir jugos gástricos para digerir proteínas',
        'Procesar y distribuir nutrientes absorbidos, sintetizar proteínas y desintoxicar',
        'Almacenar el bolo alimenticio entre comidas',
        'Producir insulina para regular la glucosa'
      ],
      correcta: 1,
      explicacion: 'El hígado es el órgano metabólico más importante. Procesa los nutrientes que llegan del intestino, sintetiza proteínas plasmáticas, produce bilis para la digestión de grasas, almacena glucógeno y glucosa, y desintoxica sustancias nocivas.',
      xp: 10
    },
    {
      id: 'b013', area: 'biologia', tema: 'sistemas', dificultad: 2,
      pregunta: '¿Qué hormona regula el ingreso de glucosa a las células y es producida por el páncreas?',
      opciones: ['Glucagón', 'Cortisol', 'Insulina', 'Adrenalina'],
      correcta: 2,
      explicacion: 'La insulina, producida por las células beta del páncreas, permite que la glucosa entre a las células para ser usada como energía. Cuando hay poca glucosa en sangre, el glucagón (también pancreático) estimula la liberación de glucosa almacenada. El desbalance de insulina lleva a la diabetes.',
      xp: 15
    },
    {
      id: 'b014', area: 'biologia', tema: 'sistemas', dificultad: 2,
      pregunta: '¿Qué órgano produce la bilis, necesaria para la digestión de las grasas?',
      opciones: ['El páncreas', 'El hígado', 'El estómago', 'El intestino delgado'],
      correcta: 1,
      explicacion: 'El hígado produce la bilis, que se almacena en la vesícula biliar y se libera al intestino delgado cuando se consumen grasas. La bilis emulsiona los lípidos (los divide en gotas pequeñas), facilitando la acción de la lipasa pancreática.',
      xp: 15
    },
    {
      id: 'b015', area: 'biologia', tema: 'sistemas', dificultad: 3,
      pregunta: '¿Qué es la homeostasis y por qué es relevante en nutrición?',
      opciones: [
        'La capacidad del cuerpo de crecer en respuesta al ejercicio',
        'El equilibrio interno que el cuerpo mantiene regulando temperatura, glucosa, pH y otros parámetros',
        'El proceso de digestión y absorción de nutrientes',
        'La síntesis de proteínas a partir de aminoácidos'
      ],
      correcta: 1,
      explicacion: 'La homeostasis es el conjunto de mecanismos que mantienen el ambiente interno del organismo estable. En nutrición es fundamental porque la alimentación afecta directamente la glucemia, el pH sanguíneo, la temperatura y el balance hídrico. Un nutricionista diseña dietas que apoyen la homeostasis.',
      xp: 20
    },

    // TEMA: GENÉTICA BÁSICA
    {
      id: 'b016', area: 'biologia', tema: 'genetica_basica', dificultad: 1,
      pregunta: '¿Dónde se encuentra el material genético (ADN) en una célula animal?',
      opciones: ['En la mitocondria únicamente', 'En el núcleo principalmente, y también en la mitocondria', 'En la membrana plasmática', 'En los ribosomas'],
      correcta: 1,
      explicacion: 'El ADN se encuentra principalmente en el núcleo celular, organizado en cromosomas. También existe ADN mitocondrial (ADNmt) heredado por línea materna. El núcleo es el "centro de control" de la célula y dirige la síntesis de proteínas.',
      xp: 10
    },
    {
      id: 'b017', area: 'biologia', tema: 'genetica_basica', dificultad: 2,
      pregunta: '¿Qué es una enzima y cuál es su rol en la digestión?',
      opciones: [
        'Una grasa que lubrica el tracto digestivo',
        'Una proteína que actúa como catalizador, acelerando reacciones químicas específicas',
        'Un carbohidrato que protege la mucosa gástrica',
        'Un mineral que regula el pH estomacal'
      ],
      correcta: 1,
      explicacion: 'Las enzimas son proteínas catalizadoras que aceleran reacciones químicas sin consumirse. En digestión son esenciales: la amilasa salival digiere almidón, la pepsina gástrica descompone proteínas, y la lipasa pancreática hidroliza grasas. Sin enzimas, la digestión sería imposible.',
      xp: 15
    },
    {
      id: 'b018', area: 'biologia', tema: 'genetica_basica', dificultad: 2,
      pregunta: '¿Cuántos cromosomas tiene una célula humana normal (somática)?',
      opciones: ['23 cromosomas', '46 cromosomas', '48 cromosomas', '44 cromosomas'],
      correcta: 1,
      explicacion: 'Las células somáticas humanas tienen 46 cromosomas (23 pares). Los óvulos y espermatozoides tienen 23 (uno de cada par). Al fecundarse, el zigoto resultante tiene los 46. Alteraciones en el número de cromosomas causan enfermedades genéticas como el síndrome de Down (trisomía 21).',
      xp: 15
    },
    {
      id: 'b019', area: 'biologia', tema: 'genetica_basica', dificultad: 3,
      pregunta: '¿Qué relación existe entre los genes y las proteínas?',
      opciones: [
        'Los genes son proteínas compactadas en el núcleo',
        'Los genes contienen la información para sintetizar proteínas a través del ARN',
        'Las proteínas producen genes durante la digestión',
        'No hay relación directa entre genes y proteínas'
      ],
      correcta: 1,
      explicacion: 'El dogma central de la biología molecular: ADN → ARN → Proteína. Los genes son secuencias de ADN que codifican la estructura de proteínas. El ARN mensajero (ARNm) transporta esa información a los ribosomas, donde se sintetiza la proteína. Esto explica por qué la nutrición (aminoácidos) afecta la expresión génica.',
      xp: 20
    },
    {
      id: 'b020', area: 'biologia', tema: 'genetica_basica', dificultad: 3,
      pregunta: '¿Qué es la epigenética y cómo se relaciona con la nutrición?',
      opciones: [
        'El estudio de la herencia de rasgos físicos visibles',
        'Los cambios en la expresión génica causados por factores externos como la dieta, sin alterar el ADN',
        'La rama que estudia las mutaciones del ADN por radiación',
        'El proceso de replicación del ADN antes de la división celular'
      ],
      correcta: 1,
      explicacion: 'La epigenética estudia cómo el ambiente (incluyendo la dieta) modifica la expresión de genes sin cambiar la secuencia de ADN. Nutrientes como el folato, vitamina B12 y zinc afectan la metilación del ADN. Esto es un campo emergente en nutrición de precisión y prevención de enfermedades crónicas.',
      xp: 20
    },

    // ======================== QUÍMICA ========================

    // TEMA: CONCEPTOS BÁSICOS
    {
      id: 'q001', area: 'quimica', tema: 'conceptos_basicos', dificultad: 1,
      pregunta: '¿Cuál es la diferencia entre un elemento y un compuesto químico?',
      opciones: [
        'Un elemento tiene propiedades físicas; un compuesto tiene propiedades químicas',
        'Un elemento está formado por un solo tipo de átomo; un compuesto por dos o más elementos unidos',
        'Un compuesto siempre es líquido; un elemento siempre es sólido',
        'No hay diferencia práctica entre los dos'
      ],
      correcta: 1,
      explicacion: 'Un elemento (ej: oxígeno O₂, hierro Fe) está formado por átomos del mismo tipo. Un compuesto (ej: agua H₂O, glucosa C₆H₁₂O₆) está formado por dos o más elementos unidos químicamente. Los nutrientes son compuestos químicos complejos.',
      xp: 10
    },
    {
      id: 'q002', area: 'quimica', tema: 'conceptos_basicos', dificultad: 1,
      pregunta: '¿Qué es una reacción química?',
      opciones: [
        'El proceso de mezclar sustancias sin que cambien',
        'La transformación en la que sustancias (reactivos) se convierten en otras sustancias (productos)',
        'La separación física de componentes de una mezcla',
        'La disolución de un sólido en agua'
      ],
      correcta: 1,
      explicacion: 'En una reacción química los reactivos se transforman en productos con propiedades diferentes. La digestión es una serie de reacciones químicas: el almidón (reactivo) se convierte en glucosa (producto) gracias a enzimas. Las enzimas actúan como catalizadores que aceleran estas reacciones.',
      xp: 10
    },
    {
      id: 'q003', area: 'quimica', tema: 'conceptos_basicos', dificultad: 2,
      pregunta: '¿Cuál es la fórmula química del agua y qué propiedades hacen que sea esencial para la vida?',
      opciones: [
        'H₂O₂ — es un excelente oxidante',
        'H₂O — es polar, disuelve sustancias, regula temperatura y participa en reacciones metabólicas',
        'CO₂ — transporta nutrientes en la sangre',
        'NaCl — mantiene el equilibrio iónico'
      ],
      correcta: 1,
      explicacion: 'El agua (H₂O) es polar (tiene carga positiva y negativa), lo que le permite disolver sales, azúcares y muchas otras moléculas biológicas. Participa en reacciones de hidrólisis (digestión), regula la temperatura corporal y es el medio donde ocurren todas las reacciones metabólicas.',
      xp: 15
    },
    {
      id: 'q004', area: 'quimica', tema: 'conceptos_basicos', dificultad: 2,
      pregunta: '¿Qué es la hidrólisis y dónde ocurre en el proceso digestivo?',
      opciones: [
        'La síntesis de moléculas usando energía solar',
        'La ruptura de moléculas grandes usando agua, catalizadas por enzimas digestivas',
        'La deshidratación de alimentos para conservarlos',
        'La absorción de agua en el intestino grueso'
      ],
      correcta: 1,
      explicacion: 'La hidrólisis es la ruptura de enlaces químicos mediante agua. En la digestión: el almidón se hidroliza en glucosa, las proteínas en aminoácidos, y las grasas en glicerol y ácidos grasos. Las enzimas digestivas (amilasa, pepsina, lipasa) catalizan estas reacciones de hidrólisis.',
      xp: 15
    },
    {
      id: 'q005', area: 'quimica', tema: 'conceptos_basicos', dificultad: 3,
      pregunta: '¿Qué es la oxidación en términos bioquímicos y cómo se relaciona con la obtención de energía?',
      opciones: [
        'La reacción del hierro con el oxígeno para formar óxido',
        'La pérdida de electrones o hidrógenos de una molécula, proceso central en la respiración celular para producir ATP',
        'La síntesis de grasas a partir de glucosa en exceso',
        'La destrucción de vitaminas por exposición al calor'
      ],
      correcta: 1,
      explicacion: 'En bioquímica, la oxidación implica pérdida de electrones o hidrógenos. En la respiración celular, la glucosa se oxida progresivamente, liberando energía que se captura en forma de ATP. Este es el proceso fundamental por el cual los alimentos se convierten en energía utilizable.',
      xp: 20
    },

    // TEMA: pH Y SOLUCIONES
    {
      id: 'q006', area: 'quimica', tema: 'ph_soluciones', dificultad: 1,
      pregunta: '¿Qué valores de pH corresponden a sustancias ácidas, neutras y básicas?',
      opciones: [
        'Ácido: 7-14, Neutro: 0-7, Básico: superior a 14',
        'Ácido: 0-7, Neutro: 7, Básico: 7-14',
        'Ácido: 7-14, Neutro: 14, Básico: 0-7',
        'Todos los valores del pH corresponden a ácidos'
      ],
      correcta: 1,
      explicacion: 'La escala de pH va de 0 a 14. pH menor a 7 = ácido (ej: jugo gástrico pH 1.5-3.5), pH 7 = neutro (agua pura), pH mayor a 7 = básico/alcalino (ej: bicarbonato pH 8.3). La sangre tiene un pH muy controlado entre 7.35-7.45 — alteraciones son peligrosas.',
      xp: 10
    },
    {
      id: 'q007', area: 'quimica', tema: 'ph_soluciones', dificultad: 1,
      pregunta: '¿Por qué el estómago tiene un pH muy ácido (entre 1.5 y 3.5)?',
      opciones: [
        'Para matar todos los microorganismos de los alimentos',
        'Porque el ácido clorhídrico activa la pepsina y permite la digestión de proteínas',
        'Para neutralizar los alimentos básicos que consumimos',
        'Para disolver los minerales de los alimentos más rápido'
      ],
      correcta: 1,
      explicacion: 'El ácido clorhídrico (HCl) del estómago crea el ambiente ácido necesario para que la pepsina (enzima proteolítica) funcione. Además, desnaturaliza proteínas facilitando su digestión y actúa como barrera contra patógenos. El pH ácido es esencial para una digestión proteica efectiva.',
      xp: 10
    },
    {
      id: 'q008', area: 'quimica', tema: 'ph_soluciones', dificultad: 2,
      pregunta: '¿Qué es la osmosis y cómo afecta la nutrición celular?',
      opciones: [
        'El movimiento de solutos de menor a mayor concentración',
        'El movimiento de agua a través de una membrana semipermeable de menor a mayor concentración de solutos',
        'La difusión de glucosa hacia el interior de la célula',
        'El transporte activo de iones contra gradiente de concentración'
      ],
      correcta: 1,
      explicacion: 'La osmosis es el movimiento del agua a través de membranas desde donde hay menos solutos (menos concentrado) hacia donde hay más. En nutrición es fundamental: si consumimos mucha sal, aumenta la concentración extracelular y el agua sale de las células (deshidratación celular). Por eso el equilibrio de electrolitos importa.',
      xp: 15
    },
    {
      id: 'q009', area: 'quimica', tema: 'ph_soluciones', dificultad: 2,
      pregunta: '¿Qué es una solución tampón (buffer) y dónde es importante en el cuerpo?',
      opciones: [
        'Una solución que acelera las reacciones enzimáticas',
        'Un sistema que resiste cambios bruscos de pH, fundamental en sangre y líquidos corporales',
        'Una mezcla de nutrientes para reponer electrolitos',
        'Un tipo de ácido graso que protege las membranas celulares'
      ],
      correcta: 1,
      explicacion: 'Los sistemas tampón (ej: bicarbonato/CO₂ en sangre) resisten variaciones de pH. La sangre debe mantenerse entre pH 7.35-7.45; fuera de ese rango ocurre acidosis o alcalosis, condiciones potencialmente fatales. La dieta afecta el equilibrio ácido-base del organismo.',
      xp: 15
    },
    {
      id: 'q010', area: 'quimica', tema: 'ph_soluciones', dificultad: 3,
      pregunta: '¿Qué efecto tiene una dieta alta en proteínas animales sobre el pH del organismo?',
      opciones: [
        'Hace el organismo más alcalino porque las proteínas son básicas',
        'No afecta el pH porque el cuerpo tiene sistemas tampón perfectos',
        'Tiende a generar una carga ácida que los riñones y sistemas tampón deben neutralizar',
        'Aumenta el pH de la orina haciéndola más básica'
      ],
      correcta: 2,
      explicacion: 'El metabolismo de proteínas animales genera ácidos (sulfúrico, fosfórico). El organismo los neutraliza con sistemas tampón y los excreta por los riñones. Dietas muy altas en proteínas pueden sobrecargar este sistema. Las frutas y verduras, por el contrario, generan residuos alcalinos que ayudan al equilibrio.',
      xp: 20
    },

    // TEMA: QUÍMICA ORGÁNICA
    {
      id: 'q011', area: 'quimica', tema: 'organica', dificultad: 1,
      pregunta: '¿Qué caracteriza a los compuestos orgánicos?',
      opciones: [
        'Son producidos únicamente por organismos vivos actuales',
        'Están basados en el carbono y generalmente contienen hidrógeno',
        'Son siempre naturales y nunca artificiales',
        'Solo se encuentran en los alimentos de origen vegetal'
      ],
      correcta: 1,
      explicacion: 'Los compuestos orgánicos se caracterizan por tener carbono como elemento central, generalmente acompañado de hidrógeno, oxígeno, nitrógeno y otros elementos. Los carbohidratos, proteínas, lípidos y vitaminas son todos compuestos orgánicos, base de la química nutricional.',
      xp: 10
    },
    {
      id: 'q012', area: 'quimica', tema: 'organica', dificultad: 2,
      pregunta: '¿Cuál es la diferencia entre un ácido graso saturado y uno insaturado?',
      opciones: [
        'Los saturados tienen dobles enlaces en su cadena; los insaturados no',
        'Los saturados no tienen dobles enlaces (están "saturados" de hidrógeno); los insaturados tienen uno o más dobles enlaces',
        'Los saturados son líquidos a temperatura ambiente; los insaturados son sólidos',
        'No hay diferencia química, solo de origen (animal vs vegetal)'
      ],
      correcta: 1,
      explicacion: 'Los ácidos grasos saturados (mantequilla, grasa animal) no tienen dobles enlaces C=C y son sólidos a temperatura ambiente. Los insaturados (aceite de oliva, aguacate, pescado) tienen uno o más dobles enlaces, son líquidos y se asocian a beneficios cardiovasculares. Los trans son insaturados artificialmente saturados.',
      xp: 15
    },
    {
      id: 'q013', area: 'quimica', tema: 'organica', dificultad: 2,
      pregunta: '¿Qué grupo funcional caracteriza a los aminoácidos y les da sus propiedades únicas?',
      opciones: [
        'Solo el grupo carboxilo (-COOH)',
        'Solo el grupo amino (-NH₂)',
        'Tanto el grupo amino (-NH₂) como el carboxilo (-COOH), más una cadena lateral variable (R)',
        'El grupo hidroxilo (-OH) y el grupo carbonilo (C=O)'
      ],
      correcta: 2,
      explicacion: 'Los aminoácidos tienen tres partes clave: grupo amino (-NH₂), grupo carboxilo (-COOH) y una cadena lateral R que es diferente en cada uno de los 20 aminoácidos. Esa cadena R determina las propiedades del aminoácido (carga, tamaño, reactividad) y por ende las propiedades de la proteína que forman.',
      xp: 15
    },
    {
      id: 'q014', area: 'quimica', tema: 'organica', dificultad: 3,
      pregunta: '¿Por qué el colesterol no es inherentemente "malo" para el organismo?',
      opciones: [
        'Porque solo es malo en personas con problemas cardíacos previos',
        'Porque el colesterol es esencial como componente de membranas celulares, precursor de hormonas esteroideas y vitamina D',
        'Porque el colesterol dietario no afecta el colesterol sanguíneo',
        'Porque el hígado elimina todo el colesterol que consumimos'
      ],
      correcta: 1,
      explicacion: 'El colesterol cumple funciones vitales: es componente estructural de todas las membranas celulares, precursor de hormonas esteroideas (testosterona, estrógeno, cortisol), vitamina D y ácidos biliares. El problema no es el colesterol per se sino el exceso de LDL oxidado y la inflamación vascular.',
      xp: 20
    },

    // TEMA: VITAMINAS Y MINERALES
    {
      id: 'q015', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 1,
      pregunta: '¿Cuál es la diferencia entre vitaminas liposolubles e hidrosolubles?',
      opciones: [
        'Las liposolubles se encuentran en vegetales; las hidrosolubles en carnes',
        'Las liposolubles se disuelven en grasa y se almacenan en tejidos; las hidrosolubles en agua y se excretan por orina',
        'Las hidrosolubles son más importantes que las liposolubles',
        'No hay diferencia en su función, solo en su sabor'
      ],
      correcta: 1,
      explicacion: 'Vitaminas liposolubles (A, D, E, K) se almacenan en hígado y tejido adiposo — su exceso puede acumularse y ser tóxico. Vitaminas hidrosolubles (C y complejo B) se disuelven en agua, no se almacenan significativamente y se excretan en orina — deben consumirse regularmente.',
      xp: 10
    },
    {
      id: 'q016', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 1,
      pregunta: '¿Cuál es la función principal de la vitamina D en el organismo?',
      opciones: [
        'Actuar como antioxidante en las membranas celulares',
        'Facilitar la absorción de calcio y fósforo para la salud ósea',
        'Participar en la coagulación sanguínea',
        'Sintetizar colágeno para la piel y cartílagos'
      ],
      correcta: 1,
      explicacion: 'La vitamina D (calciferol) regula la absorción de calcio y fósforo en el intestino, esencial para la mineralización ósea. Su deficiencia causa raquitismo en niños y osteoporosis en adultos. El cuerpo la sintetiza con exposición solar. También tiene roles en el sistema inmune y muscular.',
      xp: 10
    },
    {
      id: 'q017', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 2,
      pregunta: '¿Por qué el hierro de fuentes vegetales (no hemo) se absorbe menos que el de fuentes animales (hemo)?',
      opciones: [
        'Porque las plantas contienen menos hierro en términos absolutos',
        'Porque el hierro hemo está en una forma química más biodisponible y no es afectado por inhibidores dietarios',
        'Porque el sistema digestivo no tiene enzimas para procesar hierro vegetal',
        'No hay diferencia en la absorción entre hierro hemo y no hemo'
      ],
      correcta: 1,
      explicacion: 'El hierro hemo (carnes, pescado) está en forma de hemoglobina/mioglobina y se absorbe en un 15-35%. El no hemo (legumbres, espinaca) se absorbe solo 2-20% y es afectado por inhibidores (fitatos, oxalatos) y potenciadores (vitamina C). Por eso los vegetarianos deben consumir más hierro total y combinarlo con vitamina C.',
      xp: 15
    },
    {
      id: 'q018', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 2,
      pregunta: '¿Cuál es la función del sodio y el potasio en el organismo?',
      opciones: [
        'El sodio construye huesos y el potasio transporta oxígeno',
        'Ambos regulan el equilibrio hídrico, el potencial de membrana neuronal y la presión arterial',
        'El sodio activa enzimas digestivas y el potasio sintetiza proteínas',
        'Son minerales de reserva energética almacenados en el hígado'
      ],
      correcta: 1,
      explicacion: 'Sodio (Na⁺) y potasio (K⁺) son electrolitos clave: regulan el volumen de líquidos corporales, mantienen el potencial eléctrico de las membranas nerviosas y musculares, y controlan la presión arterial. El exceso de sodio eleva la presión; el potasio la contrarresta. La bomba Na⁺/K⁺-ATPasa es esencial para el funcionamiento nervioso.',
      xp: 15
    },
    {
      id: 'q019', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 3,
      pregunta: '¿Qué es un antioxidante y cuáles vitaminas cumplen esa función?',
      opciones: [
        'Sustancias que aceleran la oxidación de nutrientes para producir más energía',
        'Moléculas que neutralizan los radicales libres, protegiendo las células del daño oxidativo; principalmente vitaminas C, E y beta-caroteno (pro-vitamina A)',
        'Enzimas que descomponen las grasas oxidadas en el tracto digestivo',
        'Minerales que inhiben la absorción de sustancias tóxicas en el intestino'
      ],
      correcta: 1,
      explicacion: 'Los radicales libres son moléculas inestables que dañan células y se asocian al envejecimiento y enfermedades crónicas. Los antioxidantes los neutralizan. La vitamina C (hidrosoluble), vitamina E (liposoluble) y beta-caroteno son antioxidantes dietarios clave. El selenio y zinc también apoyan sistemas antioxidantes enzimáticos.',
      xp: 20
    },
    {
      id: 'q020', area: 'quimica', tema: 'vitaminas_minerales', dificultad: 3,
      pregunta: '¿Cuál es el papel del calcio más allá de la salud ósea?',
      opciones: [
        'El calcio solo funciona en huesos y dientes, sin otros roles',
        'El calcio también regula la contracción muscular, la transmisión nerviosa, la coagulación sanguínea y la señalización celular',
        'El calcio actúa principalmente como antioxidante en la sangre',
        'El calcio es el principal transportador de oxígeno en la hemoglobina'
      ],
      correcta: 1,
      explicacion: 'El calcio es un mineral multifuncional: ~99% está en huesos/dientes (estructura), pero el 1% restante es crucial para: contracción muscular (incluido el corazón), transmisión de impulsos nerviosos, coagulación sanguínea (factor IV) y señalización intracelular. Su deficiencia afecta mucho más que los huesos.',
      xp: 20
    },

    // ======================== MATEMÁTICAS ========================

    // TEMA: PROPORCIONES
    {
      id: 'm001', area: 'matematicas', tema: 'proporciones', dificultad: 1,
      pregunta: 'Si una porción de arroz de 100g contiene 28g de carbohidratos, ¿cuántos gramos de carbohidratos habrá en una porción de 250g?',
      opciones: ['56g', '70g', '84g', '28g'],
      correcta: 1,
      explicacion: 'Regla de tres simple: Si 100g → 28g de carbohidratos, entonces 250g → X. X = (250 × 28) / 100 = 70g. Esta operación es fundamental en el cálculo de porciones dietéticas y en la elaboración de planes de alimentación.',
      xp: 10
    },
    {
      id: 'm002', area: 'matematicas', tema: 'proporciones', dificultad: 1,
      pregunta: 'Un paciente debe consumir el 15% de sus calorías en forma de proteína. Si su dieta es de 2000 kcal/día, ¿cuántas calorías corresponden a proteína?',
      opciones: ['150 kcal', '300 kcal', '200 kcal', '250 kcal'],
      correcta: 1,
      explicacion: '15% de 2000 = 0.15 × 2000 = 300 kcal. El manejo de porcentajes es esencial en nutrición para distribuir macronutrientes. Recuerda: proteínas = 4 kcal/g, carbohidratos = 4 kcal/g, grasas = 9 kcal/g.',
      xp: 10
    },
    {
      id: 'm003', area: 'matematicas', tema: 'proporciones', dificultad: 2,
      pregunta: 'Si una receta para 4 personas requiere 200g de pollo, ¿cuántos gramos se necesitan para preparar la misma receta para 7 personas?',
      opciones: ['300g', '350g', '400g', '280g'],
      correcta: 1,
      explicacion: 'Regla de tres: Si 4 personas → 200g, entonces 7 personas → X. X = (7 × 200) / 4 = 350g. El escalado de recetas es una habilidad práctica cotidiana del nutricionista en servicios de alimentación colectiva.',
      xp: 15
    },
    {
      id: 'm004', area: 'matematicas', tema: 'proporciones', dificultad: 2,
      pregunta: 'Un deportista consume 1.8g de proteína por kg de peso corporal. Si pesa 75kg, ¿cuántos gramos de proteína debe consumir al día?',
      opciones: ['100g', '120g', '135g', '150g'],
      correcta: 2,
      explicacion: '1.8g × 75kg = 135g de proteína/día. Las recomendaciones proteicas en deportistas se expresan en g/kg de peso. Las guías actuales recomiendan entre 1.2-2.0 g/kg/día según el tipo e intensidad del entrenamiento.',
      xp: 15
    },
    {
      id: 'm005', area: 'matematicas', tema: 'proporciones', dificultad: 3,
      pregunta: 'Si el 60% de las calorías de una dieta de 1800 kcal deben provenir de carbohidratos, ¿cuántos gramos de carbohidratos son?',
      opciones: ['240g', '270g', '300g', '180g'],
      correcta: 1,
      explicacion: 'Paso 1: 60% de 1800 kcal = 1080 kcal de carbohidratos. Paso 2: Como cada gramo de carbohidrato aporta 4 kcal → 1080 ÷ 4 = 270g. Este cálculo de conversión kcal → gramos es fundamental en la elaboración de planes alimentarios.',
      xp: 20
    },

    // TEMA: CALORÍAS
    {
      id: 'm006', area: 'matematicas', tema: 'calorias', dificultad: 1,
      pregunta: '¿Cuántas kilocalorías aporta 1 gramo de cada macronutriente?',
      opciones: [
        'Proteína: 9 kcal, Carbohidrato: 4 kcal, Grasa: 4 kcal',
        'Proteína: 4 kcal, Carbohidrato: 4 kcal, Grasa: 9 kcal',
        'Proteína: 4 kcal, Carbohidrato: 9 kcal, Grasa: 4 kcal',
        'Todos aportan 4 kcal por gramo'
      ],
      correcta: 1,
      explicacion: 'Los valores calóricos (Sistema Atwater): Carbohidratos = 4 kcal/g, Proteínas = 4 kcal/g, Grasas = 9 kcal/g, Alcohol = 7 kcal/g. Las grasas aportan más del doble que los otros macros. Memorizar estos valores es fundamental para cualquier cálculo nutricional.',
      xp: 10
    },
    {
      id: 'm007', area: 'matematicas', tema: 'calorias', dificultad: 1,
      pregunta: 'Una porción de alimento contiene 20g de carbohidratos, 15g de proteína y 8g de grasa. ¿Cuántas kilocalorías tiene en total?',
      opciones: ['172 kcal', '212 kcal', '196 kcal', '188 kcal'],
      correcta: 1,
      explicacion: 'Carbohidratos: 20 × 4 = 80 kcal. Proteínas: 15 × 4 = 60 kcal. Grasas: 8 × 9 = 72 kcal. Total: 80 + 60 + 72 = 212 kcal. Este es el cálculo básico del valor calórico de cualquier alimento o comida.',
      xp: 10
    },
    {
      id: 'm008', area: 'matematicas', tema: 'calorias', dificultad: 2,
      pregunta: '¿Qué es el IMC y cómo se calcula?',
      opciones: [
        'Índice Metabólico Corporal = Peso (kg) × Talla (m)',
        'Índice de Masa Corporal = Peso (kg) / Talla² (m²)',
        'Índice de Masa Corporal = Peso (lb) / Talla (cm) × 100',
        'Índice Metabólico Corporal = Calorías consumidas / Calorías gastadas'
      ],
      correcta: 1,
      explicacion: 'IMC = Peso (kg) / Talla² (m²). Clasificación OMS: <18.5 = bajo peso, 18.5-24.9 = normal, 25-29.9 = sobrepeso, ≥30 = obesidad. Ejemplo: 70kg / (1.70m)² = 70/2.89 = 24.2 (normal). El IMC tiene limitaciones (no distingue músculo de grasa) pero es el indicador más usado en salud pública.',
      xp: 15
    },
    {
      id: 'm009', area: 'matematicas', tema: 'calorias', dificultad: 2,
      pregunta: 'Usando la fórmula de Harris-Benedict, el metabolismo basal de un hombre de 25 años, 70kg y 175cm es aproximadamente 1750 kcal. Si tiene un factor de actividad de 1.55 (ejercicio moderado), ¿cuál es su gasto calórico total diario?',
      opciones: ['2100 kcal', '2413 kcal', '2712 kcal', '1950 kcal'],
      correcta: 1,
      explicacion: 'Gasto calórico total = Metabolismo basal × Factor de actividad. 1750 × 1.55 = 2712.5 ≈ 2713 kcal. Los factores de actividad son: 1.2 (sedentario), 1.375 (ligero), 1.55 (moderado), 1.725 (intenso), 1.9 (muy intenso). Este cálculo es la base para establecer el aporte calórico de cualquier plan dietético.',
      xp: 15
    },
    {
      id: 'm010', area: 'matematicas', tema: 'calorias', dificultad: 3,
      pregunta: 'Para perder 0.5kg de grasa por semana, ¿cuántas kilocalorías debe reducir diariamente de su dieta un paciente? (1kg de grasa ≈ 7700 kcal)',
      opciones: ['385 kcal/día', '550 kcal/día', '770 kcal/día', '1100 kcal/día'],
      correcta: 1,
      explicacion: '0.5kg de grasa = 0.5 × 7700 = 3850 kcal a reducir en la semana. Por día: 3850 ÷ 7 días = 550 kcal/día de déficit. Este cálculo es la base del manejo nutricional del peso. El déficit puede lograrse combinando reducción dietaria y aumento de actividad física.',
      xp: 20
    },

    // TEMA: ESTADÍSTICA
    {
      id: 'm011', area: 'matematicas', tema: 'estadistica', dificultad: 1,
      pregunta: 'En un grupo de 5 pacientes, los IMC son: 22, 25, 28, 30 y 25. ¿Cuál es el IMC promedio del grupo?',
      opciones: ['25', '26', '27', '28'],
      correcta: 1,
      explicacion: 'Promedio = Suma de valores / Número de valores. (22 + 25 + 28 + 30 + 25) / 5 = 130 / 5 = 26. El promedio es la medida de tendencia central más usada en estadística descriptiva nutricional para caracterizar grupos de pacientes.',
      xp: 10
    },
    {
      id: 'm012', area: 'matematicas', tema: 'estadistica', dificultad: 2,
      pregunta: 'En los mismos 5 pacientes con IMC: 22, 25, 25, 28, 30. ¿Cuál es la mediana?',
      opciones: ['25', '26', '27', '28'],
      correcta: 0,
      explicacion: 'La mediana es el valor central cuando los datos están ordenados. Ordenados: 22, 25, 25, 28, 30. El valor central (posición 3 de 5) es 25. La mediana es menos sensible a valores extremos (outliers) que el promedio, por eso se usa en distribuciones asimétricas de datos nutricionales.',
      xp: 15
    },
    {
      id: 'm013', area: 'matematicas', tema: 'estadistica', dificultad: 2,
      pregunta: 'Una tabla nutricional muestra que el 30% de la población tiene déficit de vitamina D, el 45% tiene niveles óptimos y el 25% tiene exceso. Si la población estudiada fue de 800 personas, ¿cuántas tienen déficit?',
      opciones: ['200 personas', '240 personas', '280 personas', '300 personas'],
      correcta: 1,
      explicacion: '30% de 800 = 0.30 × 800 = 240 personas. La interpretación de datos epidemiológicos en tablas y porcentajes es una competencia esencial del nutricionista en salud pública y en la lectura de estudios científicos.',
      xp: 15
    },

    // TEMA: UNIDADES
    {
      id: 'm014', area: 'matematicas', tema: 'unidades', dificultad: 1,
      pregunta: '¿Cuántos miligramos hay en 1 gramo?',
      opciones: ['10 mg', '100 mg', '1000 mg', '10000 mg'],
      correcta: 2,
      explicacion: '1 gramo = 1000 miligramos. Las dosis de micronutrientes (vitaminas, minerales) se expresan en miligramos (mg) o microgramos (μg). 1g = 1000mg = 1,000,000μg. Confundir estas unidades en una prescripción nutricional puede ser crítico.',
      xp: 10
    },
    {
      id: 'm015', area: 'matematicas', tema: 'unidades', dificultad: 2,
      pregunta: 'La recomendación de calcio para adultos es 1000mg/día. Si un vaso de leche (250ml) aporta 300mg de calcio, ¿cuántos vasos se necesitan para cubrir solo con leche el requerimiento diario?',
      opciones: ['2 vasos', '3 vasos y algo más', '4 vasos exactos', '5 vasos'],
      correcta: 1,
      explicacion: '1000mg ÷ 300mg por vaso = 3.33 vasos. Es decir, 3 vasos y un tercio adicional. En la práctica esto significa que solo con leche no se cubre el requerimiento en exactamente 3 vasos — se necesita complementar con otros lácteos o fuentes de calcio (brócoli, legumbres, tofu). Este tipo de cálculo guía las recomendaciones alimentarias.',
      xp: 15
    },

    // ======================== LECTURA CRÍTICA ========================

    {
      id: 'l001', area: 'lectura_critica', tema: 'idea_principal', dificultad: 1,
      pregunta: 'Lee el siguiente párrafo y selecciona su idea principal:\n\n"La malnutrición en Colombia afecta tanto a personas con déficit calórico como a aquellas con exceso. El 35% de los menores de 5 años presenta retraso en talla, mientras que el 17% de la población adulta sufre obesidad. Esta doble carga nutricional exige políticas de salud pública integrales que aborden simultáneamente la desnutrición y el sobrepeso."\n',
      opciones: [
        'Colombia tiene el 35% de menores con retraso en talla',
        'Colombia enfrenta una doble carga nutricional que requiere políticas integrales',
        'La obesidad afecta al 17% de los adultos colombianos',
        'Las políticas de salud pública son ineficientes en Colombia'
      ],
      correcta: 1,
      explicacion: 'La idea principal es la afirmación central que todo el párrafo defiende. Los datos del 35% y el 17% son evidencias de apoyo. La conclusión — "doble carga nutricional que exige políticas integrales" — es la idea principal. En lectura crítica se distingue entre la tesis y los argumentos que la sostienen.',
      xp: 10
    },
    {
      id: 'l002', area: 'lectura_critica', tema: 'argumentacion', dificultad: 2,
      pregunta: '"Consumir suplementos de proteína en polvo es innecesario para la mayoría de las personas que hacen ejercicio regularmente, ya que una dieta variada y equilibrada puede cubrir fácilmente los requerimientos proteicos de un deportista recreativo."\n\n¿Cuál de las siguientes afirmaciones DEBILITARÍA este argumento?',
      opciones: [
        'Los suplementos son costosos comparados con fuentes alimentarias de proteína',
        'Estudios muestran que atletas recreativos que consumen proteína adicional tienen mayor masa muscular que los que no la consumen',
        'La industria de suplementos mueve millones de dólares al año en Colombia',
        'La proteína de huevo tiene mayor valor biológico que la proteína de suero de leche'
      ],
      correcta: 1,
      explicacion: 'Un argumento se debilita cuando se presenta evidencia que contradice su conclusión. Si estudios muestran que la proteína adicional sí genera mayor masa muscular (incluso en recreativos), el argumento de que "es innecesaria" pierde fuerza. La opción del costo no contradice la efectividad. La opción de la industria es un argumento ad hominem irrelevante.',
      xp: 15
    },
    {
      id: 'l003', area: 'lectura_critica', tema: 'tablas_graficas', dificultad: 2,
      pregunta: 'Una tabla muestra el aporte calórico de tres alimentos por 100g:\n• Arroz cocido: 130 kcal\n• Pechuga de pollo a la plancha: 165 kcal\n• Aguacate: 160 kcal\n\n¿Qué conclusión es válida basándose SOLO en esta información?',
      opciones: [
        'El pollo es el alimento más nutritivo de los tres',
        'El arroz es el alimento menos calórico de los tres por 100g',
        'El aguacate es el alimento menos saludable por tener más calorías que el arroz',
        'Una dieta balanceada debe excluir el aguacate por su alto contenido calórico'
      ],
      correcta: 1,
      explicacion: 'La única conclusión que se puede extraer directamente de los datos es que el arroz (130 kcal) tiene menos calorías que el pollo (165) y el aguacate (160) por 100g. Afirmar que algo es "más nutritivo" o "menos saludable" requiere información adicional (proteínas, vitaminas, grasas) que la tabla no proporciona. En lectura crítica, las conclusiones deben limitarse a lo que los datos realmente muestran.',
      xp: 15
    },
    {
      id: 'l004', area: 'lectura_critica', tema: 'ciencia_salud', dificultad: 3,
      pregunta: '"Un estudio encontró que personas que desayunan pierden más peso que quienes no desayunan."\n\n¿Cuál es la limitación más importante de esta afirmación para sacar conclusiones definitivas?',
      opciones: [
        'El desayuno no es una comida importante en la cultura colombiana',
        'No se puede establecer causalidad: desayunar puede ser un marcador de otros hábitos saludables, no la causa directa de la pérdida de peso',
        'La muestra del estudio probablemente fue pequeña',
        'Los estudios sobre alimentación siempre tienen sesgos políticos'
      ],
      correcta: 1,
      explicacion: 'Este es un error clásico de confusión entre correlación y causalidad. Las personas que desayunan también pueden tener otras conductas saludables (ejercicio, mejor calidad dietaria general, mayor adherencia a hábitos), que son las que realmente explican la pérdida de peso. En ciencia nutricional, distinguir correlación de causalidad es fundamental para evaluar evidencia.',
      xp: 20
    },
    {
      id: 'l005', area: 'lectura_critica', tema: 'ciencia_salud', dificultad: 3,
      pregunta: '"Según la OMS, el consumo excesivo de azúcares libres está asociado con mayor riesgo de caries dental y ganancia de peso no saludable. Se recomienda que los azúcares libres representen menos del 10% de la ingesta calórica total."\n\n¿Qué tipo de recomendación es esta?',
      opciones: [
        'Una prohibición legal de consumo de azúcar en países miembros de la OMS',
        'Una guía basada en evidencia científica que establece un umbral para reducir riesgos de salud',
        'Una opinión de expertos sin respaldo en estudios científicos',
        'Una recomendación aplicable solo a personas con diabetes'
      ],
      correcta: 1,
      explicacion: 'Las directrices de la OMS son recomendaciones basadas en revisiones sistemáticas de evidencia científica. No son leyes ni prohibiciones. El "10%" es un umbral de riesgo (no un límite absoluto) derivado de estudios epidemiológicos y clínicos. Saber interpretar este tipo de documentos técnicos es esencial para el nutricionista.',
      xp: 20
    }
  ]
};

// ============================================================
// SISTEMA DE NIVELES — escalable agregando más entradas
// ============================================================
const NIVELES = [
  { nivel: 1, nombre: 'Aspirante', xpRequerido: 0, color: '#6b7280' },
  { nivel: 2, nombre: 'Estudiante', xpRequerido: 100, color: '#22c55e' },
  { nivel: 3, nombre: 'Analista', xpRequerido: 250, color: '#3b82f6' },
  { nivel: 4, nombre: 'Experto/a', xpRequerido: 500, color: '#f59e0b' },
  { nivel: 5, nombre: 'Profesional', xpRequerido: 900, color: '#ec4899' },
  { nivel: 6, nombre: 'Nutricionista', xpRequerido: 1400, color: '#6c63ff' }
];
