import { Layout } from "@/components/layout";
import { BlogCard } from "@/components/blog-card";
import { Blog, dbGetBlogs, BLOG_CATEGORIES } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, ShoppingCart, MessageCircle, PlayCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Modern Magazine Style Blogs Page
 */
export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...BLOG_CATEGORIES];

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await dbGetBlogs();
        setBlogs(data);
      } catch (e) {
        console.error("Failed to load blogs", e);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const filteredBlogs = activeCategory === "All" 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const popularBlogs = blogs.length > 1 ? blogs.slice(1, 4) : []; // Just picking some for sidebar
  const videoBlogs = blogs.filter(b => b.sections.some(s => s.type === "youtube"));

  return (
    <Layout>
      {/* Magazine Header */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#00A896] font-bold tracking-[0.25em] text-xs uppercase mb-6 block">The Disha Journal</span>
          <h1 className="text-5xl md:text-8xl font-heading font-bold text-[#002147] mb-8 tracking-tight">
            Disha Magazine
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-sans italic">
            "Stories of craftsmanship, sustainability, and the women who power our vision."
          </p>
        </div>
      </div>

      {/* Category Navigation - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center min-w-max gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#002147] text-white shadow-md transform scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#002147]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAFA] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {loading ? (
             <div className="py-12 space-y-12 max-w-6xl mx-auto">
               <Skeleton className="w-full aspect-video rounded-2xl" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="space-y-4">
                     <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                     <Skeleton className="h-4 w-full" />
                   </div>
                 ))}
               </div>
             </div>
          ) : (
            <>
              {/* HERO FEATURED ARTICLE */}
              {featuredBlog && activeCategory === "All" && (
                <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <BlogCard blog={featuredBlog} variant="featured" />
                </section>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT: MAIN CONTENT FEED */}
                <div className="lg:col-span-8 space-y-16">
                  
                  {/* Latest Stories Header */}
                  <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 mb-8">
                     <h3 className="font-heading text-2xl font-bold text-[#002147]">Latest Stories</h3>
                     <span className="text-sm text-gray-500 font-medium">Showing {filteredBlogs.length} articles</span>
                  </div>

                  {filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                      {filteredBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                      <LayoutGrid className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">No stories found in this category.</p>
                    </div>
                  )}

                  {/* Video Section embedded in feed */}
                  {videoBlogs.length > 0 && activeCategory === "All" && (
                    <div className="bg-[#002147] rounded-2xl p-8 md:p-12 text-white my-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A896] rounded-full blur-[100px] opacity-20 pointer-events-none" />
                       
                       <div className="flex items-center gap-3 mb-8">
                         <PlayCircle className="text-[#00A896]" size={28} />
                         <h3 className="font-heading text-3xl font-bold">Factory Stories</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {videoBlogs.slice(0, 2).map((vBlog) => (
                            <div key={vBlog.id} className="group cursor-pointer">
                               <div className="aspect-video bg-black/40 rounded-lg overflow-hidden relative mb-4 border border-white/10">
                                  {vBlog.sections.find(s => s.type === "youtube")?.videoId && (
                                    <img 
                                      src={`https://img.youtube.com/vi/${vBlog.sections.find(s => s.type === "youtube")?.videoId}/maxresdefault.jpg`}
                                      alt="Video thumbnail"
                                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                  )}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <PlayCircle className="text-white" size={24} fill="currentColor" />
                                    </div>
                                  </div>
                               </div>
                               <h4 className="font-bold text-lg leading-tight group-hover:text-[#00A896] transition-colors">{vBlog.title}</h4>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                </div>

                {/* RIGHT: SIDEBAR */}
                <aside className="lg:col-span-4 space-y-12 h-fit lg:sticky lg:top-24">
                  
                  {/* Popular Articles */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                       <TrendingUp size={18} className="text-[#00A896]" />
                       <h3 className="font-bold text-[#002147] uppercase tracking-wider text-sm">Popular Reads</h3>
                    </div>
                    <div className="space-y-6">
                      {popularBlogs.map(blog => (
                        <BlogCard key={`sidebar-${blog.id}`} blog={blog} variant="sidebar" />
                      ))}
                    </div>
                  </div>

                  {/* Shop CTA */}
                  <div className="bg-[#00A896] p-8 rounded-xl text-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     <div className="relative z-10">
                       <ShoppingCart className="mx-auto text-white mb-4 opacity-90" size={32} />
                       <h3 className="text-2xl font-heading font-bold text-white mb-3">Shop Premium Brooms</h3>
                       <p className="text-white/90 text-sm mb-6 leading-relaxed">
                         Support our artisans and bring home the finest quality eco-friendly cleaning products.
                       </p>
                       <Link href="/products">
                         <Button className="w-full bg-white text-[#00A896] hover:bg-gray-50 font-bold tracking-wide uppercase">
                           Shop Online Now
                         </Button>
                       </Link>
                     </div>
                  </div>

                  {/* Enquiry / WhatsApp */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-[#E6F6F4] text-[#00A896] rounded-full flex items-center justify-center mx-auto mb-4">
                       <MessageCircle size={28} />
                    </div>
                    <h3 className="font-heading font-bold text-[#002147] text-xl mb-2">Have a Question?</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Interested in bulk orders or dealership? Chat with our team directly.
                    </p>
                    <a 
                      href="https://wa.me/919944485598" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center w-full py-3 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#128C7E] transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

                </aside>

              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
