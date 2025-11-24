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
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                    />
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
        <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-xl shadow-2xl border-0">
          <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#E6F6F4] flex items-center justify-center text-[#00A896]">
                {editingProduct ? <Edit2 size={18} /> : <Plus size={20} />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#002147] tracking-tight">
                  {editingProduct ? "Edit Product Details" : "Add New Product"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-sm mt-0.5">
                  {editingProduct ? "Update the catalog information below." : "Create a new item for your catalog."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
            <div className="space-y-8">
              
              {/* Section: Basic Info */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#002147] uppercase tracking-wider border-b border-gray-100 pb-2">
                  <span className="bg-[#002147] w-1 h-4 rounded-full"></span>
                  Basic Information
                </div>
                
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 sm:col-span-8 space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Product Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Premium Grass Broom"
                      className={`h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <Label htmlFor="code" className="text-gray-700 font-medium">Product Code <span className="text-red-500">*</span></Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="e.g. GB-001"
                      className={`h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all font-mono text-sm ${errors.code ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.code && <p className="text-xs text-red-500 font-medium">{errors.code}</p>}
                  </div>

                  <div className="col-span-12 sm:col-span-6 space-y-2">
                    <Label htmlFor="category" className="text-gray-700 font-medium">Category <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData({...formData, category: val})}
                    >
                      <SelectTrigger className={`h-11 bg-white border-gray-200 focus:ring-[#00A896]/20 ${errors.category ? "border-red-500 focus:ring-red-500" : ""}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category}</p>}
                  </div>

                  <div className="col-span-12 sm:col-span-6 space-y-2">
                    <Label htmlFor="size" className="text-gray-700 font-medium">Size / Dimensions</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      placeholder="e.g. 48 inches"
                      className="h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all"
                    />
                  </div>

                  <div className="col-span-12 space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Detailed product specifications, material details, and usage instructions..."
                      className="min-h-[100px] bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Media */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#002147] uppercase tracking-wider border-b border-gray-100 pb-2">
                  <span className="bg-[#002147] w-1 h-4 rounded-full"></span>
                  Product Visuals
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                     <Label className="block mb-3 text-gray-700 font-medium">Preview</Label>
                     {formData.imageUrl ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                        />
                        <div className="absolute inset-0 ring-1 ring-black/5 rounded-lg"></div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                        <ImageIcon size={24} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-medium">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="imageUrl" className="text-gray-700 font-medium">Image Source</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className={`pl-10 h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all font-mono text-xs text-gray-600 ${errors.imageUrl ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    
                    {errors.imageUrl ? (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.imageUrl}
                      </p>
                    ) : (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 leading-relaxed">
                           <strong>Tip:</strong> For local images, upload to <code>/public/products</code> folder.<br/>
                           Use path format: <code>/products/your-image-name.jpg</code>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Section: Settings */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#002147] uppercase tracking-wider border-b border-gray-100 pb-2">
                  <span className="bg-[#002147] w-1 h-4 rounded-full"></span>
                  Settings
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="sortOrder" className="text-gray-700 font-medium">Sort Order</Label>
                     <Input
                       id="sortOrder"
                       type="number"
                       value={formData.sortOrder}
                       onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})}
                       placeholder="0"
                       className="h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all"
                     />
                     <p className="text-[10px] text-gray-400">Lower numbers appear first.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label htmlFor="isActive" className="text-base font-medium text-gray-900 cursor-pointer">Active Status</Label>
                        <p className="text-xs text-gray-500">Visible in public catalog</p>
                     </div>
                     <Checkbox 
                        id="isActive" 
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})}
                        className="data-[state=checked]:bg-[#00A896] data-[state=checked]:border-[#00A896] w-6 h-6"
                      />
                  </div>
                </div>
              </section>

            </div>
          </div>

          <DialogFooter className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-11 px-8 bg-[#002147] hover:bg-[#003366] text-white font-medium shadow-lg shadow-[#002147]/10 hover:shadow-[#002147]/20 transition-all" 
              onClick={handleSaveProduct} 
              disabled={saving}
            >
              {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : (editingProduct ? <Edit2 size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />)}
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
