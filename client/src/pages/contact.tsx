import { Layout } from "@/components/layout";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Contact() {
  const config = useConfig();
  const enquiryTemplate = encodeURIComponent(
    "Hello Disha Traders, I would like to make a distributor/bulk enquiry.\n\nName: \nBusiness Name: \nCity: \nProducts Interested: \nApprox Qty: "
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-cetacean text-center mb-12">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Left: Info */}
            <div className="bg-brand-cetacean text-white p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-heading font-bold mb-8 border-b border-white/20 pb-4">
                  {config.companyName}
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-brand-gold">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-gold mb-1">Visit Factory</h3>
                      <p className="text-gray-300 leading-relaxed">{config.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-brand-green">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-green mb-1">Call Us</h3>
                      <p className="text-gray-300 font-mono text-lg">{config.contact.phone}</p>
                      <p className="text-gray-400 text-sm mt-1">Mon - Sat, 9am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-brand-teal">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-teal mb-1">Email Us</h3>
                      <p className="text-gray-300">{config.contact.email}</p>
                    </div>
                  </div>
                </div>

                {/* Placeholder Map */}
                <div className="mt-12 w-full h-48 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-white/5">
                  Google Maps Embed Placeholder
                </div>
              </div>
            </div>

            {/* Right: Enquiry */}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-brand-cetacean mb-2">
                Distributor & Bulk Enquiry
              </h2>
              <p className="text-gray-500 mb-8">
                Are you a Wholesaler, Retailer, or Exporter? Get the best factory rates.
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-brand-blue mb-4 flex items-center gap-2">
                    <MessageSquare size={18} />
                    Please share these details:
                  </h3>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span> Your Name
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span> Business Name
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span> City / State
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span> Products Required
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span> Approximate Monthly Quantity
                    </li>
                  </ul>
                </div>
              </div>

              <a 
                href={`https://wa.me/${config.contact.whatsapp}?text=${enquiryTemplate}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02]">
                  Start WhatsApp Chat
                </Button>
              </a>
              <p className="text-center text-xs text-gray-400 mt-4">
                Clicking will open WhatsApp with a pre-filled message template.
              </p>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
