import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Loader2, AlertCircle, List, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { categories as defaultCategories } from "@/lib/products";

interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sortOrder: 0
  });

  // Fetch categories
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    
    try {
      const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        setCategories(items);
        setLoading(false);
      }, (err) => {
        console.error("Failed to fetch categories", err);
        setError("Failed to load categories.");
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      setLoading(false);
      setError("An error occurred.");
    }
  }, []);

  const handleSeedCategories = async () => {
    if (!db) return;
    if (!confirm("Initialize default categories?")) return;
    
    try {
      const promises = defaultCategories.map((catName, index) => {
        return addDoc(collection(db, "categories"), {
          name: catName,
          description: "Standard category",
          sortOrder: index,
          createdAt: new Date()
        });
      });
      await Promise.all(promises);
    } catch (e) {
      alert("Error seeding categories");
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      sortOrder: categories.length
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      sortOrder: category.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!db) return;
    if (confirm("Are you sure? This might affect products using this category.")) {
      try {
        await deleteDoc(doc(db, "categories", id));
      } catch (e) {
        alert("Error deleting category");
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!db) return;
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const categoryData = {
        ...formData,
        updatedAt: new Date(),
        sortOrder: Number(formData.sortOrder),
      };

      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), categoryData);
      } else {
        await addDoc(collection(db, "categories"), {
          ...categoryData,
          createdAt: new Date()
        });
      }
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error saving category", e);
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#002147]">Category Management</h2>
          <p className="text-sm text-gray-500">Organize your product categories</p>
        </div>
        <div className="flex gap-2">
          {categories.length === 0 && (
             <Button onClick={handleSeedCategories} variant="outline" className="gap-2">
               <List size={16} /> Initialize Defaults
             </Button>
          )}
          <Button 
            onClick={handleAddCategory} 
            className="bg-[#00A896] hover:bg-[#008C7D] text-white gap-2 rounded-full px-6 shadow-sm"
          >
            <Plus size={18} /> Add Category
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#00A896]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
              No categories found. Add one or initialize defaults.
            </div>
          ) : (
            categories.map((category) => (
              <Card key={category.id} className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-l-[#00A896]">
                <div>
                  <h3 className="font-bold text-[#002147] text-lg">{category.name}</h3>
                  {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 mr-2">Sort: {category.sortOrder}</span>
                  <Button size="icon" variant="ghost" onClick={() => handleEditCategory(category)}>
                    <Edit2 size={16} className="text-gray-500 hover:text-[#00A896]" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Grass Brooms"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Optional description" 
              />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input 
                type="number" 
                value={formData.sortOrder} 
                onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} 
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
             <Button onClick={handleSaveCategory} disabled={saving} className="bg-[#00A896] hover:bg-[#008C7D]">
               {saving ? <Loader2 className="animate-spin" /> : <Save size={16} className="mr-2" />}
               Save Category
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
