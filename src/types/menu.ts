export type CategoryId =
  | "pastas"
  | "carnes"
  | "cocteleria"
  | "entradas"
  | "postres"
  | "vinos";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  icon: string;
  description: string;
}

export type FlavorProfile = {
  umami?: number; // 1 to 5
  ahumado?: number;
  intensidad?: number;
  dulzor?: number;
  acidez?: number;
  frescura?: number;
};

export type DietaryTag =
  | "Estrella Monroe"
  | "Recomendación Sommelier"
  | "Dry Aged"
  | "Pasta Fresca Fatta a Mano"
  | "Autor Contemporáneo"
  | "Sin Gluten"
  | "Vegetariano"
  | "Pesca Sostenible";

export interface Dish3DModel {
  glbUrl?: string;
  usdzUrl?: string;
  posterImage?: string;
  scale?: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  realDimensions?: string; // e.g. "28cm x 28cm x 12cm"
  hasArSupport: boolean;
}

export interface Dish {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  price: number;
  description: string;
  longStory?: string;
  image: string;
  galleryImages?: string[];
  tags: DietaryTag[];
  chefNotes: string;
  pairingSuggestion: {
    name: string;
    type: "vino" | "coctel" | "destilado";
    notes: string;
    price?: number;
  };
  flavorProfile: FlavorProfile;
  allergens?: string[];
  preparationTime?: string;
  origin?: string;
  isSignature?: boolean;
  isNew?: boolean;
  is3dAvailable?: boolean;
  model3d?: Dish3DModel;
  stockAvailable?: boolean;
}

export interface OrderItem {
  dish: Dish;
  quantity: number;
  specialInstructions?: string;
  selectedPairing?: boolean;
}

export type TableZone =
  | "salon_principal"
  | "cava_vinos"
  | "terraza_maritima"
  | "barra_autor"
  | "mesa_chef_vip";

export interface TableInfo {
  zone: TableZone;
  tableNumber: string; // e.g. "Mesa 07", "Terraza T-3", "Barra B-2"
  guestName?: string;
}

export interface ReservationRequest {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  zone: TableZone;
  occasion?: "Aniversario" | "Negocios" | "Cumpleaños" | "Cena Romántica" | "Degustación" | "Otro";
  specialRequests?: string;
}
