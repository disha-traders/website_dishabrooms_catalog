import { Layout } from "@/components/layout";
import { Blog, dbGetBlogById } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blogs/:id");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      if (params?.id) {
        try {
          const data = await dbGetBlogById(params.id);
          setBlog(data || null);
        } catch (e) {
          console.error("Failed to load blog", e);
        } finally {
          setLoading(false);
        }
      }
    }
    loadBlog();
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#002147] mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you are looking for does not exist or has been removed.</p>
          <Link href="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="bg-[#F0F4F8] py-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/blogs" className="inline-flex items-center text-[#00A896] font-medium mb-8 hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to Blogs
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#002147] mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#00A896]" />
                {blog.date ? format(new Date(blog.date), "MMMM d, yyyy") : "Unknown Date"}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#00A896]" />
                {blog.author}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl py-12 space-y-10">
          {blog.sections.map((section, index) => {
            switch (section.type) {
              case "text":
                return (
                  <div key={index} className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>{section.content}</p>
                  </div>
                );
              
              case "youtube":
                return (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg aspect-video bg-black">
                     {section.videoId ? (
                       <iframe
                         width="100%"
                         height="100%"
                         src={`https://www.youtube.com/embed/${section.videoId}`}
                         title="YouTube video player"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         className="w-full h-full"
                       ></iframe>
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-white/50">Invalid Video ID</div>
                     )}
                  </div>
                );

              case "gdrive":
                 return (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-100">
                    {section.embedUrl ? (
                      <iframe 
                        src={section.embedUrl} 
                        width="100%" 
                        height="100%" 
                        allow="autoplay"
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Invalid Drive URL</div>
                    )}
                  </div>
                 );
                 
              default:
                return null;
            }
          })}
        </div>
        
        {/* Footer CTA */}
        <div className="container mx-auto px-4 max-w-4xl pt-8 border-t mt-8">
           <div className="flex justify-between items-center">
             <Link href="/blogs">
               <Button variant="outline">Back to All Blogs</Button>
             </Link>
             <Button variant="ghost" className="text-gray-500 hover:text-[#00A896]" onClick={() => {
                navigator.share?.({
                  title: blog.title,
                  url: window.location.href
                }).catch(() => {});
             }}>
               <Share2 size={18} className="mr-2" /> Share
             </Button>
           </div>
        </div>
      </article>
    </Layout>
  );
}
