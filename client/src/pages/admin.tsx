import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductsTab } from "@/components/admin/products-tab";
import { SettingsTab } from "@/components/admin/settings-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
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
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-lg rounded-xl bg-white">
          <CardHeader className="text-center pb-2 pt-6">
            <div className="mx-auto w-12 h-12 bg-[#002147]/10 rounded-full flex items-center justify-center mb-4 text-[#002147]">
              <Lock size={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-[#002147]">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-gray-50 border-gray-200 focus:bg-white h-11 focus:border-[#00A896]"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">{error}</p>}
              <Button type="submit" className="w-full bg-[#002147] hover:bg-[#003366] h-11 text-base font-medium shadow-md hover:shadow-lg transition-all">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
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
            value="settings"
            className="flex-1 sm:flex-none min-w-[120px] rounded-md px-4 py-2.5 font-medium text-sm transition-all data-[state=active]:bg-[#002147] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-[#002147] hover:bg-gray-50"
          >
            General Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="focus-visible:outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="settings" className="focus-visible:outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
