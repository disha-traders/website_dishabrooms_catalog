import { Layout } from "@/components/layout";
import { useConfig } from "@/hooks/use-config";
import { CheckCircle, MapPin, Users, Award, TrendingUp, Quote } from "lucide-react";
import heroBg from "@assets/stock_images/manufacturing_factor_f5c4b17f.jpg";

export default function About() {
  const config = useConfig();
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-[#002147] flex items-center justify-center overflow-hidden">
        <img 
          src={heroBg} 
          alt="Manufacturing Facility" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#002147]/50 to-[#002147]"></div>
        
        <div className="relative z-10 text-center p-6 max-w-4xl">
          <span className="text-[#00A896] font-medium tracking-widest uppercase text-sm mb-4 block" data-testid="text-established">Established 1996</span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight" data-testid="heading-about-hero">
            We Don't Just Make Brooms,<br/>We Craft Cleanliness.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light" data-testid="text-about-description">
            The story of {config.companyName} and our relentless pursuit of manufacturing excellence in Tamil Nadu.
          </p>
        </div>
      </div>

      <div className="bg-[#F8FAFC]">
        <div className="container mx-auto px-4 py-16 md:py-24">
          
          {/* CEO Section */}
          <div className="max-w-6xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-2/5 relative min-h-[400px] bg-[#002147]">
                <img 
                  src="/images/ceo-moorthy.jpg" 
                  alt="Mr. Moorthy, CEO" 
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 text-white">
                  <h3 className="text-2xl font-bold">Mr. Moorthy</h3>
                  <p className="text-[#00A896] font-medium">Founder & CEO</p>
                </div>
              </div>
              
              <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <Quote className="text-[#00A896]/20 w-16 h-16 mb-6" />
                <h2 className="text-3xl font-heading font-bold text-[#002147] mb-6">
                  A Vision for Quality
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  "When I started {config.companyName}, my goal wasn't just to sell products. It was to build a brand that people trust blindly for their home's hygiene. We started small, but our commitment to using the best raw materials never wavered. Today, 'Alagu Mayil' stands as a testament to that persistence."
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Leadership</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 text-[#002147] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#002147] mb-1">25+</h3>
              <p className="text-gray-500 text-sm">Years of Excellence</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-teal-50 text-[#00A896] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A896] group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#002147] mb-1">500+</h3>
              <p className="text-gray-500 text-sm">Happy Distributors</p>
            </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-amber-50 text-[#CD7F32] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD7F32] group-hover:text-white transition-colors">
                <Award size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#002147] mb-1">100%</h3>
              <p className="text-gray-500 text-sm">Quality Guaranteed</p>
            </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MapPin size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#002147] mb-1">5</h3>
              <p className="text-gray-500 text-sm">Major Branches</p>
            </div>
          </div>

          {/* Narrative Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#00A896] font-bold tracking-wider uppercase text-sm">
                  <span className="w-8 h-0.5 bg-[#00A896]"></span>
                  Our Mission
                </div>
                <h2 className="text-3xl font-heading font-bold text-[#002147]">
                  Empowering Local Artisans,<br/>Delivering Global Quality.
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                   We recognized a gap in the market for reliable, durable brooms and mops that could withstand the rigors of daily use. Starting as a small unit, we have grown into a dedicated manufacturing facility.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  We employ skilled local artisans who take pride in their craft. Every product that leaves our factory is a result of hours of careful labor and quality checks.
                </p>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#00A896] shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Ethically sourced grass and fibers</span>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#00A896] shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Hand-bound for superior grip and durability</span>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#00A896] shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Tested for minimal shedding and maximum life</span>
                </li>
              </ul>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 bg-gradient-to-br from-[#00A896]/20 to-[#002147]/20 rounded-3xl blur-lg"></div>
               <div className="relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                 <div className="space-y-6">
                    <div className="bg-[#002147]/5 p-6 rounded-xl border-l-4 border-[#002147]">
                       <h4 className="font-bold text-[#002147] text-lg mb-2">The Brand "Alagu Mayil"</h4>
                       <p className="text-gray-600 italic">
                         "Alagu Mayil" represents beauty and grace, much like the Peacock. We chose this name to symbolize our commitment to bringing cleanliness and beauty to your spaces.
                       </p>
                    </div>
                    
                    <div className="bg-[#CD7F32]/5 p-6 rounded-xl border-l-4 border-[#CD7F32]">
                       <h4 className="font-bold text-[#002147] text-lg mb-2">Production Capacity</h4>
                       <p className="text-gray-600">
                         We are equipped to handle large scale orders, serving a diverse network of distributors, retailers, and exporters across South India.
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
