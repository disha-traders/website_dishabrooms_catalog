import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, Box, Truck, ShieldCheck, Sparkles, Brush, Eraser, MessageCircle, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/products";
import heroBg from "@assets/stock_images/manufacturing_factor_f5c4b17f.jpg";

import { ProductCard } from "@/components/product-card";

export default function Home() {
  const config = useConfig();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/images/slideshow/slide-1.png",
    "/images/slideshow/slide-2.png",
    "/images/slideshow/slide-3.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      <section className="hero-custom relative overflow-hidden min-h-[85vh] flex items-center bg-gradient-to-br from-[#002147] via-[#003366] to-[#002147]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00A896] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#CD7F32] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00A896] animate-pulse"></span>
                <span className="text-[#00A896] font-bold uppercase tracking-widest text-xs">Since 1998</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight text-white">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">India's Premium</span>
                <span className="block text-[#00A896]">Cleaning Brand</span>
              </h1>
              
              <p className="text-lg lg:text-xl max-w-xl leading-relaxed text-gray-300 font-light border-l-4 border-[#CD7F32] pl-6">
                {config.hero.subtitle || "Experience the superior quality of Alagu Mayil. Handcrafted brooms and mops designed for the modern Indian home."}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/products">
                  <Button className="h-14 px-8 rounded-full bg-[#00A896] hover:bg-[#008C7D] text-white font-bold text-lg shadow-[0_0_20px_rgba(0,168,150,0.3)] transition-all hover:scale-105">
                    View Catalog
                  </Button>
                </Link>
                <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 font-bold text-lg gap-2 backdrop-blur-sm">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Enquiry
                  </Button>
                </a>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#CD7F32]" /> Quality Assured
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="text-[#CD7F32]" /> Pan-India Delivery
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="lg:col-span-5 relative animate-in zoom-in duration-1000 delay-200">
               <div className="relative z-10 w-full max-w-md mx-auto lg:ml-auto">
                 {/* Glow Effect */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-[#00A896] to-[#CD7F32] rounded-2xl blur opacity-30"></div>
                 
                 {/* Image Container */}
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                   <img 
                    src="/images/hero-poster.png" 
                    alt="Alagu Mayil Brand Ambassador" 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                   />
                   
                   {/* Floating Badge - Moved below */}
                 </div>

                 <div className="mt-6 flex justify-center">
                   <div className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold border border-white/20">
                     Trusted by 10,000+ Shops & Distributors
                   </div>
                 </div>
                 
                 <div className="mt-4 flex justify-center">
                   <a href="/catalog.pdf" download="Alagu_Mayil_Catalog.pdf" title="Download Catalog">
                    <Button className="h-12 px-6 rounded-full bg-[#00A896] hover:bg-[#008C7D] text-white font-bold text-base gap-2 shadow-[0_0_15px_rgba(0,168,150,0.4)] transition-all hover:scale-105 hover:shadow-xl backdrop-blur-md border border-white/20">
                      <Download className="w-4 h-4" />
                      Download Catalog PDF
                    </Button>
                   </a>
                 </div>
               </div>
               
               {/* Decorative Dots */}
               <div className="absolute -bottom-12 -left-12 grid grid-cols-6 gap-2 opacity-20">
                 {[...Array(24)].map((_, i) => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden bg-[#F0F4F8]">
        {/* Slideshow Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {slides.map((slide, index) => (
             <div 
               key={index} 
               className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
             >
               <img 
                 src={slide} 
                 alt={`Background Slide ${index + 1}`} 
                 className="w-full h-full object-cover scale-105 animate-pulse-slow"
               />
               {/* Overlay for readability - Reduced opacity from 90 to 80 for visibility */}
               <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
             </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-[#002147] mb-4">Our Product Range</h2>
            <div className="w-24 h-1 bg-[#00A896] mx-auto rounded-full shadow-sm"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative p-8 text-center block h-full transition-all duration-500 hover:-translate-y-2
                           bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden"
              >
                {/* Card Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 ring-4 ring-[#00A896]/10 group-hover:ring-[#00A896]/30">
                    <cat.icon size={36} className="text-[#00A896] transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#002147] mb-3">{cat.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed font-medium">{cat.desc}</p>
                  <span className="inline-flex items-center justify-center gap-2 text-[#00A896] font-bold text-sm bg-[#00A896]/10 px-4 py-2 rounded-full group-hover:bg-[#00A896] group-hover:text-white transition-all duration-300">
                    View Products <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-[#00A896] font-bold tracking-widest uppercase text-sm mb-2 block">Bestsellers</span>
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-[#002147]">Featured Products</h2>
              </div>
              <Link href="/products">
                <Button variant="outline" className="rounded-full border-[#002147]/20 hover:bg-[#002147] hover:text-white transition-all">
                  View All Products
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Strip */}
      <section className="py-16 bg-[#002147] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-[#00A896] mb-2">25+</div>
              <div className="text-gray-300 font-medium">Years of Excellence</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-[#CD7F32] mb-2">50+</div>
              <div className="text-gray-300 font-medium">Premium Products</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-[#00A896] mb-2">10k+</div>
              <div className="text-gray-300 font-medium">Happy Clients</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-[#CD7F32] mb-2">100%</div>
              <div className="text-gray-300 font-medium">Quality Guarantee</div>
            </div>
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
