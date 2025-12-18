import { Link, useLocation } from "wouter";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin, MessageCircle, Settings } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Blogs", path: "/blogs" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="header-custom w-full shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-heading font-bold tracking-wide text-white uppercase">
              {config.brandName}
            </span>
            <span className="text-[10px] text-brand-teal uppercase tracking-widest opacity-90">
              {config.companyName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-chartreuse uppercase tracking-wider",
                  location === item.path ? "text-brand-chartreuse font-bold" : "text-gray-300"
                )}
              >
                {item.label}
              </Link>
            ))}
            {config.social.shopOnlineLink && (
              <Button 
                asChild 
                className="bg-[#CD7F32] hover:bg-[#B06A26] text-white rounded-full px-6 gap-2 border-2 border-[#CD7F32] transition-all hover:scale-105 shadow-md"
              >
                <a href={config.social.shopOnlineLink} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  Shop Online
                </a>
              </Button>
            )}
            <Button 
              asChild 
              className="btn-whatsapp-custom rounded-full px-6 gap-2 border-2 border-brand-green"
            >
              <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Enquire Now
              </a>
            </Button>
          </nav>


          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

          {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-cetacean border-t border-white/10 p-4 absolute w-full shadow-xl z-50 animate-in slide-in-from-top-5 duration-300">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={cn(
                    "text-base font-medium py-2 border-b border-white/5",
                    location === item.path ? "text-brand-chartreuse" : "text-gray-300"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {config.social.shopOnlineLink && (
                <a 
                  href={config.social.shopOnlineLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#CD7F32] text-center text-white font-bold py-3 rounded-md mt-2 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  Shop Online
                </a>
              )}
              <a 
                href={config.social.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-green text-center text-white font-bold py-3 rounded-md mt-2"
              >
                Enquire on WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-white">{config.brandName}</h3>
              <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
                {config.tagline}
              </p>
              <div className="flex gap-3 items-center">
                {/* Facebook Link */}
                <a 
                  href={config.social.facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                  style={{background: '#1877F2'}}
                  aria-label="Visit our Facebook page"
                  data-testid="link-facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                {/* Instagram Link */}
                <a 
                  href={config.social.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                  style={{background: '#E4405F'}}
                  aria-label="Follow us on Instagram"
                  data-testid="link-instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm0 2C5.7 4 4 5.7 4 7.8v8.4c0 2.1 1.7 3.8 3.8 3.8h8.4c2.1 0 3.8-1.7 3.8-3.8V7.8c0-2.1-1.7-3.8-3.8-3.8H7.8zm8.5 3c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-4.3 2c2.9 0 5.3 2.4 5.3 5.3s-2.4 5.3-5.3 5.3-5.3-2.4-5.3-5.3 2.4-5.3 5.3-5.3zm0 2c-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3-1.5-3.3-3.3-3.3z" /></svg>
                </a>
                {/* WhatsApp Link */}
                <a 
                  href={config.social.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                  style={{background: '#25D366'}}
                  aria-label="Contact us on WhatsApp"
                  data-testid="link-whatsapp"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.01 1 4.33L2 22l6.67-1c1.32.64 2.79 1 4.33 1 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.75-.35-3.92-.99l-.28-.15-2.9.55.56-2.87-.18-.29C3.38 14.77 3 13.43 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9zm4.85-7.42c-.26-.13-1.56-.77-1.8-.86-.24-.09-.41-.13-.59.13-.18.26-.69.87-.85 1.05-.16.17-.33.2-.59.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.3-1.56-1.45-1.82-.15-.26-.02-.4.11-.53.11-.11.26-.29.39-.43.13-.15.17-.25.26-.42.08-.17.04-.32-.02-.45-.06-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.44-.15 0-.32-.02-.49-.02s-.44.06-.67.3c-.24.24-.9.88-.9 2.13s.92 2.47 1.05 2.64c.13.17 1.82 2.79 4.4 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.56-.64 1.78-1.25.22-.6.22-1.12.15-1.25-.06-.13-.23-.2-.48-.33z" /></svg>
                </a>
                {/* LinkedIn Link */}
                <a 
                  href={config.social.linkedinLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                  style={{background: '#0A66C2'}}
                  aria-label="Visit our LinkedIn page"
                  data-testid="link-linkedin"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
                </a>
                {/* Aratai Messenger Link */}
                <a 
                  href={config.social.arataiLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                  style={{background: '#FFD700'}}
                  aria-label="Chat with us on Aratai"
                  data-testid="link-aratai"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H7l-3 3V8c0-1.1.9-2 2-2z"></path><line x1="17" y1="4" x2="17" y2="14"></line></svg>
                </a>
              </div>
            </div>

            {/* Links Column */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-brand-teal uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-brand-teal uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                  <span>{config.contact.address}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                  <a href={`tel:${config.contact.phone}`} className="hover:text-white transition-colors" data-testid="footer-phone">{config.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-brand-green shrink-0" />
                  <a href={config.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-green transition-colors" data-testid="footer-whatsapp">
                    +91 {config.contact.whatsapp?.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2') || config.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                  <a href={`mailto:${config.contact.email}`} className="hover:text-white transition-colors" data-testid="footer-email">{config.contact.email}</a>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="footer-bottom flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
               <Link href="/admin" className="text-gray-500 hover:text-brand-gold transition-colors" aria-label="Admin Login">
                 <Settings size={14} />
               </Link>
               <p className="flex items-center gap-1">
                  Built by <span className="text-brand-gold font-semibold">Ourcresta BusOps</span>
               </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
