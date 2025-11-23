import { Layout } from "@/components/layout";
import { useConfig } from "@/hooks/use-config";
import heroBg from "@assets/stock_images/manufacturing_factor_f5c4b17f.jpg";

export default function About() {
  const config = useConfig();
  return (
    <Layout>
       {/* Header */}
       <div className="relative h-[300px] bg-black flex items-center justify-center overflow-hidden">
        <img 
          src={heroBg} 
          alt="Factory" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">About {config.companyName}</h1>
          <div className="w-20 h-1.5 bg-brand-gold mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Story */}
          <section className="bg-brand-mud/5 p-8 rounded-2xl border-l-4 border-brand-gold">
            <h2 className="text-2xl font-heading font-bold text-brand-cetacean mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-cetacean text-white flex items-center justify-center rounded-full text-sm">01</span>
              Our Story
            </h2>
            <div className="">
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                Established in Tamil Nadu, <strong>{config.companyName}</strong> began with a simple mission: to manufacture high-quality cleaning tools that last. We recognized a gap in the market for reliable, durable brooms and mops that could withstand the rigors of daily use in Indian homes and businesses.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Starting as a small unit, we have grown into a dedicated manufacturing facility, employing skilled local artisans who take pride in their craft. Our journey is one of commitment to quality and service.
              </p>
            </div>
          </section>

          {/* Brand */}
          <section>
             <h2 className="text-2xl font-heading font-bold text-brand-cetacean mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-blue text-white flex items-center justify-center rounded-full text-sm">02</span>
              The Alagu Mayil Brand
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-brand-blue/5 p-8 rounded-xl border border-brand-blue/10">
                <p className="text-gray-700 italic font-medium text-lg mb-4">
                  "Alagu Mayil" represents beauty and grace, much like the Peacock.
                </p>
                <p className="text-gray-600 text-sm">
                  We chose this name to symbolize our commitment to bringing cleanliness and beauty to your spaces. While a broom is a humble tool, we believe it should be made with the same attention to detail as any premium product.
                </p>
              </div>
              <div className="h-full min-h-[200px] bg-gradient-to-br from-brand-blue to-brand-cetacean rounded-xl flex items-center justify-center p-8 text-white text-center">
                <h3 className="text-2xl font-bold">Quality.<br/>Consistency.<br/>Trust.</h3>
              </div>
            </div>
          </section>

          {/* Manufacturing */}
          <section>
            <h2 className="text-2xl font-heading font-bold text-brand-cetacean mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-teal text-white flex items-center justify-center rounded-full text-sm">03</span>
              Manufacturing & Quality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <h4 className="font-bold text-brand-teal mb-2">Ethical Sourcing</h4>
                 <p className="text-sm text-gray-500">We source the finest grass, coco fibers, and cotton yarn directly from trusted farmers and suppliers.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <h4 className="font-bold text-brand-teal mb-2">Skilled Craftsmanship</h4>
                 <p className="text-sm text-gray-500">Every broom is hand-bound and checked by experienced workers who understand the nuances of a good grip and balance.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <h4 className="font-bold text-brand-teal mb-2">Rigorous Testing</h4>
                 <p className="text-sm text-gray-500">Our products undergo durability tests to ensure they don't shed easily and last longer than market alternatives.</p>
               </div>
            </div>
          </section>

          {/* Supply */}
           <section>
            <h2 className="text-2xl font-heading font-bold text-brand-cetacean mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold text-white flex items-center justify-center rounded-full text-sm">04</span>
              Production & Supply chain
            </h2>
            <div className="bg-brand-mud/5 p-8 rounded-xl border border-brand-mud/10">
              <p className="text-gray-700 leading-relaxed">
                We are equipped to handle large scale orders. We proudly serve a diverse network of <strong>distributors, retailers, supermarkets, and exporters</strong> across South India and beyond. Our logistics partners ensure timely delivery, whether it's a small batch for a local store or a truckload for a wholesaler.
              </p>
            </div>
          </section>
        
        </div>
      </div>
    </Layout>
  );
}
