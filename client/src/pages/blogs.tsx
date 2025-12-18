import { Layout } from "@/components/layout";
import { BlogCard } from "@/components/blog-card";
import { Blog, dbGetBlogs } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Public Blogs Listing Page
 * 
 * Displays a grid of all published blog posts and videos.
 * Features:
 * - Fetches blogs from Firebase/LocalStorage
 * - Loading skeleton state
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

  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-[#002147] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00A896]/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Blogs & Videos</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Latest updates, manufacturing insights, and cleaning tips from Disha Brooms.
          </p>
        </div>
      </div>

      <div className="bg-[#F0F4F8] min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden h-96 p-6 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-8">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No blogs posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
