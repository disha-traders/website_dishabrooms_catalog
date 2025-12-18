import { Blog } from "@/lib/db-service";
import { Link } from "wouter";
import { ArrowRight, Clock, PlayCircle } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
  variant?: "standard" | "featured" | "compact" | "sidebar";
}

export function BlogCard({ blog, variant = "standard" }: BlogCardProps) {
  // Extract a short excerpt from the first text section
  const firstTextSection = blog.sections.find(s => s.type === "text");
  const excerpt = firstTextSection?.content 
    ? firstTextSection.content.substring(0, variant === "featured" ? 180 : 100) + "..."
    : "Read more to see content...";

  // Get cover image (Youtube thumbnail or pattern)
  const youtubeSection = blog.sections.find(s => s.type === "youtube" && s.videoId);
  const coverImage = youtubeSection?.videoId 
    ? `https://img.youtube.com/vi/${youtubeSection.videoId}/maxresdefault.jpg`
    : null;

  const categoryColor = "bg-[#00A896] text-white"; // Default Teal

  // --- FEATURED CARD LAYOUT (HERO) ---
  if (variant === "featured") {
    return (
      <Link href={`/blogs/${blog.id}`}>
        <div className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center mb-16">
          {/* Image */}
          <div className="md:col-span-8 relative overflow-hidden rounded-xl aspect-video shadow-lg">
            {coverImage ? (
               <img 
                 src={coverImage} 
                 alt={blog.title} 
                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
               />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#004e8a] flex items-center justify-center">
                 <span className="text-white/20 font-heading text-6xl">Dh</span>
               </div>
            )}
            <div className="absolute top-4 left-4">
               <span className={`${categoryColor} px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm`}>
                 {blog.category || "Featured"}
               </span>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 font-medium">
              <span>{format(new Date(blog.date), "MMM d, yyyy")}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{blog.readTime || "5 min read"}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#002147] mb-4 leading-tight group-hover:text-[#00A896] transition-colors">
              {blog.title}
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-4">
              {excerpt}
            </p>
            
            <div className="flex items-center text-[#002147] font-bold tracking-wide uppercase text-sm group-hover:translate-x-2 transition-transform">
              Read Story <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // --- SIDEBAR / COMPACT CARD LAYOUT ---
  if (variant === "sidebar") {
    return (
      <Link href={`/blogs/${blog.id}`}>
        <div className="group cursor-pointer flex gap-4 mb-6 items-start">
           <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
             {coverImage ? (
                <img src={coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             ) : (
                <div className="w-full h-full bg-[#002147]" />
             )}
           </div>
           <div>
             <span className="text-[10px] font-bold text-[#00A896] uppercase tracking-wider mb-1 block">
               {blog.category || "Article"}
             </span>
             <h4 className="font-heading font-bold text-[#002147] leading-snug group-hover:text-[#00A896] transition-colors line-clamp-2">
               {blog.title}
             </h4>
             <span className="text-xs text-gray-400 mt-2 block">{format(new Date(blog.date), "MMM d")}</span>
           </div>
        </div>
      </Link>
    );
  }

  // --- STANDARD CARD LAYOUT ---
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="group cursor-pointer flex flex-col h-full mb-8">
        <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4 bg-gray-100 shadow-sm">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#1e3a5f]" />
          )}
          
          {youtubeSection && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
               <PlayCircle className="text-white opacity-80 group-hover:scale-110 transition-transform" size={48} />
             </div>
          )}

          <div className="absolute top-4 left-4">
             <span className="bg-white/90 backdrop-blur text-[#002147] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
               {blog.category || "Article"}
             </span>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
             <span>{format(new Date(blog.date), "MMM d, yyyy")}</span>
             {blog.readTime && (
               <>
                 <span className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                 <span className="flex items-center"><Clock size={10} className="mr-1"/> {blog.readTime}</span>
               </>
             )}
          </div>
          
          <h3 className="text-xl font-heading font-bold text-[#002147] mb-3 leading-snug group-hover:text-[#00A896] transition-colors">
            {blog.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-[#002147] uppercase tracking-wider group-hover:text-[#00A896] transition-colors">
            Read Article
          </div>
        </div>
      </div>
    </Link>
  );
}
