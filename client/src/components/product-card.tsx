import { Product } from "@/lib/products";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const config = useConfig();
  const [isLoaded, setIsLoaded] = useState(false);
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in this product: ${product.name} (Code: ${product.code}). Please provide more details.`
  );
  // Use the hook's config which might have updated whatsappLink, or construct it here as fallback
  const whatsappLink = `https://wa.me/${config.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {/* Loading Skeleton Overlay */}
        <div 
          className={`absolute inset-0 bg-gray-100 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
        />
        
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          referrerPolicy="no-referrer"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-white/90 backdrop-blur-sm text-brand-cetacean hover:bg-white shadow-sm border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
            {product.category}
          </Badge>
        </div>
        
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-brand-gold text-white border-none shadow-sm flex items-center gap-1 px-2">
              <ShieldCheck size={12} /> Featured
            </Badge>
          </div>
        )}

        {/* Quick Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-2">
           <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-brand-cetacean px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-brand-teal hover:text-white"
          >
             <MessageCircle size={16} /> Quick Enquiry
           </a>
           {config.social.shopOnlineLink && (
             <a 
              href={config.social.shopOnlineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 bg-[#CD7F32] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#B06A26]"
            >
               <ArrowUpRight size={16} /> Shop Online
             </a>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
           <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">
             {product.code}
           </div>
           {product.size && (
             <div className="text-xs font-medium text-brand-teal bg-brand-teal/5 px-2 py-1 rounded">
               {product.size}
             </div>
           )}
        </div>
        
        <h3 className="text-lg font-bold text-brand-cetacean mb-2 leading-tight group-hover:text-brand-teal transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="pt-4 border-t border-gray-50 mt-auto grid grid-cols-2 gap-2">
           {config.social.shopOnlineLink && (
            <a 
              href={config.social.shopOnlineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#CD7F32] border border-[#CD7F32] rounded-lg py-2 hover:bg-[#CD7F32] hover:text-white transition-all duration-300"
            >
              <ArrowUpRight size={16} />
              <span>Shop</span>
            </a>
          )}
           
           <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 text-sm font-bold text-white bg-brand-cetacean rounded-lg py-2 hover:bg-brand-teal transition-all duration-300 ${!config.social.shopOnlineLink ? 'col-span-2' : ''}`}
          >
            <MessageCircle size={16} />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}
