const products = [

    //CARDIO

    //Bicicletas Estaticas

    {
        name: "Bicicleta estática YOSUDA",
        type: "Modelo Clasico",
        creationDate: "2024-06-24",
        description: "La bicicleta estática YOSUDA para ciclismo indoor cuenta con freno de almohadilla/magnético, soporte para iPad y asiento acolchado. Ideal para entrenamientos en casa, ofrece comodidad y funcionalidad.",
        price: 1250000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/YOSUDA-bike1.jpg", "https://fitnest-bucket.s3.amazonaws.com/YOSUDA-bike2.jpg", "https://fitnest-bucket.s3.amazonaws.com/YOSUDA-bike3.jpg"],
        categoryName: "Bicicletas Estaticas",
        status: 'Activo'
    },
    {
        name: "Bicicleta estática DMASUN",
        type: "Negro-rojo",
        creationDate: "2024-06-24",
        description: "La bicicleta estática DMASUN cuenta con resistencia magnética/pad de freno, asiento cómodo, pantalla digital con pulso y capacidad de peso de 300/330 libras. Ideal para ciclismo indoor y entrenamientos intensos en casa.",
        price: 1100000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/DMASUN-bike1.jpg", "https://fitnest-bucket.s3.amazonaws.com/DMASUN-bike2.jpg", "https://fitnest-bucket.s3.amazonaws.com/DMASUN-bike3.jpg",],
        categoryName: "Bicicletas Estaticas",
        status: 'Activo'
    },

    //Cintas de Correr

    {
        name: "Caminadora portátil Lifepro",
        type: "30 pulgadas",
        creationDate: "2024-06-24",
        description: "La caminadora portátil Lifepro de 30 pulgadas es compacta y no requiere instalación, con inclinación ajustable y diseño para uso bajo escritorio. Ideal para hogar u oficina, soporta hasta 220 libras y alcanza una velocidad máxima de 3 MPH.",
        price: 800000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/treadmill-lifepro1.jpg", "https://fitnest-bucket.s3.amazonaws.com/treadmill-lifepro2.jpg", "https://fitnest-bucket.s3.amazonaws.com/treadmill-lifepro3.jpg",],
        categoryName: "Cintas de correr",
        status: 'Activo'
    },
    {
        name: "Caminadora UMAY Fitness",
        type: "Negra - 7 velocidades",
        creationDate: "2024-06-24",
        description: "La caminadora UMAY Fitness para el hogar tiene inclinación automática, sensores de pulso y un motor silencioso de 3.0 HP. Alcanza velocidades de hasta 8.7 MPH y soporta hasta 300 libras.",
        price: 800000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/treadmill-UMAY.jpg","https://fitnest-bucket.s3.amazonaws.com/treadmill-UMAY2.jpg", "https://fitnest-bucket.s3.amazonaws.com/treadmill-UMAY3.jpg",],
        categoryName: "Cintas de correr",
        status: 'Activo'
    },
    
    //FUERZA

    //Mancuernas:

    {
        name: "Marcuerna RitFit",
        type: "5kg",
        creationDate: "2024-06-24",
        description: "Mancuerna hexagonal de ejercicio y fitness con recubrimiento de goma, individual, peso de mano para entrenamiento de fuerza",
        price: 150000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/mancuerna.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna3.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna4.jpg"],
        categoryName: "Mancuernas",
        status: 'Activo'
    },
    {
        name: "Kit Mancuernas",
        type: "17.2lb total 38 lbs",
        creationDate: "2024-06-24",
        description: "Juego de pesas ajustables con estuche, 17.2 lb cada una, set de 2, total 38 libras, color negro. El set incluye dos mancuernas de 2.7 lb, cuatro discos de 2.5 lb, cuatro discos de 5 lb y cuatro cierres de 0.5 lb. Ideal para trabajar grupos musculares individuales como brazos, hombros y espalda, o para incorporar en un entrenamiento de cuerpo completo. Ajusta el peso rápidamente deslizando los discos y asegurándolos con los cierres roscados. Viene con un estuche de almacenamiento duradero y negro, con asa para facilitar el transporte y almacenamiento compacto.",
        price: 300000,
        rating: 0.0,
        image_urls: ["https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable1.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable2.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable3.jpg"],
        categoryName: "Mancuernas",
        status: 'Activo'
    },
    {
        name: "Rack de mancuernas",
        type: "Set de 150lbs",
        creationDate: "2024-06-24",
        description: "El set incluye un par de mancuernas de 5, 10, 15, 20 y 25 libras de goma hexagonal, junto con un soporte en forma de A negro para almacenarlas. El embalaje está diseñado para comercio electrónico y se envía en varias cajas.",
        price: 800000,
        rating: 0.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/rack-mancuernas1.jpg", "https://fitnest-bucket.s3.amazonaws.com/rack-mancuernas2.jpg", "https://fitnest-bucket.s3.amazonaws.com/rack-mancuernas3.jpg"],
        categoryName: "Mancuernas",
        status: 'Activo'
    },
    {
        name: "Mancuernas ajustables",
        type: "Set ajustable de 25/55 lbs",
        creationDate: "2024-06-24",
        description: "Set de mancuernas ajustables de 25/55 libras, diseñado para hombres y mujeres. Estas mancuernas permiten ajustar rápidamente el peso girando el mango, y cuentan con un diseño antideslizante para mayor seguridad. El set incluye una bandeja negra para facilitar su almacenamiento y organización. Perfectas para una variedad de entrenamientos de fuerza y acondicionamiento físico.",
        price: 400000,
        rating: 0.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable-plastico1.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable-plastico2.jpg", "https://fitnest-bucket.s3.amazonaws.com/mancuerna-ajustable-plastico3.jpg",],
        categoryName: "Mancuernas",
        status: 'Activo'
    },

    //Barras y discos,
    {
        name: "Barra olimpica",
        type: "44lb 28mmm",
        creationDate: "2024-06-24",
        description: `Barra de peso CAP de acero laminado en frío con acabado cromado, compatible con discos olímpicos (agujero de 2"). Mide 2185 mm de largo, con eje de 51.75", manguito de 15.3", empuñadura de 28 mm, 54,000 PSI de resistencia a la tracción y pesa 16 kg.`,
        price: 400000,
        rating: 0.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/barbell1.jpg", "https://fitnest-bucket.s3.amazonaws.com/barbell2.jpg", "https://fitnest-bucket.s3.amazonaws.com/barbell3.jpg"],
        categoryName: "Barras y Discos",
        status: 'Activo'
    },
    {
        name: "Barra olimpica curva",
        type: "Gris 15lbs",
        creationDate: "2024-06-24",
        description: `La barra olímpica EZ para curl es una barra versátil para entrenamiento de fuerza, ideal para levantamiento de pesas, hip thrusts, sentadillas y estocadas. Fabricada con acero laminado en frío y acabado cromado roscado, ofrece durabilidad y un agarre seguro.`,
        price: 200000,
        rating: 0.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/curved-barbell1.jpg", "https://fitnest-bucket.s3.amazonaws.com/curved-barbell2.jpg", "https://fitnest-bucket.s3.amazonaws.com/curved-barbell3.jpg"],
        categoryName: "Barras y Discos",
        status: 'Activo'
    },
    {
        name: "Barra olimpica enjaulada",
        type: "Negra",
        creationDate: "2024-06-24",
        description: `La barra olímpica EZ para curl mide 50" de largo, 29" de ancho y 14" de alto, con una capacidad máxima de 500 libras y mangos neutros para un agarre cómodo. Fabricada en acero tubular, es compacta, estable y ideal para un entrenamiento corporal completo con pesas olímpicas.`,
        price: 245000,
        rating: 5.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/trap-barbell1.jpg", "https://fitnest-bucket.s3.amazonaws.com/trap-barbell2.jpg", "https://fitnest-bucket.s3.amazonaws.com/trap-barbell3.jpg"],
        categoryName: "Barras y Discos",
        status: 'Activo'
    },
    {
        name: "Juego de discos olímpicos de hierro fundido",
        type: "Hierro fundido",
        creationDate: "2024-06-24",
        description: `Juego de discos olímpicos de hierro fundido de 2 pulgadas para entrenamiento de fuerza, levantamiento de pesas y Crossfit en casa y gimnasio. Ideal para barras, este set de pesas libres es perfecto para diversas rutinas de ejercicio.`,
        price: 320000,
        rating: 0.0,
        image_urls: [ "https://fitnest-bucket.s3.amazonaws.com/disk-weights1.jpg", "https://fitnest-bucket.s3.amazonaws.com/disk-weights2.jpg", "https://fitnest-bucket.s3.amazonaws.com/disk-weights3.jpg",],
        categoryName: "Barras y Discos",
        status: 'Activo'
    },

]

export default products;