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
            <Button 
              asChild 
              className="btn-whatsapp-custom rounded-full px-6 gap-2"
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
            <div className="flex gap-4">
                {/* Facebook Link */}
                <a 
                  href={config.social.facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-all hover:-translate-y-1 cursor-pointer"
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
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E4405F] transition-all hover:-translate-y-1 cursor-pointer"
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
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] transition-all hover:-translate-y-1 cursor-pointer"
                  aria-label="Contact us on WhatsApp"
                  data-testid="link-whatsapp"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 6.4c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4l-1.2 4.4 4.5-1.2c1.2.7 2.5 1 3.9 1 4.4 0 8-3.6 8-8 0-2.1-.8-4.1-2.3-5.6zm-5.6 13.5c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.5.6.6-2.4-.2-.2c-.7-1.1-1-2.3-1-3.6 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.8 2s2 3 2 4.8c0 3.7-3 6.7-6.7 6.7z"/><path d="M12.5 9.5c-.3 0-.6.2-.7.5-.1.3.1.6.4.7.8.3 1.4.9 1.7 1.7.1.3.4.5.7.4.3-.1.5-.4.4-.7-.4-1.1-1.2-2-2.2-2.4-.1-.1-.2-.1-.3-.1z" /></svg>
                </a>
                {/* LinkedIn Link */}
                <a 
                  href={config.social.linkedinLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0A66C2] transition-all hover:-translate-y-1 cursor-pointer"
                  aria-label="Visit our LinkedIn page"
                  data-testid="link-linkedin"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
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
                  <a href={`tel:${config.contact.phone}`} className="hover:text-white">{config.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                  <a href={`mailto:${config.contact.email}`} className="hover:text-white">{config.contact.email}</a>
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
