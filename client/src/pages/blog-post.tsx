import { Layout } from "@/components/layout";
import { Blog, dbGetBlogById } from "@/lib/db-service";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft, Share2, Clock, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Single Blog Post Page - Magazine Style
 */
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
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-heading font-bold text-[#002147] mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The story you are looking for does not exist.</p>
          <Link href="/blogs">
            <Button>Back to Magazine</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="min-h-screen bg-white pb-20">
        
        {/* Progress Bar (Optional nice-to-have, skipping for MVP) */}

        {/* Header Section */}
        <div className="container mx-auto px-4 max-w-4xl pt-12 md:pt-20 pb-8 text-center">
          <Link href="/blogs" className="inline-flex items-center text-[#00A896] font-bold tracking-wide uppercase text-xs mb-8 hover:underline">
            <ArrowLeft size={14} className="mr-2" /> Back to Magazine
          </Link>
          
          <div className="mb-6 flex justify-center">
            <span className="bg-[#00A896]/10 text-[#00A896] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {blog.category || "Feature Story"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#002147] mb-8 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium border-y border-gray-100 py-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#00A896]" />
              <span className="uppercase tracking-wide text-xs">{blog.author}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#00A896]" />
              <span className="uppercase tracking-wide text-xs">{blog.date ? format(new Date(blog.date), "MMMM d, yyyy") : "Unknown Date"}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#00A896]" />
              <span className="uppercase tracking-wide text-xs">{blog.readTime || "5 min read"}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="container mx-auto px-4 max-w-5xl mb-16">
           <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
             {/* If first section is Youtube, show it, otherwise placeholder/first text image */}
             {blog.sections.find(s => s.type === "youtube") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${blog.sections.find(s => s.type === "youtube")?.videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
             ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#1e3a5f] flex items-center justify-center">
                   <span className="text-white/20 font-heading text-9xl">Dh</span>
                </div>
             )}
           </div>
           <div className="text-center mt-4 text-sm text-gray-400 italic font-sans">
             Visual storytelling from the heart of our factory.
           </div>
        </div>

        {/* Content Body */}
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          {blog.sections.map((section, index) => {
            // Skip the first YouTube video if we used it as Hero
            if (section.type === "youtube" && index === blog.sections.findIndex(s => s.type === "youtube")) {
              return null; 
            }

            switch (section.type) {
              case "text":
                return (
                  <div key={index} className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed font-sans">
                    {/* Add drop-cap to first paragraph of first text section */}
                    <p className={index === 0 ? "first-letter:text-7xl first-letter:font-bold first-letter:text-[#002147] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]" : ""}>
                      {section.content}
                    </p>
                  </div>
                );
              
              case "youtube":
                return (
                  <div key={index} className="my-12 rounded-xl overflow-hidden shadow-lg aspect-video bg-black">
                     {section.videoId && (
                       <iframe
                         width="100%"
                         height="100%"
                         src={`https://www.youtube.com/embed/${section.videoId}`}
                         title="YouTube video player"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         className="w-full h-full"
                       ></iframe>
                     )}
                  </div>
                );

              case "gdrive":
                 return (
                  <div key={index} className="my-12 rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-100">
                    {section.embedUrl && (
                      <iframe 
                        src={section.embedUrl} 
                        width="100%" 
                        height="100%" 
                        allow="autoplay"
                        className="w-full h-full"
                      ></iframe>
                    )}
                  </div>
                 );
                 
              default:
                return null;
            }
          })}

          {/* Pull Quote Example (Static for now as not in data structure, but good for design feel) */}
          <div className="my-12 pl-6 border-l-4 border-[#00A896] italic text-2xl font-sans font-medium text-[#002147] leading-relaxed">
            "We believe that true sustainability starts with the hands that craft the product, not just the material itself."
          </div>

        </div>
        
        {/* Footer CTA - Magazine Style */}
        <div className="container mx-auto px-4 max-w-3xl mt-20">
           <div className="bg-[#F0F4F8] rounded-2xl p-8 md:p-12 text-center border border-white shadow-sm">
             <h3 className="text-2xl font-heading font-bold text-[#002147] mb-4">
               Inspired by this story?
             </h3>
             <p className="text-gray-600 mb-8 max-w-lg mx-auto">
               Support our mission and bring home these eco-friendly products handcrafted by our artisans.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/products">
                 <Button className="bg-[#002147] text-white hover:bg-[#003366] px-8 py-6 text-lg font-bold">
                    <ShoppingCart className="mr-2" size={20} /> Shop Online
                 </Button>
               </Link>
               <Button variant="outline" className="px-8 py-6 text-lg border-[#002147] text-[#002147] hover:bg-gray-100" onClick={() => {
                  navigator.share?.({
                    title: blog.title,
                    url: window.location.href
                  }).catch(() => {});
               }}>
                 <Share2 size={20} className="mr-2" /> Share Story
               </Button>
             </div>
           </div>
        </div>

      </article>
    </Layout>
  );
}
