import { Category, Dish } from "@/types/menu";

export const CATEGORIES: Category[] = [
  {
    id: "pastas",
    name: "Pastas Artesanales",
    tagline: "Fatta a Mano • Tradición Italiana con Espíritu Contemporáneo",
    icon: "UtensilsCrossed",
    description: "Pastas frescas trefiladas al bronce y elaboradas diariamente en nuestro obrador con harina de sémola de trigo duro importada.",
  },
  {
    id: "carnes",
    name: "Cortes Prime & Fuego",
    tagline: "Dry-Aged 45 Días • Horno Josper a 400°C",
    icon: "Flame",
    description: "Cortes con certificación Angus Prime y Wagyu A5 madurados en cámara propia de sal del Himalaya y sellados a fuego vivo.",
  },
  {
    id: "cocteleria",
    name: "Coctelería de Autor",
    tagline: "Alquimia & Mixología de Vanguardia",
    icon: "GlassWater",
    description: "Destilados premium, hielo cristalino de desoxigenación lenta, macerados botánicos y presentaciones sensoriales con humo y fuego.",
  },
  {
    id: "entradas",
    name: "Entradas & Crudos",
    tagline: "Del Mar de Chimbote & la Cuna Italiana",
    icon: "Sparkles",
    description: "La frescura de la pesca local combinada con productos de origen protegido para dar inicio al ritual gastronómico.",
  },
  {
    id: "postres",
    name: "Postres de Autor",
    tagline: "Dulce Cierre • Chocolatería de Gran Origen",
    icon: "Award",
    description: "Elaboraciones con cacaos finos peruanos y técnicas de pastelería contemporánea.",
  },
  {
    id: "vinos",
    name: "Cava & Espumantes",
    tagline: "Selección de Nuestro Sommelier",
    icon: "Wine",
    description: "Etiquetas curadas de las bodegas más prestigiosas de Europa y Sudamérica con guarda controlada.",
  },
];

export const FEATURED_DISH: Dish = {
  id: "garganelli-pesto-pistacchio-langostinos",
  name: "Garganelli al Pesto di Pistacchio & Langostinos Jumbo",
  subtitle: "Pistacho Siciliano DOP & Stracciatella Fresca • Fatta a Mano",
  category: "pastas",
  price: 74.0,
  description: "Pasta fresca estriada al telar de bronce, pesto cremoso de pistachos de Bronte, langostinos jumbo sellados al horno Josper a 400°C y corazón de stracciatella trufada que aporta sedosidad al plato.",
  longStory: "El diálogo perfecto entre la costa de Chimbote y la opulencia de Sicilia. Los langostinos son seleccionados vivos en el puerto y sellados apenas 60 segundos sobre carbón de espino para conservar toda su jugosidad natural.",
  image: "/dishes/garganelli/Vista45Grados.jpg",
  galleryImages: [
    "/dishes/garganelli/Vista45Grados.jpg",
    "/dishes/garganelli/Vista0-15Grados.jpg",
    "/dishes/garganelli/Vista90Grados.jpg",
  ],
  video: "/videos/fettuccine_rotating.mp4",
  videoWebm: "/videos/fettuccine_rotating.webm",
  tags: ["Estrella Monroe", "Pasta Fresca Fatta a Mano", "Pesca Sostenible"],
  chefNotes: "Mezclar la stracciatella central antes del primer bocado para integrar la textura fría y cremosa del queso con el pesto caliente.",
  pairingSuggestion: {
    name: "Marqués de Riscal Sauvignon Blanc Rueda",
    type: "vino",
    notes: "Acidez chispeante y notas cítricas que cortan la untuosidad del pistacho resaltando la dulzura del langostino.",
    price: 42.0,
  },
  flavorProfile: {
    umami: 5,
    intensidad: 4,
    frescura: 5,
    acidez: 3,
  },
  allergens: ["Gluten", "Lácteos", "Frutos Secos (Pistacho)", "Crustáceos"],
  preparationTime: "16-20 min",
  origin: "Fusión Ítalo-Costera Monroe",
  isSignature: true,
  is3dAvailable: true,
  model3d: {
    glbUrl: "/models3d/sample.glb",
    usdzUrl: "/models3d/sample.usdz",
    hasArSupport: true,
    scale: "0.28 0.28 0.28",
    cameraOrbit: "0deg 75deg 0.8m",
    realDimensions: "28cm Ø • Plato Real Monroe",
  },
  stockAvailable: true,
};

export const DISHES: Dish[] = [FEATURED_DISH];

