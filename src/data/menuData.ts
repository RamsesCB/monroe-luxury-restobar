import { Category, Dish } from "@/types/menu";

export const CATEGORIES: Category[] = [
  {
    id: "pastas",
    name: "Pastas Artesanales",
    tagline: "Fatta a Mano • Tradición Italiana",
    icon: "UtensilsCrossed",
    description: "Pastas frescas elaboradas diariamente en nuestro obrador.",
  },
];

export const FEATURED_DISH: Dish = {
  id: "garganelli-pesto-pistacchio-langostinos",
  name: "Garganelli al Pesto di Pistacchio & Langostinos Jumbo",
  subtitle: "Pistacho Siciliano DOP & Stracciatella Fresca",
  category: "pastas",
  price: 74.0,
  description: "Pasta artesanal al telar de bronce con pesto de pistachos sicilianos DOP, langostinos jumbo al horno Josper y stracciatella fresca.",
  image: "/dishes/garganelli/fettuccine_cenital_90grados_transparente.png",
  video: "/videos/fettuccine_rotating.mp4",
  videoWebm: "/videos/fettuccine_rotating.webm",
  galleryImages: [
    "/videos/fettuccine_rotating.mp4",
    "/dishes/garganelli/Vista45Grados.jpg",
    "/dishes/garganelli/fettuccine_rasante_0-15grados_transparente.png",
    "/dishes/garganelli/fettuccine_cenital_90grados_transparente.png",
  ],
  tags: ["Estrella Monroe"],
  chefNotes: "Mezclar la stracciatella central antes del primer bocado para integrar la textura fría del queso con el pesto caliente.",
  pairingSuggestion: {
    name: "Marqués de Riscal Sauvignon Blanc",
    type: "vino",
    notes: "Acidez chispeante y notas cítricas que equilibran la untuosidad del pistacho.",
    price: 42.0,
  },
  flavorProfile: {
    umami: 5,
    intensidad: 4,
    frescura: 5,
  },
  allergens: ["Gluten", "Lácteos", "Pistacho", "Crustáceos"],
  preparationTime: "15-18 min",
  origin: "Monroe Restobar",
  isSignature: true,
  is3dAvailable: true,
  model3d: {
    glbUrl: "/models3d/plato_monroe.glb",
    usdzUrl: "/models3d/plato_monroe.usdz",
    posterImage: "/dishes/garganelli/fettuccine_cenital_90grados_transparente.png",
    realDimensions: "28cm Ø • Escala Real",
    hasArSupport: true,
  },
  stockAvailable: true,
};

export const DISHES: Dish[] = [FEATURED_DISH];
