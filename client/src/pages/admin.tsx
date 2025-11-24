import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductsTab } from "@/components/admin/products-tab";
import { CategoriesTab } from "@/components/admin/categories-tab";
import { SettingsTab, FirebaseSetupGuide } from "@/components/admin/settings-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPassword(""); // Clear password on logout
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#002147] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-6 shadow-xl">
                <ShieldCheck className="text-[#00A896]" size={32} />
             </div>
             <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
             <p className="text-blue-100/80 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-2 pt-8 px-8 text-center">
              <CardTitle className="text-xl font-bold text-[#002147]">Admin Portal</CardTitle>
              <CardDescription>Disha Traders Management System</CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="sr-only">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all text-base"
                      autoFocus
                    />
                  </div>
                </div>
                {error && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full bg-[#002147] hover:bg-[#003366] h-12 text-base font-medium shadow-lg shadow-[#002147]/20 hover:shadow-[#002147]/30 transition-all duration-300">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <Link href="/">
                <a className="text-sm text-gray-500 hover:text-[#002147] font-medium inline-flex items-center gap-2 transition-colors group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Main Website
                </a>
              </Link>
            </div>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 font-medium uppercase tracking-widest">Secure • Encrypted • Private</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      {!db && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <div>
            <strong>Firebase Warning:</strong> Firebase is not configured. Changes will not be saved.
          </div>
        </div>
      )}

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-lg border border-gray-200 w-full sm:w-auto inline-flex h-auto">
          <TabsTrigger 
            value="products" 
            className="flex-1 sm:flex-none min-w-[120px] rounded-md px-4 py-2.5 font-medium text-sm transition-all data-[state=active]:bg-[#002147] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-[#002147] hover:bg-gray-50"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex-1 sm:flex-none min-w-[120px] rounded-md px-4 py-2.5 font-medium text-sm transition-all data-[state=active]:bg-[#002147] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-[#002147] hover:bg-gray-50"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="flex-1 sm:flex-none min-w-[120px] rounded-md px-4 py-2.5 font-medium text-sm transition-all data-[state=active]:bg-[#002147] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-[#002147] hover:bg-gray-50"
          >
            General Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="focus-visible:outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="categories" className="focus-visible:outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="settings" className="focus-visible:outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
          <SettingsTab />
          <FirebaseSetupGuide />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
