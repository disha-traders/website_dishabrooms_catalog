import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfig } from "@/hooks/use-config";
import { categories, Product } from "@/lib/products";
import { Lock, Save, Plus, Trash2, Edit2, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Data state
  const liveConfig = useConfig();
  const [localConfig, setLocalConfig] = useState(liveConfig);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Product Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Grass Brooms",
    code: "",
    size: "",
    description: "",
    imageUrl: "/images/placeholder.jpg"
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  // Sync config
  useEffect(() => {
    setLocalConfig(liveConfig);
  }, [liveConfig]);

  // Fetch products
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "products"), orderBy("sortOrder", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(items);
        setLoading(false);
      }, (err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      setLoading(false);
    }
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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setImageFile(null);
    setFormData({
      name: "",
      category: "Grass Brooms",
      code: "",
      size: "",
      description: "",
      imageUrl: "/images/placeholder.jpg"
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImageFile(null);
    setFormData({
      name: product.name,
      category: product.category,
      code: product.code,
      size: product.size,
      description: product.description,
      imageUrl: product.imageUrl
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db) return alert("Firebase not connected");
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (e) {
        alert("Error deleting product");
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!db) return alert("Firebase not connected");
    setSaving(true);
    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `product-images/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        ...formData,
        imageUrl,
        updatedAt: new Date(),
        sortOrder: (editingProduct as any)?.sortOrder || Date.now(),
        isActive: true
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date()
        });
      }
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error saving product", e);
      alert("Failed to save product: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!db) return alert("Firebase not connected");
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "dishaTraders"), localConfig);
      alert("Settings saved!");
    } catch (e) {
      console.error("Error saving settings", e);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
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
        {!db && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
            <strong>Firebase Warning:</strong> Firebase is not configured. Changes will not be saved. 
            Please check your .env configuration.
          </div>
        )}

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button onClick={handleAddProduct} className="bg-brand-green text-white gap-2">
                <Plus size={16} /> Add New Product
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.length === 0 && (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                    No products found. Add your first product!
                  </div>
                )}
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col sm:flex-row items-center p-4 gap-6 overflow-hidden">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md shrink-0 overflow-hidden relative">
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
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEditProduct(product)}>
                        <Edit2 size={14} /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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
                     <Input 
                       value={localConfig.companyName}
                       onChange={(e) => setLocalConfig({...localConfig, companyName: e.target.value})} 
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Brand Name</Label>
                     <Input 
                       value={localConfig.brandName} 
                       onChange={(e) => setLocalConfig({...localConfig, brandName: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Phone</Label>
                     <Input 
                        value={localConfig.contact.phone}
                        onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, phone: e.target.value}})}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>WhatsApp</Label>
                     <Input 
                        value={localConfig.contact.whatsapp}
                        onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, whatsapp: e.target.value}})}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label>Address</Label>
                   <Input 
                      value={localConfig.contact.address}
                      onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, address: e.target.value}})}
                   />
                 </div>
                 <div className="pt-4">
                   <Button onClick={handleSaveSettings} disabled={saving} className="bg-brand-cetacean gap-2">
                     {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                     Save Settings
                   </Button>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Make changes to the product details here." : "Fill in the details for the new product."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({...formData, category: val})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="text-right">
                  Size
                </Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Desc
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {formData.imageUrl && (
                    <div className="text-xs text-gray-500">
                      Current: {formData.imageUrl.split('/').pop()?.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-brand-green text-white" onClick={handleSaveProduct} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : (editingProduct ? "Save Changes" : "Add Product")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
