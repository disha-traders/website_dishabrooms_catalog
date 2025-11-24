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
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-brand-cetacean/10 rounded-full flex items-center justify-center mb-4 text-brand-cetacean">
              <Lock size={24} />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-brand-cetacean">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-gray-50 border-gray-200 focus:bg-white h-11"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">{error}</p>}
              <Button type="submit" className="w-full bg-brand-cetacean hover:bg-brand-cetacean/90 h-11 text-base">
                Login to Dashboard
              </Button>
            </form>
            <div className="mt-6 text-center text-xs text-gray-400">
              Protected Area • Disha Traders
            </div>
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
        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue text-gray-500 rounded-none pb-3 px-1 font-medium text-base transition-all"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue text-gray-500 rounded-none pb-3 px-1 font-medium text-base transition-all"
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
