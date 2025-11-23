import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { products } from "@/lib/products";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, Box, Truck, ShieldCheck } from "lucide-react";
import heroBg from "@assets/stock_images/manufacturing_factor_f5c4b17f.jpg";

// Icons for categories - using generic Lucide icons as placeholders
import { Sparkles, Brush, Eraser } from "lucide-react";

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured);
  const categories = [
    { name: "Grass Brooms", icon: Sparkles, desc: "Premium soft grass brooms" },
    { name: "Coco Brooms", icon: Brush, desc: "Hard bristles for outdoors" },
    { name: "Yarn Mops", icon: Eraser, desc: "Super absorbent floor mops" },
    { name: "Wipers & Brushes", icon: Box, desc: "Durable cleaning tools" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-custom relative overflow-hidden">
        {/* Removed background overlays to let the CSS gradient shine through as requested */}
        
        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in slide-in-from-left duration-700">
              <div className="inline-block bg-brand-teal/20 border border-brand-teal/30 backdrop-blur-sm px-4 py-1 rounded-full text-brand-chartreuse text-sm font-bold uppercase tracking-widest">
                Direct Manufacturer
              </div>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">
                {config.hero.title}
              </h1>
              <p className="text-lg lg:text-xl max-w-xl leading-relaxed">
                {config.tagline} <br/>
                Manufacturing grass brooms, coco brooms, yarn mops, and more with pride in Tamil Nadu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products">
                  <a className="btn-primary-custom">
                    View Product Catalog
                  </a>
                </Link>
                <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-custom">
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
            
            {/* Hero Image Collage Placeholder */}
            <div className="relative h-[400px] lg:h-[500px] hidden lg:block animate-in zoom-in duration-1000">
               {/* Abstract shapes/collage */}
               <div className="absolute top-10 right-10 w-64 h-80 bg-brand-gold rounded-2xl shadow-2xl rotate-3 z-10 overflow-hidden border-4 border-white/20">
                 <img src={heroBg} alt="Factory" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
               </div>
               <div className="absolute bottom-10 left-20 w-72 h-64 bg-brand-teal rounded-2xl shadow-2xl -rotate-6 z-20 overflow-hidden border-4 border-white/20">
                 {/* Placeholder for product collage */}
                 <div className="w-full h-full flex items-center justify-center bg-brand-teal/80 text-white font-bold text-xl text-center p-4">
                   Premium Quality<br/>Since 2024
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-brand-cetacean mb-4">Our Product Range</h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} href={`/products?category=${encodeURIComponent(cat.name)}`}>
                <a className="group card-custom p-8 text-center block h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <cat.icon size={32} className="text-brand-blue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-cetacean mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{cat.desc}</p>
                  <span className="text-brand-blue font-semibold text-sm group-hover:underline flex items-center justify-center gap-1">
                    View Products <ArrowRight size={14} />
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-brand-cetacean text-white p-10 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-heading font-bold mb-6">Why Choose <br/><span className="text-brand-chartreuse">Alagu Mayil?</span></h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  We are committed to delivering the highest quality cleaning products directly from our factory to your store.
                </p>
                <Link href="/about">
                  <Button className="bg-white text-brand-cetacean hover:bg-gray-100 font-bold">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 text-white/5">
                <ShieldCheck size={200} />
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 border border-gray-100 rounded-xl hover:border-brand-gold/30 transition-colors">
                 <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center mb-4 text-brand-gold">
                   <Box size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-brand-cetacean mb-2">Factory-Direct Supply</h4>
                 <p className="text-gray-500 text-sm">No middlemen. Get the best prices directly from the manufacturer.</p>
               </div>
               
               <div className="p-6 border border-gray-100 rounded-xl hover:border-brand-teal/30 transition-colors">
                 <div className="w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-4 text-brand-teal">
                   <Star size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-brand-cetacean mb-2">Consistent Quality</h4>
                 <p className="text-gray-500 text-sm">Rigorous quality checks to ensure every broom lasts longer.</p>
               </div>

               <div className="p-6 border border-gray-100 rounded-xl hover:border-brand-blue/30 transition-colors">
                 <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4 text-brand-blue">
                   <Truck size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-brand-cetacean mb-2">Reliable Packing & Dispatch</h4>
                 <p className="text-gray-500 text-sm">Secure packaging and timely dispatch for all bulk orders.</p>
               </div>

               <div className="p-6 border border-gray-100 rounded-xl hover:border-brand-green/30 transition-colors">
                 <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4 text-brand-green">
                   <CheckCircle2 size={24} />
                 </div>
                 <h4 className="text-lg font-bold text-brand-cetacean mb-2">Bulk & Custom Orders</h4>
                 <p className="text-gray-500 text-sm">We cater to wholesalers, supermarkets, and exporters with custom requirements.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For Strip */}
      <section className="py-12 bg-brand-mud/10 border-y border-brand-mud/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-brand-mud font-bold uppercase tracking-widest text-sm md:text-base text-center">
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-gold"/> Kirana Stores</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-gold"/> Supermarkets</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-gold"/> Wholesalers</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-gold"/> Exporters</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-cetacean mb-6">
            Looking for a reliable broom & mop supplier?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Partner with us for consistent quality and competitive pricing. We are ready to fulfill your bulk requirements.
          </p>
          <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-full px-8 h-14 shadow-xl shadow-brand-green/20">
              Share Your Requirement on WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
