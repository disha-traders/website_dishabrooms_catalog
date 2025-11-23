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
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-brand-gold/50 h-full flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <Button 
          asChild 
          className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full shadow-sm group-hover:shadow-md transition-all"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-2" />
            Enquire on WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
