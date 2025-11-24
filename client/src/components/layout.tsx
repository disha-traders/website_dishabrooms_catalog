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
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-cetacean border-t border-white/10 p-4 absolute w-full shadow-xl">
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
                {/* Social placeholders */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-blue transition-colors cursor-pointer">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-green transition-colors cursor-pointer">
                  <span className="sr-only">WhatsApp</span>
                   <Phone size={18} />
                </div>
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
