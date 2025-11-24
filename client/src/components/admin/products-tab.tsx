import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, Product, products as mockProducts } from "@/lib/products";
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Search, AlertCircle, Database, Link as LinkIcon } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, writeBatch } from "firebase/firestore";

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Grass Brooms",
    code: "",
    size: "",
    description: "",
    imageUrl: "/images/placeholder.jpg",
    isActive: true,
    sortOrder: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const promises = mockProducts.map((p, index) => {
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
    setFormData({
      name: "",
      category: "Grass Brooms",
      code: "",
      size: "",
      description: "",
      imageUrl: "/images/placeholder.jpg",
      isActive: true,
      sortOrder: products.length
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      code: product.code,
      size: product.size,
      description: product.description,
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? true,
      sortOrder: product.sortOrder ?? 0
    });
    setErrors({});
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.code.trim()) newErrors.code = "Product code is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    // Image URL Validation
    const url = formData.imageUrl.trim();
    if (url) {
      const isLocalFile = url.startsWith("/fs/") || url.includes("/replit/");
      const isValidPath = url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
      
      if (isLocalFile) {
        newErrors.imageUrl = "This is a local file path. Use a public path like /products/AM-GB-501.jpg or a full https URL.";
      } else if (!isValidPath) {
         newErrors.imageUrl = "Must start with '/' (public path) or 'http(s)://'";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = async () => {
    if (!db) return;
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const productData = {
        ...formData,
        updatedAt: new Date(),
        sortOrder: Number(formData.sortOrder),
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
          <h2 className="text-xl font-bold text-[#002147]">Products Management</h2>
          <p className="text-sm text-gray-500">Manage your catalog items</p>
        </div>
        <div className="flex gap-2">
          {import.meta.env.MODE === "development" && products.length === 0 && (
            <Button 
              onClick={handleSeedData} 
              variant="outline"
              disabled={seeding}
              className="gap-2 border-[#00A896]/30 text-[#00A896] hover:bg-[#00A896]/5"
            >
              {seeding ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
              Seed Mock Data
            </Button>
          )}
          <Button 
            onClick={handleAddProduct} 
            className="bg-[#00A896] hover:bg-[#008C7D] text-white gap-2 rounded-full px-6 shadow-sm hover:shadow-md transition-all"
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
          <Loader2 className="animate-spin mb-2 text-[#00A896]" size={32} />
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
              <p className="text-gray-500 mb-6">Get started by adding your first product.</p>
              <div className="flex justify-center gap-4">
                 {import.meta.env.MODE === "development" && (
                   <Button onClick={handleSeedData} variant="outline" disabled={seeding}>
                      {seeding ? "Seeding..." : "Seed Mock Data"}
                   </Button>
                 )}
                 <Button onClick={handleAddProduct} className="bg-[#00A896] hover:bg-[#008C7D] text-white">
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
                      <h3 className="font-bold text-lg text-[#002147]">{product.name}</h3>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        {product.code}
                      </span>
                      {product.isActive === false && (
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="inline-block px-2 py-1 bg-[#00A896]/10 text-[#00A896] rounded-md text-xs font-medium">
                        {product.category}
                      </span>
                      {product.size && (
                        <span className="text-xs text-gray-400 border-l pl-2 ml-1">
                          {product.size}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 border-l pl-2 ml-1">
                        Sort: {product.sortOrder}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-gray-200 text-gray-600 hover:text-[#00A896] hover:border-[#00A896]/30 hover:bg-[#00A896]/5" 
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
          <DialogHeader className="px-6 py-4 border-b bg-[#002147]/5">
            <DialogTitle className="text-xl text-[#002147]">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Make changes to the product details here." : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-6">
              
              {/* 1. Product Details Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Premium Grass Broom"
                    className={`focus:border-[#00A896] ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Product Code <span className="text-red-500">*</span></Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. GB-001"
                    className={errors.code ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500 focus:ring-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
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

              {/* 2. Image Section */}
              <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex gap-4 items-start">
                   {formData.imageUrl ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-200">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">Image URL</Label>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            className={`pl-9 bg-white ${errors.imageUrl ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                       </div>
                    </div>
                    {errors.imageUrl ? (
                      <p className="text-xs text-red-500 font-medium">{errors.imageUrl}</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                         For local images, upload them to <code>/public/products</code> and use a path like: <code>/products/AM-GB-501.jpg</code>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Catalog Options */}
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50/50">
                 <div className="space-y-2">
                   <Label htmlFor="sortOrder">Sort Order</Label>
                   <Input
                     id="sortOrder"
                     type="number"
                     value={formData.sortOrder}
                     onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})}
                     placeholder="0"
                     className="bg-white"
                   />
                </div>

                <div className="space-y-2 flex items-end pb-2">
                   <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isActive" 
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})}
                      />
                      <Label htmlFor="isActive" className="cursor-pointer">Active Product</Label>
                   </div>
                </div>
              </div>

            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-[#002147]/5">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#002147] hover:bg-[#003366] text-white w-full sm:w-auto" onClick={handleSaveProduct} disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
