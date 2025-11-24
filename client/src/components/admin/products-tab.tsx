import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, Product, products as mockProducts } from "@/lib/products";
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Search, AlertCircle, Database } from "lucide-react";
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
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  // Fetch products
  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError("Firebase not initialized");
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
        setError("Failed to load products. Please check your connection.");
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      setLoading(false);
      setError("An unexpected error occurred.");
    }
  }, []);

  const handleSeedData = async () => {
    if (!db) return;
    if (!confirm("This will add all default mock products to your database. Continue?")) return;
    
    setSeeding(true);
    try {
      // We use a batch or just simple loop since batch is limited to 500 operations (we have few)
      // Let's use simple Promise.all for clarity
      const promises = mockProducts.map((p, index) => {
        // Create a clean object without the ID (Firestore generates it)
        const { id, ...data } = p;
        return addDoc(collection(db, "products"), {
          ...data,
          sortOrder: index,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      await Promise.all(promises);
      alert("Successfully seeded " + mockProducts.length + " products!");
    } catch (e) {
      console.error("Seeding error", e);
      alert("Failed to seed data: " + (e as Error).message);
    } finally {
      setSeeding(false);
    }
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
    if (!db) return;
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (e) {
        alert("Error deleting product");
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!db) return;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-brand-cetacean">Products Management</h2>
          <p className="text-sm text-gray-500">Manage your catalog items</p>
        </div>
        <div className="flex gap-2">
          {products.length === 0 && (
            <Button 
              onClick={handleSeedData} 
              variant="outline"
              disabled={seeding}
              className="gap-2 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5"
            >
              {seeding ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
              Seed Mock Data
            </Button>
          )}
          <Button 
            onClick={handleAddProduct} 
            className="bg-brand-green hover:bg-green-600 text-white gap-2 rounded-full px-6 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={18} /> Add New Product
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader2 className="animate-spin mb-2 text-brand-blue" size={32} />
          <p>Loading products from database...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first product or seed with mock data.</p>
              <div className="flex justify-center gap-4">
                 <Button onClick={handleSeedData} variant="outline" disabled={seeding}>
                    {seeding ? "Seeding..." : "Seed Mock Data"}
                 </Button>
                 <Button onClick={handleAddProduct} className="bg-brand-blue text-white">
                   Add Product
                 </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col sm:flex-row items-center p-4 gap-6 overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative border border-gray-100">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-bold text-lg text-brand-cetacean">{product.name}</h3>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        {product.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="inline-block px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-md text-xs font-medium">
                        {product.category}
                      </span>
                      {product.size && (
                        <span className="text-xs text-gray-400 border-l pl-2 ml-1">
                          {product.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-gray-200 text-gray-600 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/5" 
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit2 size={14} /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-gray-50/50">
            <DialogTitle className="text-xl text-brand-cetacean">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Make changes to the product details here." : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-6">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                {formData.imageUrl && formData.imageUrl !== "/images/placeholder.jpg" ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                
                <div className="w-full max-w-xs text-center">
                  <Label htmlFor="image" className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <Upload size={16} /> {editingProduct ? "Change Image" : "Upload Image"}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageFile(e.target.files[0]);
                        // Create a local preview URL
                        const previewUrl = URL.createObjectURL(e.target.files[0]);
                        setFormData({...formData, imageUrl: previewUrl});
                      }
                    }}
                    className="hidden"
                  />
                  {imageFile && <p className="mt-2 text-xs text-green-600 font-medium">Selected: {imageFile.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Premium Grass Broom"
                    className="focus:border-brand-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Product Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. GB-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="size">Size / Dimensions</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="e.g. 48 inches"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Product details and specifications..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50/50">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-blue text-white w-full sm:w-auto" onClick={handleSaveProduct} disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Upload } from "lucide-react";
