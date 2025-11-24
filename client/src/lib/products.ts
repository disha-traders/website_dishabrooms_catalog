
export interface Product {
  id: string;
  name: string;
  category: string;
  code: string;
  size?: string;
  description: string;
  imageUrl: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: any;
  updatedAt?: any;
}

export const categories = [
  "Grass Brooms", 
  "Coco Brooms", 
  "Yarn Mops", 
  "Wipers & Brushes"
] as const;

export const products: Product[] = [
  {
    id: "am-gb-501",
    name: "Alagu Mayil Grass Broom 501",
    category: "Grass Brooms",
    code: "AM-GB-501",
    size: "Premium Soft, Long Handle",
    description: "Durable grass broom ideal for daily household sweeping. Made from high-quality selected grass.",
    imageUrl: "/products/grass-broom.jpg",
    isFeatured: true,
  },
  {
    id: "am-cb-202",
    name: "Heavy Duty Coco Broom",
    category: "Coco Brooms",
    code: "AM-CB-202",
    size: "Hard Bristles, Outdoor",
    description: "Strong coconut fiber broom designed for rough surfaces and outdoor cleaning.",
    imageUrl: "/products/coco-broom.jpg",
    isFeatured: true,
  },
  {
    id: "am-ym-303",
    name: "Cotton Yarn Floor Mop",
    category: "Yarn Mops",
    code: "AM-YM-303",
    size: "300g, 4ft Handle",
    description: "Super absorbent cotton yarn mop for efficient floor cleaning. Durable plastic holder.",
    imageUrl: "/products/yarn-mop.jpg",
    isFeatured: true,
  },
  {
    id: "am-wb-404",
    name: "Floor Wiper Classic",
    category: "Wipers & Brushes",
    code: "AM-WB-404",
    size: "16 inch",
    description: "High-quality rubber lip floor wiper for instant water removal. Sturdy grip.",
    imageUrl: "/products/floor-wiper.jpg",
  },
  {
    id: "am-gb-505",
    name: "Alagu Mayil Grass Broom Economy",
    category: "Grass Brooms",
    code: "AM-GB-505",
    size: "Standard",
    description: "Affordable grass broom for everyday use. Lightweight and easy to handle.",
    imageUrl: "/products/grass-broom.jpg",
  },
  {
    id: "am-cb-206",
    name: "Coco Yard Broom",
    category: "Coco Brooms",
    code: "AM-CB-206",
    size: "Wide Head",
    description: "Wide head coco broom for covering large areas quickly. Perfect for gardens and driveways.",
    imageUrl: "/products/coco-broom.jpg",
  }
];
