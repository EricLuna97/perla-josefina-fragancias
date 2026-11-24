// Script generador del catálogo maestro para Supabase SQL y fallback frontend
const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  ACEITES: {
    id: '9e5df32b-0f1c-401a-a5b6-61550583e120',
    name: 'Aceites Terapéuticos',
    order: 1
  },
  TINTURAS: {
    id: '5fcfa6d7-4f51-4b3f-921c-6fe48ee094be',
    name: 'Tinturas Madre',
    order: 2
  },
  CREMAS: {
    id: '5238e833-b473-4393-a902-ed3321b9df96',
    name: 'Cremas Corporales y Bálsamos',
    order: 3
  },
  FRAGANCIAS: {
    id: '9cddbc4a-d91a-42d0-9fff-d637235903b8',
    name: 'Fragancias',
    order: 4
  },
  CAPILAR: {
    id: '999ad3bf-376e-406c-943b-2902348e9e08',
    name: 'Cuidado Capilar',
    order: 5
  },
  SALES: {
    id: '859b21c0-4489-41ef-824d-cf2a90107095',
    name: 'Sales de Baño',
    order: 6
  }
};

const PRODUCTS = [
  // ==========================================
  // 1. CREMAS CORPORALES Y BÁLSAMOS (25 items)
  // ==========================================
  {
    name: 'Crema de Caléndula',
    category: 'CREMAS',
    image_url: '/productos/crema-de-calendula.jpg',
    description: 'Bálsamo calmante y regenerador elaborado con flores de caléndula y cera pura de abejas. Alivia paspaduras, dermatitis, eczemas y pieles sensibles o irritadas.'
  },
  {
    name: 'Crema de Rosa Mosqueta',
    category: 'CREMAS',
    image_url: '/productos/crema-de-rosa-mosqueta.jpg',
    description: 'Nutrición facial intensiva y regenerador celular natural. Rica en ácidos grasos esenciales y antioxidantes. Atenúa cicatrices, manchas y líneas de expresión.'
  },
  {
    name: 'Crema de Ortiga',
    category: 'CREMAS',
    image_url: '/productos/crema-de-ortiga.jpg',
    description: 'Fórmula descongestiva y activadora de la circulación periférica. Alivia dolores reumáticos, pesadez en piernas cansadas y molestias por várices.'
  },
  {
    name: 'Crema de Diente de León',
    category: 'CREMAS',
    image_url: '/productos/crema-de-diente-de-leon.jpg',
    description: 'Depurativa cutánea y revitalizante celular. Ayuda a atenuar manchas dérmicas, estimula la eliminación de toxinas en la piel y aporta luminosidad.'
  },
  {
    name: 'Crema de Consuelda',
    category: 'CREMAS',
    image_url: '/productos/crema-de-consuelda.jpg',
    description: 'Poderoso regenerador celular con alantoína natural. Indicada para fisuras, regeneración de tejidos, contusiones óseas, ligamentos y articulaciones.'
  },
  {
    name: 'Crema de Cannabis',
    category: 'CREMAS',
    image_url: '/productos/crema-de-cannabis.jpg',
    description: 'Alivio profundo para dolores articulares y musculares crónicos. Potente acción antiinflamatoria y calmante local para contracturas y rigidez.'
  },
  {
    name: 'Crema de Hipérico',
    category: 'CREMAS',
    image_url: '/productos/crema-de-hiperico.jpg',
    description: 'Pomada bermellón a base de flor de San Juan. Regeneradora de terminaciones nerviosas, alivia dolores neurálgicos, quemaduras leves y golpes.'
  },
  {
    name: 'Crema de Pañil',
    category: 'CREMAS',
    image_url: '/productos/crema-de-panil.jpg',
    description: 'Arbusto medicinal patagónico con alta capacidad cicatrizante. Recomendada para úlceras dérmicas, grietas, heridas de difícil curación y afecciones cutáneas.'
  },
  {
    name: 'Crema de Enebro',
    category: 'CREMAS',
    image_url: '/productos/crema-de-enebro.jpg',
    description: 'Pomada calorífica y descontracturante. Con bayas de enebro andino, ideal para masajes previos a la actividad física o para disipar rigidez tensional.'
  },
  {
    name: 'Crema de Cúrcuma',
    category: 'CREMAS',
    image_url: '/productos/crema-de-curcuma.jpg',
    description: 'Potente antioxidante y antiinflamatorio natural. Alivia inflamaciones articulares localizadas y protege la piel contra el envejecimiento prematuro.'
  },
  {
    name: 'Crema de Orégano',
    category: 'CREMAS',
    image_url: '/productos/crema-de-oregano.jpg',
    description: 'Antifúngica y antibacteriana natural. Indicada para combatir micosis dérmicas, pie de atleta, sarpullidos y pruritos con acción descongestiva.'
  },
  {
    name: 'Crema de Alcanfor',
    category: 'CREMAS',
    image_url: '/productos/crema-de-alcanfor.jpg',
    description: 'Refrescante y estimulante. Alivia la sensación de fatiga muscular extrema, reactiva el flujo sanguíneo y despeja zonas de sobrecarga tensional.'
  },
  {
    name: 'Crema Bálsamo Pectoral',
    category: 'CREMAS',
    image_url: '/productos/crema-balsamo-pectoral.jpg',
    description: 'Ungüento balsámico con esencias pectorales cordilleranas. Alivia resfríos, tos y congestión nasal mediante masajes suaves en pecho, cuello y espalda.'
  },
  {
    name: 'Crema MIX 31',
    category: 'CREMAS',
    image_url: '/productos/crema-mix-31.jpg',
    description: 'Sinergia maestra de 31 hierbas botánicas puras. Proporciona bienestar integral, relaja tensiones musculares acumuladas y refresca los sentidos.'
  },
  {
    name: 'Crema Articulaciones',
    category: 'CREMAS',
    image_url: '/productos/crema-articulaciones.jpg',
    description: 'Fórmula combinada de hierbas andinas para artrosis, rigidez matutina y dolores articulares degenerativos o producidos por el frío.'
  },
  {
    name: 'Crema de Lavanda e Hipérico',
    category: 'CREMAS',
    image_url: '/productos/crema-de-lavanda-e-hiperico.jpg',
    description: 'Armonía y equilibrio integral. Calma la irritación dérmica, relaja el sistema nervioso central y facilita la desconexión mental y el sosiego.'
  },
  {
    name: 'Crema de Consuelda, Cannabis y Clavo de Olor',
    category: 'CREMAS',
    image_url: '/productos/crema-de-consuelda-cannabis-y-clavo-de-olor.jpg',
    description: 'Tratamiento intensivo analgésico de triple acción. Alivio inmediato para dolores intensos musculares, contracturas lumbares y afecciones articulares.'
  },
  {
    name: 'Crema de Cannabis y Caléndula',
    category: 'CREMAS',
    image_url: '/productos/crema-de-cannabis-y-calendula.jpg',
    description: 'Combinación equilibrada de relajación muscular y cuidado dérmico. Desinflama la zona mientras regenera e hidrata profundamente la piel.'
  },
  {
    name: 'Crema de Lavanda y Rosa',
    category: 'CREMAS',
    image_url: '/productos/crema-de-lavanda-y-rosa.jpg',
    description: 'Cuidado facial y corporal sedoso. Suaviza la piel, relaja los sentidos y proporciona una experiencia aromaterapéutica relajante de descanso.'
  },
  {
    name: 'Crema de Árnica',
    category: 'CREMAS',
    image_url: '/productos/crema-de-arnica.jpg',
    description: 'Pomada antiinflamatoria por excelencia. Acelera la reabsorción de hematomas, calma torceduras, esguinces, moretones y dolores por traumatismos.'
  },
  {
    name: 'Crema de Hipérico, Consuelda y Alcanfor',
    category: 'CREMAS',
    image_url: '/productos/crema-de-hiperico-consuelda-y-alcanfor.jpg',
    description: 'Fórmula sinérgica regeneradora y analgésica. Ideal para deportistas o trabajos con esfuerzo físico, repara fibras musculares y ligamentos.'
  },
  {
    name: 'Crema de Cannabis, Aloe Vera y Esencia de Rosa',
    category: 'CREMAS',
    image_url: '/productos/crema-de-cannabis-aloe-vera-y-esencia-de-rosa.jpg',
    description: 'Emulsión hidratante facial antiedad de textura liviana. Nutrición celular profunda, frescura calmante y aroma sutil de rosas silvestres.'
  },
  {
    name: 'Crema de Jazmín',
    category: 'CREMAS',
    image_url: '/productos/crema-de-jazmin.jpg',
    description: 'Crema humectante sensorial de jazmín blanco. Despierta sensaciones de optimismo, nutre la piel seca y disipa tensiones acumuladas en el día.'
  },
  {
    name: 'Crema Cítrica',
    category: 'CREMAS',
    image_url: '/productos/crema-citrica.jpg',
    description: 'Tonificante dérmico energizante elaborado con notas cítricas patagónicas. Devuelve la vitalidad a la piel apagada y aporta frescura matutina.'
  },
  {
    name: 'Bálsamo Labial de Caléndula y Cera Pura',
    category: 'CREMAS',
    image_url: '/productos/balsamo-labial-de-calendula-y-cera-pura.jpg',
    description: 'Nutrición y protección inmediata para labios resecos o paspados por el viento andino. Elaborado con cera pura de abejas y caléndula.'
  },

  // ==========================================
  // 2. ACEITES TERAPÉUTICOS (25 items)
  // ==========================================
  {
    name: 'Aceite Bebible de Ortiga',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-de-ortiga.jpg',
    description: 'Maceración pura rica en hierro orgánico, clorofila y minerales esenciales. Remineralizante para combatir anemia, fatiga y purificar la sangre. Apto uso interno.'
  },
  {
    name: 'Aceite Bebible de Pañil',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-de-panil.jpg',
    description: 'Extracto oleoso de la flora nativa patagónica. Protector hepático, depurativo biliar y reconstituyente gástrico. 10 a 15 gotas sublinguales o en agua.'
  },
  {
    name: 'Aceite Bebible de Hinojo',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-de-hinojo.jpg',
    description: 'Macerado carminativo y digestivo natural. Elimina gases, calma cólicos intestinales, relaja espasmos digestivos y favorece digestiones livianas.'
  },
  {
    name: 'Aceite Bebible de Diente de León',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-de-diente-de-leon.jpg',
    description: 'Excelente tónico depurativo para el hígado y riñones. Estimula la secreción de bilis, depura impurezas orgánicas y mejora la asimilación nutricional.'
  },
  {
    name: 'Aceite de Caléndula',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-calendula.jpg',
    description: 'Maceración solar en aceite puro de flores de caléndula. Emoliente ultra suave para pieles sensibles, cicatrización y dermatitis. Apto bebés y mamás.'
  },
  {
    name: 'Aceite Bebible Memory MIX 8',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-memory-mix-8.jpg',
    description: 'Fórmula neuroestimulante con 8 hierbas sinérgicas. Mejora la oxigenación cerebral, retención nemotécnica, agilidad mental y claridad en jornadas intensas.'
  },
  {
    name: 'Aceite Bebible y Corporal MIX 31',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-y-corporal-mix-31.jpg',
    description: 'Sinergia maestra polivalente. Se puede ingerir como tónico equilibrador o aplicar en sienes, nuca y zonas tensionales para alivio inmediato del dolor de cabeza.'
  },
  {
    name: 'Aceite de Cannabis Medicinal',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-cannabis-medicinal.jpg',
    description: 'Extracto fitoterapéutico de amplio espectro. Calma dolores articulares crónicos, modula estados de insomnio y relaja contracturas severas.'
  },
  {
    name: 'Aceite Rescate',
    category: 'ACEITES',
    image_url: '/productos/aceite-rescate.jpg',
    description: 'Fórmula armonizadora para momentos de crisis, shock emocional, estrés agudo y ataques de pánico. Aporta calma, templanza y equilibrio emocional.'
  },
  {
    name: 'Aceite de Rosa Mosqueta Puro',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-rosa-mosqueta-puro.jpg',
    description: 'Puro de primera prensada en frío de la Comarca Andina. Altísima concentración de retinol natural y vitamina C. Regenera cicatrices, arrugas y estrías.'
  },
  {
    name: 'Aceite de Consuelda',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-consuelda.jpg',
    description: 'Macerado oleoso específico para ligamentos, articulaciones y huesos. Acelera la recuperación en esguinces, fisuras, desgarros y tendinitis.'
  },
  {
    name: 'Aceite Articulaciones',
    category: 'ACEITES',
    image_url: '/productos/aceite-articulaciones.jpg',
    description: 'Óleo medicinal formulado para fricciones en zonas rígidas o afectadas por reuma y artrosis. Penetra profundamente estimulando la movilidad.'
  },
  {
    name: 'Aceite de Hipérico (Hierba de San Juan)',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-hiperico-hierba-de-san-juan.jpg',
    description: 'El legendario aceite bermellón. Analgésico y desinflamante para pinzamientos del nervio ciático, dolores lumbares, quemaduras superficiales y hematomas.'
  },
  {
    name: 'Aceite de Enebro',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-enebro.jpg',
    description: 'Macerado calorífico descontracturante. Muy apreciado para masajes corporales deportivos, alivia calambres y prepara los músculos para el movimiento.'
  },
  {
    name: 'Aceite Bebible de Cúrcuma',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-de-curcuma.jpg',
    description: 'Extracto bebible rico en curcuminoides biodisponibles. Potente antiinflamatorio sistémico celular, protege el sistema gastrointestinal y las articulaciones.'
  },
  {
    name: 'Aceite de Orégano',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-oregano.jpg',
    description: 'Concentrado botánico de carvacrol. Antimicrobiano natural, combate levaduras y parásitos, estimula el sistema inmunológico y depura el organismo.'
  },
  {
    name: 'Aceite de Alcanfor',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-alcanfor.jpg',
    description: 'Aceite para masajes estimulantes y circulatorios. Reactiva zonas entumecidas por el frío, alivia fatiga muscular y despeja tensiones corporales.'
  },
  {
    name: 'Aceite Bálsamo Pectoral',
    category: 'ACEITES',
    image_url: '/productos/aceite-balsamo-pectoral.jpg',
    description: 'Óleo para fricción pectoral con esencias descongestivas andinas. Facilita la respiración fluida y el descanso nocturno en estados gripales.'
  },
  {
    name: 'Aceite de Árnica y Clavo de Olor',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-arnica-y-clavo-de-olor.jpg',
    description: 'Fórmula de gran poder analgésico tópico. El eugenol del clavo y la helenalina del árnica calman dolores punzantes en articulaciones y tendones.'
  },
  {
    name: 'Aceite de Hipérico, Alcanfor, Consuelda y Cannabis',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-hiperico-alcanfor-consuelda-y-cannabis.jpg',
    description: 'Fórmula magistral de cuatro principios activos combinados. Alivio integral de choque para dolores musculares severos, lumbagos y ciática.'
  },
  {
    name: 'Aceite para Masajes Intensivo 5 Hierbas',
    category: 'ACEITES',
    image_url: '/productos/aceite-para-masajes-intensivo-5-hierbas.jpg',
    description: 'Presentación especial para masajistas y terapeutas. Combinación de Hipérico, Consuelda, Alcanfor, Cannabis y Clavo para sesiones descontracturantes.'
  },
  {
    name: 'Aceite para Masajes Drenaje Linfático',
    category: 'ACEITES',
    image_url: '/productos/aceite-para-masajes-drenaje-linfatico.jpg',
    description: 'Mezcla oleosa activadora de la circulación de retorno. Facilita las maniobras de drenaje linfático manual y ayuda a descongestionar piernas hinchadas.'
  },
  {
    name: 'Aceite para Masajes Pie Diabético',
    category: 'ACEITES',
    image_url: '/productos/aceite-para-masajes-pie-diabetico.jpg',
    description: 'Fórmula protectora altamente humectante. Diseñada para reactivar la microcirculación periférica, prevenir grietas y nutrir la piel vulnerable.'
  },
  {
    name: 'Aceite Bebible Antiparasitario',
    category: 'ACEITES',
    image_url: '/productos/aceite-bebible-antiparasitario.jpg',
    description: 'Combinación tradicional de hierbas depurativas que ayudan a expulsar parásitos intestinales y desintoxicar el tracto digestivo de forma natural.'
  },
  {
    name: 'Aceite de Cannabis y Caléndula',
    category: 'ACEITES',
    image_url: '/productos/aceite-de-cannabis-y-calendula.jpg',
    description: 'Óleo calmante dual para masajes y aplicaciones dérmicas. Une el poder desinflamante del cannabis con la profunda reparación celular de la caléndula.'
  },

  // ==========================================
  // 3. TINTURAS MADRE (15 items)
  // ==========================================
  {
    name: 'Tintura Madre de Diente de León',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-diente-de-leon.jpg',
    description: 'Extracto hidroalcohólico puro de Taraxacum officinale. Excelente desintoxicante hepático y renal. Tomar 20 gotas en medio vaso de agua antes de las comidas.'
  },
  {
    name: 'Tintura Madre de Ortiga',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-ortiga.jpg',
    description: 'Extracto concentrado silvestre rico en hierro y oligoelementos. Indicado para decaimiento físico, caída del cabello, anemias estacionales y purificación.'
  },
  {
    name: 'Tintura Madre de Caléndula',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-calendula.jpg',
    description: 'Reguladora y protectora interna. Posee notables efectos antiinflamatorios digestivos, ayuda a regular el ciclo femenino y estimula las defensas orgánicas.'
  },
  {
    name: 'Tintura Madre de Consuelda',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-consuelda.jpg',
    description: 'Concentrado botánico de alantoína para estimulación y regeneración celular. Apoya la recuperación de fisuras óseas, roturas fibrilares y ligamentos.'
  },
  {
    name: 'Tintura Madre de Cannabis',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-cannabis.jpg',
    description: 'Extracto herbal hidroalcohólico que modula el sistema endocannabinoide. Favorece la distensión muscular, induce al sueño y modula dolores crónicos.'
  },
  {
    name: 'Tintura Madre de Hipérico',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-hiperico.jpg',
    description: 'El célebre antidepresivo y equilibrador del ánimo natural. Disipa la melancolía, alivia la ansiedad y restaura la energía anímica interior.'
  },
  {
    name: 'Tintura Madre de Pañil',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-panil.jpg',
    description: 'Medicina ancestral de los bosques patagónicos. Cicatrizante estomacal para gastritis, úlceras digestivas y desinflamación de mucosas.'
  },
  {
    name: 'Tintura Madre de Enebro',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-enebro.jpg',
    description: 'Poderoso diurético natural. Facilita la depuración renal, ayuda a eliminar el exceso de ácido úrico y combate la retención hídrica corporal.'
  },
  {
    name: 'Tintura Madre de Cúrcuma',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-curcuma.jpg',
    description: 'Extracto hidroalcohólico concentrado de cúrcuma pura. Hepatoprotectora, antiinflamatoria articular y protectora de la salud cardiovascular.'
  },
  {
    name: 'Tintura Madre Memo MIX',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-memo-mix.jpg',
    description: 'Sinergia botánica nootrópica para estudiantes y profesionales. Estimula la concentración sostenida, la lucidez mental y la memoria de retención.'
  },
  {
    name: 'Tintura Madre Rescate',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-rescate.jpg',
    description: 'Gotas de serenidad inmediata ante situaciones de angustia, susto, pánico o nerviosismo agudo. Restablece la paz mental y la estabilidad emocional.'
  },
  {
    name: 'Tintura Madre Melena de León',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-melena-de-leon.jpg',
    description: 'Extracto del poderoso hongo adaptógeno Hericium erinaceus. Fomenta el factor de crecimiento nervioso (NGF), la plasticidad cerebral y la salud digestiva.'
  },
  {
    name: 'Tintura Madre de Jarilla',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-jarilla.jpg',
    description: 'Arbusto sagrado de la estepa andina. Potente depurativo orgánico, alivia afecciones respiratorias, reumatismo y purifica el torrente sanguíneo.'
  },
  {
    name: 'Tintura Madre de Llantén',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-llanten.jpg',
    description: 'Elaborada con hojas frescas de llantén patagónico. Descongestiva y suavizante de vías respiratorias, calma la tos seca y cicatriza mucosas.'
  },
  {
    name: 'Tintura Madre de Melisa',
    category: 'TINTURAS',
    image_url: '/productos/tintura-madre-de-melisa.jpg',
    description: 'Melisa cordillerana sedante suave y antiespasmódica. Alivia la irritabilidad nerviosa, palpitaciones por estrés y garantiza un descanso reparador.'
  },

  // ==========================================
  // 4. SALES DE BAÑO Y PEDILUVIOS (5 items)
  // ==========================================
  {
    name: 'Sales de Baño: Rosa, Clavo de Olor e Hibiscus',
    category: 'SALES',
    image_url: '/productos/sales-de-bano-rosa-clavo-de-olor-e-hibiscus.jpg',
    description: 'Sales minerales patagónicas con flores de hibiscus, pétalos de rosa y clavo. Baño relajante para el corazón, suaviza la piel y brinda contención sensorial.'
  },
  {
    name: 'Sales de Baño: Cítrica, Ruda y Diente de León',
    category: 'SALES',
    image_url: '/productos/sales-de-bano-citrica-ruda-y-diente-de-leon.jpg',
    description: 'Mezcla depurativa y de limpieza energética. Ideal para pediluvios nocturnos que descargan la pesadez de los pies, estimulan la circulación y quitan tensiones.'
  },
  {
    name: 'Sales de Baño: Jazmín, Canela, Romero y Salvia',
    category: 'SALES',
    image_url: '/productos/sales-de-bano-jazmin-canela-romero-y-salvia.jpg',
    description: 'Sales reconfortantes y tonificantes. El romero y la salvia despejan el cuerpo cansado, mientras la canela y el jazmín aportan calidez vital.'
  },
  {
    name: 'Sales de Baño: Sándalo, Manzanilla y Pasionaria',
    category: 'SALES',
    image_url: '/productos/sales-de-bano-sandalo-manzanilla-y-pasionaria.jpg',
    description: 'Sinergia calmante profunda para baños de inmersión antes de acostarse. Aquietan la mente inquieta y facilitan un sueño reparador continuo.'
  },
  {
    name: 'Sales de Baño: Lavanda, Hipérico y Canela',
    category: 'SALES',
    image_url: '/productos/sales-de-bano-lavanda-hiperico-y-canela.jpg',
    description: 'Especialmente formuladas para aliviar dolores musculares y lumbares. Descontracturan la musculatura y disipan el cansancio tras un día agitado.'
  },

  // ==========================================
  // 5. FRAGANCIAS Y BRUMAS (31 items)
  // ==========================================
  {
    name: 'Bruma Áurica de Jazmín',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-de-jazmin.jpg',
    description: 'Hidrolato floral con notas puras de jazmín blanco. Despierta sensaciones de optimismo, calidez afectiva y armoniza el campo vibracional personal.'
  },
  {
    name: 'Bruma Áurica Cítrica',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-citrica.jpg',
    description: 'Elixir energizante con aceites esenciales de naranja dulce, limón y bergamota. Despeja el cansancio mental, alegra los ambientes y renueva la energía.'
  },
  {
    name: 'Bruma Áurica de Lavanda',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-de-lavanda.jpg',
    description: 'Destilado puro de lavandas andinas. Promueve paz mental instantánea. Ideal para vaporizar sobre almohadas, sábanas o en la habitación del bebé.'
  },
  {
    name: 'Bruma Áurica de Bosque Andino',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-de-bosque-andino.jpg',
    description: 'Notas de Ciprés cordillerano, Coihue y Pino Oregón. Brinda arraigo a la tierra, purifica el aire de espacios cerrados y conecta con la serenidad del bosque.'
  },
  {
    name: 'Bruma Áurica de Rosas y Cedro',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-de-rosas-y-cedro.jpg',
    description: 'Sinergia armonizadora que conecta con el chakra cardíaco. Destilado de rosas de jardín patagónico con notas de cedro. Contención emocional y calidez.'
  },
  {
    name: 'Bruma Áurica de Lavanda y Salvia Blanca',
    category: 'FRAGANCIAS',
    image_url: '/productos/bruma-aurica-de-lavanda-y-salvia-blanca.jpg',
    description: 'Elixir purificador del campo áurico y limpieza espacial. Disipa energías densas en consultorios, hogares o espacios de meditación.'
  },
  {
    name: 'Fragancia Ambiental Coco Tropical',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-coco-tropical.jpg',
    description: 'Aroma dulce y envolvente con notas de coco natural. Transforma cualquier ambiente en un espacio cálido, exótico y relajado.'
  },
  {
    name: 'Fragancia Ambiental Naranja Andina',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-naranja-andina.jpg',
    description: 'Frescura cítrica dulce y chispeante. Aporta luminosidad y vitalidad al hogar o local comercial, eliminando olores persistentes.'
  },
  {
    name: 'Fragancia Ambiental Limón Silvestre',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-limon-silvestre.jpg',
    description: 'Máxima sensación de frescura, limpieza y claridad mental. Aroma estimulante perfecto para cocinas, oficinas y áreas de trabajo.'
  },
  {
    name: 'Fragancia Ambiental Manzana Verde',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-manzana-verde.jpg',
    description: 'Nota frutal crujiente, dulce y equilibrada. Despierta recuerdos acogedores y deja una estela aromática fresca y apetecible.'
  },
  {
    name: 'Fragancia Ambiental Frutilla Silvestre',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-frutilla-silvestre.jpg',
    description: 'Dulzura frutal alegre y jovial inspirada en las bayas cordilleranas. Ambientación duradera para salas de estar y dormitorios.'
  },
  {
    name: 'Fragancia Ambiental Uva Dulce',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-uva-dulce.jpg',
    description: 'Aroma frutal profundo y persistente con notas avainilladas y de uva madura. Crea un entorno distinguido y perfumado.'
  },
  {
    name: 'Fragancia Ambiental Violeta',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-violeta.jpg',
    description: 'Delicada fragancia floral clásica. Suave, sutil y elegante, recomendada para ambientes de descanso o vestidores.'
  },
  {
    name: 'Fragancia Ambiental Pétalos de Rosa',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-petalos-de-rosa.jpg',
    description: 'El clásico y distinguido aroma floral de la rosa de verano. Llena los espacios de armonía, romanticismo y sosiego.'
  },
  {
    name: 'Fragancia Ambiental Bouquet Floral',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-bouquet-floral.jpg',
    description: 'Combinación equilibrada de flores andinas frescas. Una brisa primaveral permanente para aromatizar el hogar.'
  },
  {
    name: 'Fragancia Ambiental Sándalo Oriental',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-sandalo-oriental.jpg',
    description: 'Madera sagrada aromática de notas cálidas y profundas. Fomenta la concentración, la meditación y el recogimiento espiritual.'
  },
  {
    name: 'Fragancia Ambiental Almendra Dulce',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-almendra-dulce.jpg',
    description: 'Aroma cremoso, suave y reconfortante. Brinda sensación de protección y bienestar en espacios familiares.'
  },
  {
    name: 'Fragancia Ambiental Vainilla Colonial',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-ambiental-vainilla-colonial.jpg',
    description: 'Dulzura gourmand que reconforta y genera una atmósfera sumamente cálida y acogedora en cualquier rincón del hogar.'
  },
  {
    name: 'Fragancia Textil 212',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-212.jpg',
    description: 'Aroma sofisticado de inspiración urbana y cosmopolita. Ideal para vaporizar sobre cortinas, tapizados, ropa de cama y placard.'
  },
  {
    name: 'Fragancia Textil Flower',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-flower.jpg',
    description: 'Notas florales empolvadas, suaves y delicadas. Deja una estela fresca y distinguida en telas y prendas de vestir.'
  },
  {
    name: 'Fragancia Textil Amor',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-amor.jpg',
    description: 'Esencia cautivante y romántica para textiles. Ideal para perfumar dormitorios, acolchados y sábanas de manera perdurable.'
  },
  {
    name: 'Fragancia Textil FRH',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-frh.jpg',
    description: 'Sensación de pureza y frescura extrema de ropa recién secada al aire libre de la Patagonia. Limpieza y distinción textil.'
  },
  {
    name: 'Fragancia Textil Kenzo',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-kenzo.jpg',
    description: 'Brisa floral acuática fresca y zen. Vaporizá sobre prendas para disfrutar de una sensación revitalizante y placentera todo el día.'
  },
  {
    name: 'Fragancia Textil Angel',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-angel.jpg',
    description: 'Acordes ambarados y dulces de alta persistencia para telas. Brinda un toque distintivo y envolvente a tus prendas favoritas.'
  },
  {
    name: 'Fragancia Textil One Million',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-one-million.jpg',
    description: 'Notas amaderadas y especiadas elegantes. Ideal para perfumar tapizados de automóviles, prendas de abrigo y ambientes masculinos.'
  },
  {
    name: 'Fragancia Textil Bulgary',
    category: 'FRAGANCIAS',
    image_url: '/productos/fragancia-textil-bulgary.jpg',
    description: 'Frescura cítrica y maderas nobles de alta gama. Perfume textil refinado y duradero para sábanas y toallas de calidad.'
  },
  {
    name: 'Perfume Botánico Roll-On Rosa',
    category: 'FRAGANCIAS',
    image_url: '/productos/perfume-botanico-roll-on-rosa.jpg',
    description: 'Perfume oleoso concentrado con aplicador a bolilla. Notas románticas de rosa andina para aplicar en muñecas, cuello y escote.'
  },
  {
    name: 'Perfume Botánico Roll-On Jazmín',
    category: 'FRAGANCIAS',
    image_url: '/productos/perfume-botanico-roll-on-jazmin.jpg',
    description: 'Fragancia personal botánica intensa y sensual. Formato de bolsillo ideal para renovar el aroma en cualquier momento del día.'
  },
  {
    name: 'Perfume Botánico Roll-On Cítrico',
    category: 'FRAGANCIAS',
    image_url: '/productos/perfume-botanico-roll-on-citrico.jpg',
    description: 'Chispeante toque aromaterapéutico energizante. Aplicar en sienes y pulsos para disipar el cansancio y recargar vitalidad.'
  },
  {
    name: 'Difusor Colgante para Auto Cítrico',
    category: 'FRAGANCIAS',
    image_url: '/productos/difusor-colgante-para-auto-citrico.jpg',
    description: 'Aromatizador artesanal en botellita de vidrio con tapón de madera difusora. Aceites cítricos puros para un viaje fresco y placentero.'
  },
  {
    name: 'Difusor Colgante para Auto Lavanda Andina',
    category: 'FRAGANCIAS',
    image_url: '/productos/difusor-colgante-para-auto-lavanda-andina.jpg',
    description: 'Aromatizador para vehículo con aceite esencial de lavanda. Aporta serenidad al conducir y elimina olores encerrados de forma natural.'
  },

  // ==========================================
  // 6. CUIDADO CAPILAR (3 items)
  // ==========================================
  {
    name: 'Shampoo Neutro con Hierbas Naturales',
    category: 'CAPILAR',
    image_url: '/productos/shampoo-neutro-con-hierbas-naturales.jpg',
    description: 'Fórmula artesanal enriquecida con Lavanda, Romero, Ruda, Clavo, Jengibre, Ortiga y Naranja. Limpieza profunda, nutre el cuero cabelludo y devuelve el brillo.'
  },
  {
    name: 'Shampoo Sólido de Ortiga y Romero',
    category: 'CAPILAR',
    image_url: '/productos/shampoo-solido-de-ortiga-y-romero.jpg',
    description: 'Barra botánica zero waste concentrada. Estimula la circulación del folículo piloso, combate la debilidad capilar y regula la oleosidad naturalmente.'
  },
  {
    name: 'Serum Capilar Reparador de Puntas',
    category: 'CAPILAR',
    image_url: '/productos/serum-capilar-reparador-de-puntas.jpg',
    description: 'Óleo vegetal puro enriquecido con Rosa Mosqueta y Almendras. Sella cutículas abiertas, controla el frizz y protege el cabello del viento y la sequedad.'
  }
];

// Generar SQL
let sql = `-- ==============================================================================
-- CATÁLOGO COMPLETO JOSEFINA FRAGANCIAS NATURALES (104 PRODUCTOS)
-- ==============================================================================
-- Ejecutar en Supabase Dashboard > SQL Editor > Run
-- Mapea directamente a los UUIDs existentes de las categorías en producción.
-- ==============================================================================

-- 1. Eliminar productos previos para evitar duplicaciones
DELETE FROM public.products;

-- 2. Insertar los 104 productos oficiales desduplicados con sus imágenes de estudio
INSERT INTO public.products (category_id, name, description, image_url, is_available)
VALUES
`;

const sqlValues = PRODUCTS.map((p, idx) => {
  const cat = CATEGORIES[p.category];
  const escapedName = p.name.replace(/'/g, "''");
  const escapedDesc = p.description.replace(/'/g, "''");
  const comma = idx === PRODUCTS.length - 1 ? ';' : ',';
  return `  ('${cat.id}', '${escapedName}', '${escapedDesc}', '${p.image_url}', true)${comma}`;
});

sql += sqlValues.join('\n') + `\n\n-- Fin del script de carga\n`;

// Escribir archivo SQL
const sqlPath = path.join(__dirname, '..', 'seed_catalogo_completo.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');
console.log(`Archivo SQL generado exitosamente en: ${sqlPath} (${PRODUCTS.length} productos)`);

// Generar archivo JS de respaldo frontend
const fallbackJs = `// Categorías oficiales de Josefina Fragancias Naturales
export const FALLBACK_CATEGORIES = ${JSON.stringify(
  Object.values(CATEGORIES).map(c => ({
    id: c.id,
    name: c.name,
    order: c.order
  })),
  null,
  2
)};

// Datos locales de respaldo con el catálogo completo oficial de Josefina Fragancias Naturales (104 productos)
export const FALLBACK_PRODUCTS = ${JSON.stringify(
  PRODUCTS.map((p, idx) => ({
    id: `prod-local-${idx + 1}`,
    name: p.name,
    description: p.description,
    image_url: p.image_url,
    category_id: CATEGORIES[p.category].id,
    categories: { name: CATEGORIES[p.category].name },
    is_available: true
  })),
  null,
  2
)};
`;

const jsPath = path.join(__dirname, '..', 'src', 'data', 'fallbackProducts.js');
fs.mkdirSync(path.dirname(jsPath), { recursive: true });
fs.writeFileSync(jsPath, fallbackJs, 'utf8');
console.log(`Archivo de respaldo JS generado en: ${jsPath}`);
