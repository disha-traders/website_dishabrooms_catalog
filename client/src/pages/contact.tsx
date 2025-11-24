import { Layout } from "@/components/layout";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageSquare, Send, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const config = useConfig();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'email' | 'whatsapp'>('email');
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Wholesale Enquiry",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      if (submissionType === 'email') {
        // Construct email body
        const body = `Name: ${formData.name}%0D%0APhone: ${formData.phone}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
        
        // Open mail client
        window.location.href = `mailto:${config.contact.email}?subject=${encodeURIComponent(formData.subject)} - ${formData.name}&body=${body}`;
      } else {
        // Construct WhatsApp message
        const text = `*New Enquiry from Website*%0a%0a*Name:* ${formData.name}%0a*Subject:* ${formData.subject}%0a*Phone:* ${formData.phone}%0a*Email:* ${formData.email}%0a%0a*Message:*%0a${formData.message}`;
        
        // Use the phone number from config, stripping non-digits
        const phone = config.contact.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      }
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-[#002147] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00A896]/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Have questions about our products or want to place a bulk order? We are here to help.
          </p>
        </div>
      </div>

      <div className="bg-[#F0F4F8] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Left: Contact Info Card */}
            <div className="space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-[#00A896] relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-heading font-bold text-[#002147] mb-8">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-[#CD7F32]/10 rounded-xl flex items-center justify-center shrink-0 text-[#CD7F32] group-hover:bg-[#CD7F32] group-hover:text-white transition-all duration-300">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002147] mb-1 text-lg">Visit Factory</h3>
                        <p className="text-gray-500 leading-relaxed">{config.contact.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-[#00A896]/10 rounded-xl flex items-center justify-center shrink-0 text-[#00A896] group-hover:bg-[#00A896] group-hover:text-white transition-all duration-300">
                        <Phone size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002147] mb-1 text-lg">Call Us</h3>
                        <a href={`tel:${config.contact.phone}`} className="text-gray-500 font-mono text-lg hover:text-[#00A896] transition-colors">
                          {config.contact.phone}
                        </a>
                        <p className="text-gray-400 text-sm mt-1">Mon - Sat, 9am - 6pm</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-[#002147]/10 rounded-xl flex items-center justify-center shrink-0 text-[#002147] group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002147] mb-1 text-lg">Email Us</h3>
                        <a href={`mailto:${config.contact.email}`} className="text-gray-500 hover:text-[#002147] transition-colors">
                          {config.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/20 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
                <div>
                   <h3 className="font-bold text-[#075E54] text-xl mb-2 flex items-center gap-2">
                     <MessageCircle className="w-6 h-6" />
                     Quick Inquiry?
                   </h3>
                   <p className="text-[#075E54]/80">Chat directly with our sales team on WhatsApp.</p>
                </div>
                <a 
                  href={config.social.whatsappLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-whatsapp-custom whitespace-nowrap shadow-none"
                >
                  Chat Now
                </a>
              </div>

               {/* Branches Section */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-[#002147] mb-4">Our Branches</h2>
                <div className="flex flex-wrap gap-3">
                  {config.branches && config.branches.map((branch: string, index: number) => (
                    <div key={index} className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 shadow-sm font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-[#00A896]" />
                      {branch}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-[#002147]">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-[#002147] mb-4">Message Sent!</h2>
                  <p className="text-gray-500 max-w-md mb-8 text-lg">
                    Thank you for contacting us. We have prepared an email for you to send, or our team will get back to you shortly if you chose another method.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)} 
                    variant="outline"
                    className="border-[#002147] text-[#002147] hover:bg-[#002147]/5"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-heading font-bold text-[#002147] mb-6">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Your Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="+91 98765 43210" 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input 
                        id="email" 
                        placeholder="john@company.com" 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(val) => setFormData({...formData, subject: val})}
                      >
                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] h-12">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wholesale Enquiry">Wholesale / Distributor Enquiry</SelectItem>
                          <SelectItem value="Retail Order">Retail Order</SelectItem>
                          <SelectItem value="Custom Manufacturing">Custom Manufacturing</SelectItem>
                          <SelectItem value="Export Enquiry">Export Enquiry</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Please share details about your requirements..." 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] min-h-[150px] resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <div className="border-2 border-[#00A896]/30 rounded-xl p-4 bg-[#00A896]/5">
                         <h3 className="text-center text-[#002147] font-bold mb-3 uppercase tracking-wide text-sm">Send Message By</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            type="submit" 
                            onClick={() => setSubmissionType('whatsapp')}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#00A896] to-[#008C7D] hover:from-[#008C7D] hover:to-[#007A6E] h-12 text-base shadow-md text-white font-bold"
                          >
                            {loading && submissionType === 'whatsapp' ? (
                              <>
                                <Loader2 className="animate-spin mr-2 w-4 h-4" /> Opening...
                              </>
                            ) : (
                              <>
                                <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp
                              </>
                            )}
                          </Button>

                          <Button 
                            type="submit" 
                            onClick={() => setSubmissionType('email')}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#00A896] to-[#008C7D] hover:from-[#008C7D] hover:to-[#007A6E] h-12 text-base shadow-md text-white font-bold"
                          >
                            {loading && submissionType === 'email' ? (
                              <>
                                <Loader2 className="animate-spin mr-2 w-4 h-4" /> Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 w-5 h-5" /> Email
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
