import { Blog } from "@/lib/db-service";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  // Extract a short excerpt from the first text section
  const firstTextSection = blog.sections.find(s => s.type === "text");
  const excerpt = firstTextSection?.content 
    ? firstTextSection.content.substring(0, 150) + "..."
    : "Read more to see content...";

  return (
    <Link href={`/blogs/${blog.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-none shadow-md rounded-xl overflow-hidden bg-white">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-[#00A896]" />
              {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "Recent"}
            </div>
            <div className="flex items-center gap-1">
              <User size={12} className="text-[#00A896]" />
              {blog.author}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-[#002147] mb-3 group-hover:text-[#00A896] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          
          <div className="flex items-center text-[#00A896] font-semibold text-sm mt-auto group-hover:translate-x-1 transition-transform">
            Read More <ArrowRight size={16} className="ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
