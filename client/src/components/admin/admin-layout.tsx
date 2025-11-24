import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans">
      {/* Top Header Bar */}
      <header className="bg-brand-cetacean text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-brand-gold font-bold border border-white/20">
            DT
          </div>
          <h1 className="text-xl font-bold tracking-tight">Disha Traders Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="text-sm text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
              <ExternalLink size={14} />
              View Site
            </a>
          </Link>
          <div className="w-px h-4 bg-white/20"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            className="text-red-200 hover:text-white hover:bg-red-500/20 gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
