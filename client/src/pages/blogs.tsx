import { Layout } from "@/components/layout";
import { BlogCard } from "@/components/blog-card";
import { Blog, dbGetBlogs } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid } from "lucide-react";

/**
 * Public Blogs Listing Page
 * 
 * Displays a grid of all published blog posts and videos.
 * Features:
 * - Fetches blogs from Firebase/LocalStorage
 * - Magazine Style Layout with Featured Post
 * - Responsive grid layout
 */
export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const recentBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <Layout>
      {/* Magazine Header */}
      <div className="bg-white pt-20 pb-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#00A896] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">The Journal</span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#002147] mb-6 tracking-tight">
            Disha Magazine
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Exploring the art of traditional broom making, sustainable living, and company updates.
          </p>
        </div>
      </div>

      <div className="bg-white min-h-screen pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {loading ? (
             <div className="py-12 space-y-12">
               {/* Featured Skeleton */}
               <div className="flex flex-col md:flex-row gap-8">
                 <Skeleton className="w-full md:w-2/3 aspect-video rounded-2xl" />
                 <div className="w-full md:w-1/3 space-y-4 pt-4">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-10 w-full" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-2/3" />
                 </div>
               </div>
               {/* Grid Skeleton */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="space-y-4">
                     <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-6 w-full" />
                     <Skeleton className="h-4 w-full" />
                   </div>
                 ))}
               </div>
             </div>
          ) : blogs.length > 0 ? (
            <div className="py-12 space-y-16">
              
              {/* Featured Section */}
              {featuredBlog && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <BlogCard blog={featuredBlog} featured={true} />
                </section>
              )}

              {/* Divider */}
              {recentBlogs.length > 0 && (
                <div className="flex items-center gap-4 py-4">
                   <div className="h-px bg-gray-200 flex-1"></div>
                   <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Stories</span>
                   <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              )}

              {/* Grid Section */}
              {recentBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  {recentBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutGrid className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No stories published yet</h3>
              <p className="text-gray-500">Check back soon for our latest updates.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
