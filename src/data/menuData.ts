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
  image: "/dishes/garganelli/plato_monroe_hd.png",
  galleryImages: [
    "/dishes/garganelli/plato_monroe_hd.png",
    "/dishes/garganelli/Vista45Grados.jpg",
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
  stockAvailable: true,
};

export const DISHES: Dish[] = [FEATURED_DISH];
