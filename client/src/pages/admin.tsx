import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/lib/config";
import { products, categories } from "@/lib/products";
import { Lock, Save, Plus, Trash2, Edit2 } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Local state for form management (mocking DB updates)
  const [localConfig, setLocalConfig] = useState(config);
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock password
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading font-bold text-brand-cetacean">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-brand-cetacean">Login</Button>
            </form>
            <div className="mt-4 text-center text-xs text-gray-400">
              (Hint: use 'admin123')
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-brand-cetacean">Disha Traders Admin</h1>
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="text-sm text-gray-500 hover:text-brand-blue">View Site</a>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button className="bg-brand-green text-white gap-2">
                <Plus size={16} /> Add New Product
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {localProducts.map((product) => (
                <Card key={product.id} className="flex flex-col sm:flex-row items-center p-4 gap-6 overflow-hidden">
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-brand-cetacean">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mb-1">{product.code}</p>
                    <span className="inline-block px-2 py-1 bg-brand-teal/10 text-brand-teal rounded text-xs font-bold">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 size={14} /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
             <Card>
               <CardHeader>
                 <CardTitle>General Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label>Company Name</Label>
                     <Input defaultValue={localConfig.companyName} />
                   </div>
                   <div className="space-y-2">
                     <Label>Brand Name</Label>
                     <Input defaultValue={localConfig.brandName} />
                   </div>
                   <div className="space-y-2">
                     <Label>Phone</Label>
                     <Input defaultValue={localConfig.contact.phone} />
                   </div>
                   <div className="space-y-2">
                     <Label>WhatsApp</Label>
                     <Input defaultValue={localConfig.contact.whatsapp} />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label>Address</Label>
                   <Input defaultValue={localConfig.contact.address} />
                 </div>
                 <div className="pt-4">
                   <Button className="bg-brand-cetacean gap-2">
                     <Save size={16} /> Save Changes
                   </Button>
                   <p className="text-xs text-gray-400 mt-2">
                     (Note: In this mock version, changes are not persisted to a database)
                   </p>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
