import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductsTab } from "@/components/admin/products-tab";
import { SettingsTab } from "@/components/admin/settings-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Auth not initialized");
      return;
    }
    
    setLoginLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the redirect/state update
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = "Failed to login.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Try again later.";
      }
      setError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00A896]" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-[#002147]/10 rounded-full flex items-center justify-center mb-4 text-[#002147]">
              <Lock size={24} />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-[#002147]">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dishatraders.com"
                  className="bg-gray-50 border-gray-200 focus:bg-white h-11 focus:border-[#00A896]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 focus:bg-white h-11 focus:border-[#00A896]"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">{error}</p>}
              <Button type="submit" disabled={loginLoading} className="w-full bg-[#002147] hover:bg-[#003366] h-11 text-base">
                {loginLoading ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
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
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00A896] data-[state=active]:text-[#00A896] text-gray-500 rounded-none pb-3 px-1 font-medium text-base transition-all hover:text-[#002147]"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00A896] data-[state=active]:text-[#00A896] text-gray-500 rounded-none pb-3 px-1 font-medium text-base transition-all hover:text-[#002147]"
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
