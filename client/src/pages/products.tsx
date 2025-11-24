import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { categories, Product } from "@/lib/products";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firebase
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
      console.error("Error setting up listener", e);
      setLoading(false);
    }
  }, []);

  // Parse query param for initial category
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat as any)) {
      setActiveCategory(cat);
    }
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
       setLocation("/products");
    }
  };

  return (
    <Layout>
      <div className="hero-custom py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Products</h1>
          <p className="max-w-2xl opacity-90">
            Explore our wide range of high-quality cleaning products designed for durability and efficiency.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="filter-bar justify-center md:justify-start">
          <button
            onClick={() => handleCategoryClick("All")}
            className={cn(
              "filter-pill",
              activeCategory === "All" ? "active" : ""
            )}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "filter-pill",
                activeCategory === cat ? "active" : ""
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4 text-brand-blue" size={32} />
            <p>Loading catalog...</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No products found in this category.</p>
                <button 
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 text-brand-blue hover:underline font-medium"
                >
                  View all products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
