import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Loader2, List, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category, dbGetCategories, dbSaveCategory, dbDeleteCategory } from "@/lib/db-service";

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  const refreshCategories = async () => {
    try {
      const items = await dbGetCategories();
      setCategories(items);
      setLoading(false);
    } catch (e) {
      console.error("Failed to load categories", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const handleSeedCategories = async () => {
    if (!confirm("Initialize default categories?")) return;
    // Re-fetch will trigger seeding logic in service if empty
    localStorage.removeItem("disha_categories");
    await refreshCategories();
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
    if (confirm("Are you sure? This might affect products using this category.")) {
      await dbDeleteCategory(id);
      await refreshCategories();
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await dbSaveCategory(
        {
          ...formData,
          sortOrder: Number(formData.sortOrder),
        },
        editingCategory?.id
      );
      setIsDialogOpen(false);
      await refreshCategories();
    } catch (e) {
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
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden gap-0">
          <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6F6F4] flex items-center justify-center text-[#00A896]">
                {editingCategory ? <Edit2 size={18} /> : <Plus size={20} />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#002147]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-sm mt-0.5">
                  {editingCategory ? "Modify category details below." : "Create a new product category."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-5 bg-gray-50/30">
            <div className="space-y-2">
              <Label htmlFor="cat-name" className="text-gray-700 font-medium">Category Name <span className="text-red-500">*</span></Label>
              <Input 
                id="cat-name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Grass Brooms"
                className="h-11 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cat-desc" className="text-gray-700 font-medium">Description</Label>
              <Textarea 
                id="cat-desc"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of this category..." 
                className="min-h-[80px] bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cat-sort" className="text-gray-700 font-medium">Sort Order</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="cat-sort"
                  type="number" 
                  value={formData.sortOrder} 
                  onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} 
                  className="h-11 w-24 bg-white border-gray-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all"
                />
                <p className="text-xs text-gray-500 flex-1">
                  Determines the display order in the catalog. Lower numbers appear first (0, 1, 2...).
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-gray-100 bg-white gap-3">
             <Button 
               variant="outline" 
               onClick={() => setIsDialogOpen(false)}
               className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
             >
               Cancel
             </Button>
             <Button 
               onClick={handleSaveCategory} 
               disabled={saving} 
               className="h-11 px-8 bg-[#00A896] hover:bg-[#008C7D] text-white font-bold shadow-lg shadow-[#00A896]/20 transition-all hover:shadow-xl"
             >
               {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
               Save Category
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
