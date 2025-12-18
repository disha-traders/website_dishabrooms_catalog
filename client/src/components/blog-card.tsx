import { Blog } from "@/lib/db-service";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, User, PlayCircle, FileText } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  // Extract a short excerpt from the first text section
  const firstTextSection = blog.sections.find(s => s.type === "text");
  const excerpt = firstTextSection?.content 
    ? firstTextSection.content.substring(0, featured ? 250 : 120) + "..."
    : "Read more to see content...";

  // Get cover image (Youtube thumbnail or pattern)
  const youtubeSection = blog.sections.find(s => s.type === "youtube" && s.videoId);
  const coverImage = youtubeSection?.videoId 
    ? `https://img.youtube.com/vi/${youtubeSection.videoId}/maxresdefault.jpg`
    : null;

  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className={`group cursor-pointer flex flex-col h-full ${featured ? 'md:flex-row gap-8 items-center' : ''}`}>
        {/* Image Container */}
        <div className={`relative overflow-hidden rounded-2xl bg-gray-100 ${featured ? 'w-full md:w-2/3 aspect-video' : 'w-full aspect-[4/3]'} mb-6 shadow-sm group-hover:shadow-md transition-all duration-500`}>
          {coverImage ? (
            <div className="relative w-full h-full">
              <img 
                src={coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay for video indicator */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                 <PlayCircle size={14} className="mr-1 text-red-600" /> Watch Video
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#004e8a] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
               <FileText className="text-white/20" size={featured ? 80 : 48} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${featured ? 'w-full md:w-1/3' : 'flex-1'}`}>
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider text-[#00A896] mb-3 uppercase">
            <span className="flex items-center">
               {youtubeSection ? 'Video Story' : 'Article'}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-400 font-medium normal-case">
              {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "Recent"}
            </span>
          </div>
          
          <h3 className={`font-bold text-[#002147] mb-3 group-hover:text-[#00A896] transition-colors leading-tight ${featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {blog.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
          
          <div className="flex items-center text-[#002147] font-bold text-sm mt-auto group-hover:translate-x-1 transition-transform border-b-2 border-transparent group-hover:border-[#00A896] w-fit pb-0.5">
            Read Full Story <ArrowRight size={16} className="ml-2 text-[#00A896]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
