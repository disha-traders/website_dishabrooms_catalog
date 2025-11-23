import { Product } from "@/lib/products";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in this product: ${product.name} (Code: ${product.code}). Please provide more details.`
  );
  const whatsappLink = `https://wa.me/${config.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="product-card h-full flex flex-col relative">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-brand-teal hover:bg-brand-teal text-white border-none">
            {product.category}
          </Badge>
        </div>
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-brand-gold hover:bg-brand-gold text-white border-none">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1">
        <div className="text-xs text-gray-500 mb-2 font-mono">{product.code}</div>
        <h3 className="text-lg font-bold text-brand-cetacean mb-2 line-clamp-2 h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="text-sm font-medium text-brand-blue">
          Size: <span className="text-gray-700">{product.size}</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-whatsapp w-full justify-center"
        >
          <MessageCircle className="w-4 h-4" />
          Enquire on WhatsApp
        </a>
      </CardFooter>
    </div>
  );
}
