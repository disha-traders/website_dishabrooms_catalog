import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/products";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Loader2, Filter, Search, PackageX, Download, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { dbGetProducts, dbGetCategories } from "@/lib/db-service";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Service
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching products...");
      const [items, cats] = await Promise.all([
        dbGetProducts(),
        dbGetCategories()
      ]);
      
      console.log("Products fetched", items.length);
      setProducts(items);
      setCategories(cats.map(c => c.name));
    } catch (e: any) {
      console.error("Failed to fetch products", e);
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Parse query param for initial category
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat as any)) {
      setActiveCategory(cat);
    }
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
       setLocation("/products");
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(p => {
    // If user selects "All", show all products (even if categories in DB don't match exact string, 
    // though they should. But let's be safe).
    // Actually, we should match strictly if not All.
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase());
    // Only show active products on public page
    const isActive = p.isActive !== false; // Default to true if undefined
    
    return matchesCategory && matchesSearch && isActive;
  });

  console.log("Render products:", { loading, productsCount: products.length, filteredCount: filteredProducts.length });

  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-[#002147] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[#00A896] font-bold tracking-widest uppercase text-sm mb-2 block">Premium Catalog</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
              Quality Cleaning Tools<br/>For Every Need
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Explore our extensive range of brooms, mops, and brushes designed for durability, efficiency, and ease of use.
            </p>
            <div className="mt-8">
               <a href="/catalog.pdf" download="Alagu_Mayil_Catalog.pdf" title="Download Catalog">
                <Button className="h-12 px-6 rounded-full bg-[#00A896] hover:bg-[#008C7D] text-white font-bold text-base gap-2 shadow-lg transition-all hover:scale-105 backdrop-blur-md border border-white/20">
                  <Download className="w-4 h-4" />
                  Download Catalog PDF
                </Button>
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-20">
            
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
               <button
                onClick={() => handleCategoryClick("All")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
                  activeCategory === "All" 
                    ? "bg-[#002147] text-white shadow-md shadow-blue-900/20" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
                    activeCategory === cat 
                      ? "bg-[#002147] text-white shadow-md shadow-blue-900/20" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <Input 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#00A896] rounded-full transition-all"
               />
            </div>
          </div>

          {/* Content Area */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-xl border border-red-100">
              <div className="text-red-500 mb-4">
                <PackageX size={48} />
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-2">Unable to load products</h3>
              <p className="text-red-600/80 max-w-md mb-6">{error}</p>
              <Button 
                onClick={fetchProducts} 
                variant="outline" 
                className="border-red-200 text-red-700 hover:bg-red-100 gap-2"
              >
                <RefreshCw size={16} /> Try Again
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <PackageX size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-[#002147] mb-2">No products found</h3>
                  <p className="text-gray-500 max-w-md mb-8">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <Button 
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                    variant="link"
                    className="text-[#00A896] font-bold hover:underline"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </>
          )}
          
          <div className="mt-16 text-center">
             <p className="text-gray-400 text-sm">Showing {filteredProducts.length} products</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
