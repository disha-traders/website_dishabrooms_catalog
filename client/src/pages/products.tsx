import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/products";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");

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
    // Update URL without reload
    if (cat === "All") {
       setLocation("/products");
    } else {
       // simple query param update simulation as wouter basic Link doesn't handle search params easily
       // We just update state here for now, the URL update is secondary in this mock
    }
  };

  return (
    <Layout>
      <div className="bg-brand-cetacean text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Products</h1>
          <p className="text-gray-300 max-w-2xl">
            Explore our wide range of high-quality cleaning products designed for durability and efficiency.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
          <button
            onClick={() => handleCategoryClick("All")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              activeCategory === "All" 
                ? "bg-brand-cetacean text-white shadow-lg" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                activeCategory === cat 
                  ? "bg-brand-teal text-white shadow-lg" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

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
      </div>
    </Layout>
  );
}
