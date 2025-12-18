import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, Eye, Calendar, User, FileText, Youtube, Video, X, LayoutGrid, Image as ImageIcon, ArrowUpRight
} from "lucide-react";
import { Blog, BlogSection, dbGetBlogs, dbSaveBlog, dbDeleteBlog } from "@/lib/db-service";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Admin Blogs Management Tab
 * 
 * Interface for creating and editing blog posts.
 * Capabilities:
 * - CRUD operations for Blogs
 * - Dynamic Section Builder (Text, YouTube, Google Drive)
 * - Validation for required fields
 * - Real-time section reordering (future)
 */
export function BlogsTab() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    author: string;
    sections: BlogSection[];
  }>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    author: "Disha Traders",
    sections: []
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await dbGetBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenDialog = (blog?: Blog) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        date: blog.date,
        author: blog.author,
        sections: [...blog.sections]
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        author: "Disha Traders",
        sections: [{ type: "text", content: "" }] // Default one text section
      });
    }
    setIsDialogOpen(true);
  };

  const handleAddSection = (type: 'text' | 'youtube' | 'gdrive') => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { type, content: "", videoId: "", embedUrl: "" }]
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleYoutubeUrlChange = (index: number, url: string) => {
    let videoId = url;
    // Extract ID from various YouTube URL formats
    // Support: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    
    // Update the state with the extracted ID (or the original text if match failed)
    handleSectionChange(index, 'videoId', videoId);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    
    // Validate sections
    const hasEmptySections = formData.sections.some(s => {
       if (s.type === 'text') return !s.content;
       if (s.type === 'youtube') return !s.videoId;
       if (s.type === 'gdrive') return !s.embedUrl;
       return false;
    });

    if (hasEmptySections) {
       toast({ title: "Warning", description: "Some sections have empty content. Please fill them out.", variant: "destructive" });
       return;
    }

    try {
      await dbSaveBlog(formData, editingId || undefined);
      toast({ title: "Success", description: `Blog ${editingId ? 'updated' : 'created'} successfully` });
      setIsDialogOpen(false);
      fetchBlogs();
    } catch (e) {
      toast({ title: "Error", description: "Failed to save blog", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await dbDeleteBlog(id);
        toast({ title: "Success", description: "Blog deleted" });
        fetchBlogs();
      } catch (e) {
        toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#002147] tracking-tight">Magazine Management</h2>
          <p className="text-muted-foreground mt-1">Curate your stories, articles, and video content</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#00A896] hover:bg-[#008C7D] shadow-lg hover:shadow-[#00A896]/20 transition-all rounded-full px-6">
          <Plus size={18} className="mr-2" /> Create New Story
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
             <Card key={i} className="overflow-hidden border-none shadow-md h-[400px]">
               <Skeleton className="h-48 w-full" />
               <CardContent className="p-6 space-y-4">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-20 w-full" />
               </CardContent>
             </Card>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <div className="mx-auto bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-sm">
               <LayoutGrid className="text-slate-300" size={40} />
           </div>
           <h3 className="text-2xl font-semibold text-[#002147] mb-2">No stories yet</h3>
           <p className="text-slate-500 max-w-md mx-auto mb-8">Your digital magazine is waiting for its first story. Create a blog post to engage your audience.</p>
           <Button onClick={() => handleOpenDialog()} variant="outline" className="border-[#00A896] text-[#00A896] hover:bg-[#00A896]/5">
             Create First Post
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="group hover:translate-y-[-5px] transition-all duration-300 border-none shadow-md hover:shadow-xl overflow-hidden flex flex-col h-full bg-white rounded-2xl">
               {/* Cover Image Area */}
               <div className="h-52 bg-slate-100 relative overflow-hidden">
                  {/* Logic: If has youtube, show thumbnail. Else generic pattern */}
                  {blog.sections.find(s => s.type === 'youtube' && s.videoId) ? (
                    <div className="relative w-full h-full">
                       <img 
                          src={`https://img.youtube.com/vi/${blog.sections.find(s => s.type === 'youtube')?.videoId}/mqdefault.jpg`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt="Video thumbnail"
                       />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                       <div className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center shadow-sm">
                          <Youtube size={12} className="mr-1" /> VIDEO
                       </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#004e8a] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
                        <FileText className="text-white/20 transform group-hover:scale-110 transition-transform duration-500" size={64} />
                    </div>
                  )}
                  
                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <Button size="icon" className="h-10 w-10 rounded-full bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:scale-110 transition-all" onClick={() => handleOpenDialog(blog)} title="Edit">
                          <Edit size={16} />
                      </Button>
                      <Button size="icon" className="h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg hover:scale-110 transition-all" onClick={() => handleDelete(blog.id)} title="Delete">
                          <Trash2 size={16} />
                      </Button>
                  </div>
               </div>
               
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#00A896] mb-3">
                  <span className="bg-[#00A896]/10 px-2 py-1 rounded-full">
                     {blog.sections.some(s => s.type === 'youtube') ? 'Video Story' : 'Article'}
                  </span>
                  <span className="text-gray-400 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "Draft"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#002147] mb-3 line-clamp-2 leading-tight group-hover:text-[#00A896] transition-colors">
                  {blog.title}
                </h3>
                
                <div className="text-sm text-slate-500 mb-6 line-clamp-3 flex-1 leading-relaxed">
                   {blog.sections.find(s => s.type === 'text')?.content || "No text preview available..."}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A896] to-[#002147] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {blog.author.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-[#002147]">{blog.author}</span>
                           <span className="text-[10px] text-gray-400">Editor</span>
                        </div>
                    </div>
                     <a href={`/blogs/${blog.id}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#00A896] hover:text-[#002147] flex items-center group/link transition-colors">
                        READ FULL STORY <ArrowUpRight size={12} className="ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                     </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-gray-50/50 backdrop-blur-sm">
          <DialogHeader className="p-6 pb-2 bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <DialogTitle className="text-2xl font-bold text-[#002147]">
                        {editingId ? "Edit Story" : "New Story"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-1">
                        Craft your blog post using the magazine editor below
                    </DialogDescription>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">Cancel</Button>
                     <Button onClick={handleSave} className="bg-[#002147] hover:bg-[#003366] rounded-full px-6 shadow-md">
                        {editingId ? 'Update Story' : 'Publish Story'}
                     </Button>
                </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 max-w-3xl mx-auto w-full">
            {/* Metadata Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#00A896] uppercase tracking-wider mb-2">
                    <LayoutGrid size={16} /> Story Metadata
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-gray-700">Headline</Label>
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter an engaging headline..." 
                      className="text-lg font-medium p-6 h-auto bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] transition-all rounded-xl"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Publish Date</Label>
                        <Input 
                          type="date" 
                          value={formData.date} 
                          onChange={(e) => setFormData({...formData, date: e.target.value})} 
                          className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] transition-all rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Author Name</Label>
                        <Input 
                          value={formData.author} 
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          placeholder="e.g. Editorial Team" 
                          className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] transition-all rounded-xl h-12"
                        />
                      </div>
                  </div>
                </div>
            </div>

            {/* Content Builder */}
            <div className="space-y-4">
               <div className="flex justify-between items-center sticky top-[80px] z-20 bg-white/80 backdrop-blur-md py-4 px-6 rounded-2xl border border-white/20 shadow-lg">
                 <Label className="text-lg font-bold text-[#002147] flex items-center gap-2">
                    <FileText className="text-[#00A896]" size={20} />
                    Story Content
                 </Label>
                 <div className="flex gap-1 bg-gray-100 p-1.5 rounded-full shadow-inner">
                   <Button 
                     size="sm" 
                     variant="ghost" 
                     onClick={() => handleAddSection('text')} 
                     className="rounded-full hover:bg-white hover:shadow-sm transition-all px-4 text-gray-600 hover:text-[#002147]"
                   >
                     <Plus size={14} className="mr-1.5" /> Text
                   </Button>
                   <Button 
                     size="sm" 
                     variant="ghost" 
                     onClick={() => handleAddSection('youtube')} 
                     className="rounded-full hover:bg-white hover:shadow-sm transition-all px-4 text-gray-600 hover:text-red-600"
                   >
                     <Plus size={14} className="mr-1.5" /> YouTube
                   </Button>
                   <Button 
                     size="sm" 
                     variant="ghost" 
                     onClick={() => handleAddSection('gdrive')} 
                     className="rounded-full hover:bg-white hover:shadow-sm transition-all px-4 text-gray-600 hover:text-blue-600"
                   >
                     <Plus size={14} className="mr-1.5" /> Drive
                   </Button>
                 </div>
               </div>

               {formData.sections.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#00A896] hover:bg-gray-50/50 transition-all cursor-pointer group" onClick={() => handleAddSection('text')}>
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:scale-110 group-hover:bg-[#00A896]/10 group-hover:text-[#00A896] transition-all">
                      <Plus size={32} />
                   </div>
                   <h3 className="text-gray-900 font-semibold text-lg mb-1">Start Writing</h3>
                   <p className="text-gray-500">Click to add your first content block</p>
                 </div>
               )}

               <div className="space-y-6">
                 {formData.sections.map((section, index) => (
                   <Card key={index} className="relative border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all rounded-2xl bg-white">
                     <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${
                        section.type === 'youtube' ? 'bg-red-500' : 
                        section.type === 'gdrive' ? 'bg-blue-500' : 
                        'bg-[#002147]'
                     }`} />
                     
                     <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-full shadow-sm bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-100"
                            onClick={() => handleRemoveSection(index)}
                        >
                            <X size={14} />
                        </Button>
                     </div>

                     <CardContent className="p-6 pl-8">
                       {section.type === 'text' && (
                         <div className="space-y-3">
                           <Label className="flex items-center gap-2 text-[#002147]/60 uppercase text-xs font-bold tracking-wider mb-2">
                                <FileText size={14}/> Text Block
                           </Label>
                           <Textarea 
                             value={section.content}
                             onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                             placeholder="Write your story content here..."
                             className="min-h-[150px] text-base leading-relaxed border-gray-200 focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 rounded-xl resize-y bg-transparent"
                           />
                         </div>
                       )}

                       {section.type === 'youtube' && (
                         <div className="space-y-4">
                           <Label className="flex items-center gap-2 text-red-500 uppercase text-xs font-bold tracking-wider mb-2">
                                <Youtube size={14}/> YouTube Video
                           </Label>
                           <div className="flex flex-col sm:flex-row gap-6 items-start">
                               <div className="flex-1 space-y-3 w-full">
                                   <Input 
                                     value={section.videoId}
                                     onChange={(e) => handleYoutubeUrlChange(index, e.target.value)}
                                     placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...)"
                                     className="font-mono text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500 rounded-xl h-11"
                                   />
                                   <p className="text-xs text-gray-500 flex items-center gap-1.5 px-1">
                                     <div className="w-1 h-1 rounded-full bg-red-500" /> Supports full URLs or Video IDs
                                   </p>
                               </div>
                               {section.videoId && (
                                   <div className="w-full sm:w-48 aspect-video bg-black rounded-xl overflow-hidden shadow-lg shrink-0 border border-gray-100 ring-2 ring-white">
                                        <img 
                                            src={`https://img.youtube.com/vi/${section.videoId}/mqdefault.jpg`} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                   </div>
                               )}
                           </div>
                         </div>
                       )}

                       {section.type === 'gdrive' && (
                         <div className="space-y-3">
                           <Label className="flex items-center gap-2 text-blue-500 uppercase text-xs font-bold tracking-wider mb-2">
                                <Video size={14}/> Google Drive Video
                           </Label>
                           <Input 
                             value={section.embedUrl}
                             onChange={(e) => handleSectionChange(index, 'embedUrl', e.target.value)}
                             placeholder="https://drive.google.com/file/d/.../preview"
                             className="font-mono text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl h-11"
                           />
                           <p className="text-xs text-gray-500 flex items-center gap-1.5 px-1">
                             <div className="w-1 h-1 rounded-full bg-blue-500" /> Use the <b>preview</b> link from Google Drive
                           </p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ))}
               </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
