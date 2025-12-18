import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, Eye, Calendar, User, FileText, Youtube, Video, X 
} from "lucide-react";
import { Blog, BlogSection, dbGetBlogs, dbSaveBlog, dbDeleteBlog } from "@/lib/db-service";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#002147]">Blog Management</h2>
          <p className="text-gray-500">Create and manage your blog posts</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#00A896] hover:bg-[#008C7D]">
          <Plus size={16} className="mr-2" /> New Blog
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No blogs found. Create your first one!</TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">
                      {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {blog.sections.map((s, i) => {
                          if (s.type === 'text') return <FileText key={i} size={14} className="text-gray-400" />;
                          if (s.type === 'youtube') return <Youtube key={i} size={14} className="text-red-500" />;
                          if (s.type === 'gdrive') return <Video key={i} size={14} className="text-blue-500" />;
                          return null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <a href={`/blogs/${blog.id}`} target="_blank" rel="noreferrer">
                           <Button variant="ghost" size="icon" title="View">
                             <Eye size={16} className="text-blue-600" />
                           </Button>
                         </a>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(blog)} title="Edit">
                          <Edit size={16} className="text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)} title="Delete">
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            <DialogDescription>
              Add text sections, YouTube videos, or Google Drive embeds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Blog Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter blog title" 
                />
              </div>
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input 
                  value={formData.author} 
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="e.g. Disha Traders" 
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
               <div className="flex justify-between items-center">
                 <Label className="text-lg font-semibold">Content Sections</Label>
                 <div className="flex gap-2">
                   <Button size="sm" variant="outline" onClick={() => handleAddSection('text')}>
                     <Plus size={14} className="mr-1" /> Text
                   </Button>
                   <Button size="sm" variant="outline" onClick={() => handleAddSection('youtube')}>
                     <Plus size={14} className="mr-1" /> YouTube
                   </Button>
                   <Button size="sm" variant="outline" onClick={() => handleAddSection('gdrive')}>
                     <Plus size={14} className="mr-1" /> Drive Video
                   </Button>
                 </div>
               </div>

               {formData.sections.length === 0 && (
                 <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                   <p className="text-gray-500">No content sections added. Start adding content above.</p>
                 </div>
               )}

               <div className="space-y-4">
                 {formData.sections.map((section, index) => (
                   <Card key={index} className="relative border border-gray-200">
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500 h-6 w-6"
                       onClick={() => handleRemoveSection(index)}
                     >
                       <X size={14} />
                     </Button>
                     <CardContent className="p-4 pt-8">
                       {section.type === 'text' && (
                         <div className="space-y-2">
                           <Label className="flex items-center gap-2"><FileText size={16}/> Text Content</Label>
                           <Textarea 
                             value={section.content}
                             onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                             placeholder="Write your paragraph here..."
                             className="min-h-[100px]"
                           />
                         </div>
                       )}

                       {section.type === 'youtube' && (
                         <div className="space-y-2">
                           <Label className="flex items-center gap-2"><Youtube size={16} className="text-red-500"/> YouTube Video ID</Label>
                           <Input 
                             value={section.videoId}
                             onChange={(e) => handleSectionChange(index, 'videoId', e.target.value)}
                             placeholder="e.g. dQw4w9WgXcQ (ID only, not full URL)"
                           />
                           <p className="text-xs text-gray-500">
                             For https://www.youtube.com/watch?v=<b>dQw4w9WgXcQ</b>, enter <b>dQw4w9WgXcQ</b>
                           </p>
                         </div>
                       )}

                       {section.type === 'gdrive' && (
                         <div className="space-y-2">
                           <Label className="flex items-center gap-2"><Video size={16} className="text-blue-500"/> Google Drive Embed URL</Label>
                           <Input 
                             value={section.embedUrl}
                             onChange={(e) => handleSectionChange(index, 'embedUrl', e.target.value)}
                             placeholder="https://drive.google.com/file/d/.../preview"
                           />
                           <p className="text-xs text-gray-500">
                             Ensure the file is shared as "Anyone with link can view" and use the <b>preview</b> link.
                           </p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ))}
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-[#002147] hover:bg-[#003366]">Save Blog</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
