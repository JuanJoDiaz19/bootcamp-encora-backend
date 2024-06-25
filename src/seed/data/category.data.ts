

const categories = [

    //Cardio 

    {
        id: "6f9f00bf-21db-443c-a0d3-350b1f52ab51",
        name: "Cintas de correr",
        description: "Dispositivos de ejercicio diseñados para correr, caminar o trotar en interiores, proporcionando una forma conveniente y efectiva de mejorar la salud cardiovascular y la resistencia física.",
        groupId: "00d6a576-09e5-481b-80fb-1e4b08824be4",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-willpicturethis-1954524.jpg",
    },
    {
        id: "29799f72-70e2-4057-9cb2-a0f11bc8bf37",
        name: "Bicicletas Estaticas",
        description: "Las bicicletas estáticas son máquinas de ejercicio diseñadas para simular el ciclismo, mejorando la salud cardiovascular y la resistencia física desde la comodidad del hogar o el gimnasio.",
        groupId: "00d6a576-09e5-481b-80fb-1e4b08824be4",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-element5-775025.jpg",
    },
    {
        id: "2da8e6bf-90b1-44a9-ba30-9c75c12647df",
        name: "Elipticas",
        description: "Las elípticas son máquinas de ejercicio que combinan movimientos de caminar, correr y subir escaleras, proporcionando un entrenamiento cardiovascular de bajo impacto y completo.",
        groupId: "00d6a576-09e5-481b-80fb-1e4b08824be4",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-shotpot-4046658.jpg",
    },

    //Fuerza

    {
        id: "f6e815d4-3903-4863-a5a4-933add50df8e",
        name: "Mancuernas",
        description: "Pesas cortas con agarres en ambos extremos, ideales para ejercicios de fuerza y tonificación muscular tanto en gimnasios como en casa.",
        groupId: "990325d5-6460-49c3-ba40-98023a01ba81",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-tima-miroshnichenko-6389886.jpg",
    },
    {
        id: "88a82c5b-b4a7-49bb-9767-2ae1b86b4525",
        name: "Barras y Discos",
        description: "Las barras y discos son herramientas esenciales para el levantamiento de pesas, ideales para aumentar la resistencia y desarrollar fuerza muscular.",
        groupId: "990325d5-6460-49c3-ba40-98023a01ba81",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-victorfreitas-949129.jpg",
    },
    {
        id: "fcfad8ae-08ec-41e9-9714-9eb19ffee453",
        name: "Bancos de Pesas",
        description: "Los bancos de pesas son equipos versátiles para ejercicios de fuerza, proporcionando soporte y estabilidad para entrenamientos con mancuernas y barras.",
        groupId: "990325d5-6460-49c3-ba40-98023a01ba81",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/cybex-ion-adjustable-bench_1200x1200.jpg",
    },
    {
        id: "9b53cfcc-99fc-40d4-a782-85f9438ab65c",
        name: "Racks",
        description: "Los racks son estructuras robustas utilizadas para sostener barras de pesas, facilitando entrenamientos de fuerza seguros y efectivos.",
        groupId: "990325d5-6460-49c3-ba40-98023a01ba81",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/Rack-kingsbox-premium.jpg",
    },

    // Funcional

    {
        id: "35603b31-e958-4a04-8412-1f06b1bbec06",
        name: "Pesas Rusas",
        description: "Las pesas rusas, o kettlebells, son pesas con forma de bola y asa, ideales para ejercicios dinámicos que mejoran la fuerza, la resistencia y la flexibilidad.",
        groupId: "9ad34c74-369a-40c6-b25e-4c196bc5e76f",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-pixabay-416717.jpg",
    },
    {
        id: "a80ccd3f-1e3e-4487-89b4-c8f8013643c6",
        name: "Bandas de resistencia",
        description: "Las bandas de resistencia son implementos elásticos versátiles, ideales para ejercicios de fuerza, rehabilitación y estiramiento, proporcionando resistencia progresiva y adaptable.",
        groupId: "9ad34c74-369a-40c6-b25e-4c196bc5e76f",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-angela-roma-7479770.jpg",
    },
    {
        id: "f6fa59c3-75b0-449e-9647-582521746146",
        name: "Cuerdas de batalla",
        description: "Las cuerdas de batalla son herramientas de entrenamiento de alta intensidad utilizadas para mejorar la fuerza, la resistencia cardiovascular y la coordinación mediante movimientos ondulatorios y de golpeo.",
        groupId: "9ad34c74-369a-40c6-b25e-4c196bc5e76f",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-leonardho-1552108.jpg",
    },

    //Boxeo/ MMA
    {
        id: "497c3b66-fc12-48ab-a224-725de8702937",
        name: "Guantes de boxeo",
        description: "Los guantes de boxeo son equipos esenciales que protegen las manos y muñecas, proporcionando seguridad y soporte durante los entrenamientos y combates de boxeo.",
        groupId: "497c3b66-fc12-48ab-a224-725de8702937",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-anete-lusina-4790423.jpg",
    },
    {
        id: "901ca496-ae6f-4ba2-b849-0cc223ff2bad",
        name: "Sacos de boxeo",
        description: "Los sacos de boxeo son implementos de entrenamiento robustos, diseñados para mejorar la fuerza, la resistencia y la técnica de golpeo en boxeo y artes marciales.",
        groupId: "497c3b66-fc12-48ab-a224-725de8702937",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-ivan-samkov-4162449.jpg",
    },
    {
        id: "8dc69532-5b68-4b98-93e7-053043dee959",
        name: "Protector bucal",
        description: "El protector bucal es un equipo esencial que protege los dientes y la mandíbula, reduciendo el riesgo de lesiones durante actividades deportivas de alto impacto.",
        groupId: "497c3b66-fc12-48ab-a224-725de8702937",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/sports-mouthguard.jpg",
    },

    //
    {
        id: "14fa0bb7-fda7-468f-bb70-36397836712e",
        name: "Esterillas de Yoga y Pilates",
        description: "Esterillas diseñadas para proporcionar confort y estabilidad durante la práctica de yoga y pilates, mejorando equilibrio y postura.",
        groupId: "a0b41703-4fed-4e7d-8253-3a99d45c3348",
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-dmytro-1259064-2394051.jpg",
    },
    {
        id: "ee3bcf3b-c7ec-4124-bfe7-bd8e6e5a4c4f",
        name: "Maquinas de Remo", 
        description: "Dispositivos que simulan el movimiento de remar, ofreciendo un entrenamiento completo para fortalecer el cuerpo superior e inferior y mejorar la resistencia cardiovascular.",
        groupId: "a0b41703-4fed-4e7d-8253-3a99d45c3348", 
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-andres-ayrton-6551414.jpg",
    },

    {
        id: "35f6c6e3-1cc6-465c-a169-4be395b60da0",
        name: "Accesorios para Natación", 
        description: "Equipos como gafas, tapones para los oídos, gorros y aletas, diseñados para mejorar el rendimiento y la comodidad durante la práctica de natación.",
        groupId: "a0b41703-4fed-4e7d-8253-3a99d45c3348", 
        image_url: "https://fitnest-bucket.s3.amazonaws.com/pexels-cottonbro-9632569.jpg",
    }

]

export default categories