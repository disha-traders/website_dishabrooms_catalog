import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, Box, Truck, ShieldCheck, Sparkles, Brush, Eraser, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/products";
import heroBg from "@assets/stock_images/manufacturing_factor_f5c4b17f.jpg";

export default function Home() {
  const config = useConfig();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  const categories = [
    { name: "Grass Brooms", icon: Sparkles, desc: "Premium soft grass brooms" },
    { name: "Coco Brooms", icon: Brush, desc: "Hard bristles for outdoors" },
    { name: "Yarn Mops", icon: Eraser, desc: "Super absorbent floor mops" },
    { name: "Wipers & Brushes", icon: Box, desc: "Durable cleaning tools" },
  ];

  useEffect(() => {
    async function fetchFeatured() {
      if (!db) return;
      try {
        // Get first 4 active products sorted by sortOrder
        const q = query(
          collection(db, "products"), 
          where("isActive", "==", true),
          orderBy("sortOrder", "asc"),
          limit(4)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setFeaturedProducts(items);
      } catch (e) {
        console.error("Failed to fetch featured products", e);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-custom relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in slide-in-from-left duration-700">
              <div className="inline-block bg-[#00A896]/20 border border-[#00A896]/30 backdrop-blur-sm px-4 py-1 rounded-full text-[#95D426] text-sm font-bold uppercase tracking-widest shadow-sm">
                Direct Manufacturer
              </div>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight text-white">
                {config.hero.title || "Quality Brooms & Mops"}
              </h1>
              <p className="text-lg lg:text-xl max-w-xl leading-relaxed text-gray-200">
                {config.hero.subtitle || config.tagline || "Manufacturing premium cleaning products with pride in Tamil Nadu."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/products" className="btn-primary-custom text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:bg-[#008c7d]">
                  View Product Catalog
                </Link>
                <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-custom text-lg px-8 py-4 shadow-lg hover:shadow-xl gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
            
            {/* Hero Image Collage */}
            <div className="relative h-[400px] lg:h-[500px] hidden lg:block animate-in zoom-in duration-1000">
               <div className="absolute top-10 right-10 w-72 h-96 bg-[#CD7F32] rounded-2xl shadow-2xl rotate-3 z-10 overflow-hidden border-4 border-white/20">
                 <img src={heroBg} alt="Factory" className="w-full h-full object-cover opacity-90 mix-blend-overlay" />
               </div>
               <div className="absolute bottom-10 left-16 w-72 h-72 bg-[#00A896] rounded-2xl shadow-2xl -rotate-6 z-20 overflow-hidden border-4 border-white/20 flex items-center justify-center p-6">
                 <div className="text-center text-white">
                   <div className="text-5xl font-heading font-bold mb-2">100%</div>
                   <div className="text-lg uppercase tracking-wider font-medium">Quality Guarantee</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#F0F4F8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-[#002147] mb-4">Our Product Range</h2>
            <div className="w-24 h-1 bg-[#00A896] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group card-custom p-8 text-center block h-full hover:-translate-y-2 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-[#00A896]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00A896] transition-colors duration-300">
                  <cat.icon size={32} className="text-[#00A896] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#002147] mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{cat.desc}</p>
                <span className="text-[#00A896] font-semibold text-sm group-hover:underline flex items-center justify-center gap-1">
                  View Products <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#002147] text-white p-10 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <h3 className="text-3xl font-heading font-bold mb-6">Why Choose <br/><span className="text-[#95D426]">Alagu Mayil?</span></h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  We are committed to delivering the highest quality cleaning products directly from our factory to your store.
                </p>
                <Link href="/about">
                  <Button className="bg-white text-[#002147] hover:bg-gray-100 font-bold rounded-full px-6">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 text-white/5">
                <ShieldCheck size={200} />
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 border border-gray-100 rounded-xl hover:border-[#CD7F32]/50 transition-colors shadow-sm hover:shadow-md bg-[#F0F4F8]">
                 <div className="w-12 h-12 bg-[#CD7F32]/10 rounded-lg flex items-center justify-center mb-4 text-[#CD7F32]">
                   <Box size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-[#002147] mb-2">Factory-Direct Supply</h4>
                 <p className="text-gray-500 text-sm">No middlemen. Get the best prices directly from the manufacturer.</p>
               </div>
               
               <div className="p-6 border border-gray-100 rounded-xl hover:border-[#00A896]/50 transition-colors shadow-sm hover:shadow-md bg-[#F0F4F8]">
                 <div className="w-12 h-12 bg-[#00A896]/10 rounded-lg flex items-center justify-center mb-4 text-[#00A896]">
                   <Star size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-[#002147] mb-2">Consistent Quality</h4>
                 <p className="text-gray-500 text-sm">Rigorous quality checks to ensure every broom lasts longer.</p>
               </div>

               <div className="p-6 border border-gray-100 rounded-xl hover:border-[#002147]/50 transition-colors shadow-sm hover:shadow-md bg-[#F0F4F8]">
                 <div className="w-12 h-12 bg-[#002147]/10 rounded-lg flex items-center justify-center mb-4 text-[#002147]">
                   <Truck size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-[#002147] mb-2">Reliable Packing & Dispatch</h4>
                 <p className="text-gray-500 text-sm">Secure packaging and timely dispatch for all bulk orders.</p>
               </div>

               <div className="p-6 border border-gray-100 rounded-xl hover:border-[#95D426]/50 transition-colors shadow-sm hover:shadow-md bg-[#F0F4F8]">
                 <div className="w-12 h-12 bg-[#95D426]/10 rounded-lg flex items-center justify-center mb-4 text-[#95D426]">
                   <CheckCircle2 size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-[#002147] mb-2">Bulk & Custom Orders</h4>
                 <p className="text-gray-500 text-sm">We cater to wholesalers, supermarkets, and exporters with custom requirements.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For Strip */}
      <section className="py-12 bg-[#785748]/5 border-y border-[#785748]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[#785748] font-bold uppercase tracking-widest text-sm md:text-base text-center">
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#CD7F32]"/> Kirana Stores</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#CD7F32]"/> Supermarkets</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#CD7F32]"/> Wholesalers</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#CD7F32]"/> Exporters</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#002147] mb-6">
            Looking for a reliable broom & mop supplier?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Partner with us for consistent quality and competitive pricing. We are ready to fulfill your bulk requirements.
          </p>
          <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-full px-8 h-14 shadow-xl shadow-green-500/20 text-lg gap-2">
              <MessageCircle className="w-6 h-6" />
              Share Your Requirement on WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
