import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, setDoc, getDoc } from "firebase/firestore";
import { Product, products as mockProducts, categories as defaultCategories } from "@/lib/products";

// Local Storage Keys
const LS_PRODUCTS = "disha_products";
const LS_CATEGORIES = "disha_categories";
const LS_BLOGS = "disha_blogs";

// Types
export const BLOG_CATEGORIES = [
  "Manufacturing",
  "Women Power",
  "Sustainability",
  "Product Stories",
  "Factory Life",
  "Videos"
];

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface BlogSection {
  type: 'text' | 'youtube' | 'gdrive';
  content?: string;
  videoId?: string;
  embedUrl?: string;
}

export interface Blog {
  id: string;
  title: string;
  date: string;
  author: string;
  category?: string;
  readTime?: string;
  sections: BlogSection[];
}

// Helper to check if Firebase is configured (simple check)
const isFirebaseAvailable = () => !!db;

// --- PRODUCTS SERVICE ---

export const dbGetProducts = async (): Promise<Product[]> => {
  // 1. Try Local Storage first for speed in this prototype
  const localData = localStorage.getItem(LS_PRODUCTS);
  
  if (localData) {
    return JSON.parse(localData);
  }

  // 2. If no local data, try Firebase if available
  if (isFirebaseAvailable()) {
    try {
      const q = query(collection(db, "products"), orderBy("sortOrder", "asc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      
      // If Firebase has data, sync to local for cache
      if (items.length > 0) {
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Firebase fetch failed, falling back to mocks", e);
    }
  }

  // 3. Fallback to Mocks if both fail or are empty (first load)
  // Seed local storage with mocks
  const seededProducts = mockProducts.map((p, i) => ({ ...p, sortOrder: i, isActive: true }));
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(seededProducts));
  return seededProducts;
};

export const dbSaveProduct = async (product: Omit<Product, "id">, id?: string): Promise<void> => {
  const products = await dbGetProducts();
  
  if (id) {
    // Update
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...product } : p);
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(updatedProducts));
    
    // Try syncing to Firebase (fire and forget)
    if (isFirebaseAvailable()) {
      try {
        await updateDoc(doc(db, "products", id), product);
      } catch (e) { console.error("Firebase update failed", e); }
    }
  } else {
    // Add
    const newProduct = { ...product, id: `prod_${Date.now()}` };
    const updatedProducts = [...products, newProduct];
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(updatedProducts));
    
    // Try syncing to Firebase
    if (isFirebaseAvailable()) {
      try {
        await addDoc(collection(db, "products"), product);
      } catch (e) { console.error("Firebase add failed", e); }
    }
  }
};

export const dbDeleteProduct = async (id: string): Promise<void> => {
  const products = await dbGetProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(updatedProducts));
  
  if (isFirebaseAvailable()) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) { console.error("Firebase delete failed", e); }
  }
};

// --- CATEGORIES SERVICE ---

export const dbGetCategories = async (): Promise<Category[]> => {
  const localData = localStorage.getItem(LS_CATEGORIES);
  
  if (localData) {
    return JSON.parse(localData);
  }

  if (isFirebaseAvailable()) {
    try {
      const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      
      if (items.length > 0) {
        localStorage.setItem(LS_CATEGORIES, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Firebase fetch failed", e);
    }
  }

  // Seed defaults
  const seededCats = defaultCategories.map((name, i) => ({
    id: `cat_${i}`,
    name,
    description: "Standard Category",
    sortOrder: i
  }));
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(seededCats));
  return seededCats;
};

export const dbSaveCategory = async (category: Omit<Category, "id">, id?: string): Promise<void> => {
  const categories = await dbGetCategories();
  
  if (id) {
    const updated = categories.map(c => c.id === id ? { ...c, ...category } : c);
    localStorage.setItem(LS_CATEGORIES, JSON.stringify(updated));
    
    if (isFirebaseAvailable()) {
      try { await updateDoc(doc(db, "categories", id), category); } catch (e) {}
    }
  } else {
    const newCat = { ...category, id: `cat_${Date.now()}` };
    const updated = [...categories, newCat];
    localStorage.setItem(LS_CATEGORIES, JSON.stringify(updated));
    
    if (isFirebaseAvailable()) {
      try { await addDoc(collection(db, "categories"), category); } catch (e) {}
    }
  }
};

export const dbDeleteCategory = async (id: string): Promise<void> => {
  const categories = await dbGetCategories();
  const updated = categories.filter(c => c.id !== id);
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(updated));
  
  if (isFirebaseAvailable()) {
    try { await deleteDoc(doc(db, "categories", id)); } catch (e) {}
  }
};

// --- SETTINGS SERVICE ---

const LS_SETTINGS = "disha_settings";

export const dbGetSettings = async (): Promise<any> => {
  const localData = localStorage.getItem(LS_SETTINGS);
  if (localData) {
    return JSON.parse(localData);
  }
  
  if (isFirebaseAvailable()) {
    try {
      const docRef = doc(db, "settings", "dishaTraders");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(LS_SETTINGS, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  return null; // Let the component use its default config
};

export const dbSaveSettings = async (settings: any): Promise<void> => {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  
  if (isFirebaseAvailable()) {
    try {
      // Use setDoc with merge to create or update the document
      await setDoc(doc(db, "settings", "dishaTraders"), settings, { merge: true });
    } catch (e) { 
      // Silent fail on firebase is okay for prototype 
      console.warn("Firebase settings save failed", e);
    }
  }
};

// --- BLOGS SERVICE ---

export const dbGetBlogs = async (): Promise<Blog[]> => {
  const localData = localStorage.getItem(LS_BLOGS);
  
  if (localData) {
    return JSON.parse(localData);
  }

  if (isFirebaseAvailable()) {
    try {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
      
      if (items.length > 0) {
        localStorage.setItem(LS_BLOGS, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Firebase fetch failed", e);
    }
  }

  // Seed with default blog from requirements
  const seededBlogs: Blog[] = [
    {
      "id": "1",
      "title": "How Village Women Power Disha Brooms Manufacturing",
      "date": "2025-01-20",
      "author": "Priya Sharma",
      "category": "Women Power",
      "readTime": "6 min read",
      "sections": [
        {
          "type": "text",
          "content": "In the heart of Tamil Nadu's rural districts, a quiet revolution is taking place. It's not led by tech giants or industrial moguls, but by the steady hands of local women who have turned the traditional art of broom making into a powerhouse of economic independence."
        },
        {
          "type": "text",
          "content": "At Disha Traders, over 70% of our workforce consists of women from neighboring villages. For many, this isn't just a job—it's their first step towards financial autonomy. 'Before joining Disha, I relied entirely on my husband's seasonal income,' says Lakshmi, a senior artisan who has been with us for five years. 'Now, I pay for my children's school fees and even save a little every month.'"
        },
        {
          "type": "youtube",
          "videoId": "9I6GgmNUyXU"
        },
        {
          "type": "text",
          "content": "The process itself is a blend of age-old wisdom and modern efficiency. The women don't just assemble brooms; they select the grass, treat the handles, and ensure every knot is secure. This attention to detail is what makes a Disha Broom last three times longer than a standard market broom."
        }
      ]
    },
    {
      "id": "2",
      "title": "The Hidden Science Behind a Perfect Grass Broom",
      "date": "2025-01-18",
      "author": "Technical Team",
      "category": "Manufacturing",
      "readTime": "4 min read",
      "sections": [
        {
          "type": "text",
          "content": "Not all grass is created equal. The secret to a broom that sweeps dust without shedding lies in the selection of the raw material. At Disha, we source specific 'Garo Hill' grass varieties that offer the perfect balance of flexibility and stiffness."
        },
        {
          "type": "text",
          "content": "Our manufacturing process involves a unique 'double-binding' technique. Unlike cheap plastic bindings that loosen over time, our traditional wire and nylon combination ensures that the bristles stay intact even after months of vigorous use."
        }
      ]
    },
    {
      "id": "3",
      "title": "Sustainability in Cleaning: Why Natural Materials Matter",
      "date": "2025-01-15",
      "author": "Anjali Rao",
      "category": "Sustainability",
      "readTime": "5 min read",
      "sections": [
        {
          "type": "text",
          "content": "In a world drowning in plastic, the humble natural broom is a hero. Every plastic broom ever made still exists somewhere on this planet, slowly breaking down into microplastics. A grass or coco broom, however, returns to the earth."
        },
        {
          "type": "text",
          "content": "We've calculated that by choosing a natural Disha broom over a synthetic alternative, an average household prevents approximately 2kg of plastic waste from entering landfills every year. It's a small switch with a massive impact."
        }
      ]
    },
    {
      "id": "4",
      "title": "From Coconut Husk to Floor Cleaner: The Coir Journey",
      "date": "2025-01-10",
      "author": "Factory Lead",
      "category": "Product Stories",
      "readTime": "7 min read",
      "sections": [
        {
          "type": "text",
          "content": "Coir is one of nature's miracle fibers. Extracted from the husk of coconuts, it is naturally resistant to rot, mold, and moisture—making it the ideal material for heavy-duty cleaning."
        },
        {
          "type": "text",
          "content": "Our Coir Brooms go through a rigorous 5-step process: Retting, Beating, Drying, Grading, and Binding. We ensure that only the toughest fibers make it into our heavy-duty brooms, perfect for rough outdoor surfaces and wet areas."
        }
      ]
    },
     {
      "id": "5",
      "title": "Meet the Artisans: A Day in the Life of our Factory",
      "date": "2025-01-05",
      "author": "Disha Team",
      "category": "Factory Life",
      "readTime": "8 min read",
      "sections": [
        {
          "type": "text",
          "content": "The day begins at 8 AM with a prayer and a cup of tea. By 8:30, the factory floor is a symphony of rhythmic sounds—the swish of grass being sorted, the click of binding machines, and the chatter of a community working together."
        },
        {
          "type": "youtube",
          "videoId": "9I6GgmNUyXU"
        },
         {
          "type": "text",
          "content": "We believe a happy workplace creates better products. That's why our factory is designed with ample natural light, ventilation, and rest areas. We invite you to take a virtual tour of where your cleaning tools come from."
        }
      ]
    }
  ];
  localStorage.setItem(LS_BLOGS, JSON.stringify(seededBlogs));
  return seededBlogs;
};

export const dbGetBlogById = async (id: string): Promise<Blog | undefined> => {
  const blogs = await dbGetBlogs();
  return blogs.find(b => b.id === id);
};

export const dbSaveBlog = async (blog: Omit<Blog, "id">, id?: string): Promise<void> => {
  const blogs = await dbGetBlogs();
  
  if (id) {
    const updated = blogs.map(b => b.id === id ? { ...b, ...blog } : b);
    localStorage.setItem(LS_BLOGS, JSON.stringify(updated));
    
    if (isFirebaseAvailable()) {
      try { await updateDoc(doc(db, "blogs", id), blog); } catch (e) {}
    }
  } else {
    const newBlog = { ...blog, id: `blog_${Date.now()}` };
    const updated = [newBlog, ...blogs]; // Newest first
    localStorage.setItem(LS_BLOGS, JSON.stringify(updated));
    
    if (isFirebaseAvailable()) {
      try { await addDoc(collection(db, "blogs"), blog); } catch (e) {}
    }
  }
};

export const dbDeleteBlog = async (id: string): Promise<void> => {
  const blogs = await dbGetBlogs();
  const updated = blogs.filter(b => b.id !== id);
  localStorage.setItem(LS_BLOGS, JSON.stringify(updated));
  
  if (isFirebaseAvailable()) {
    try { await deleteDoc(doc(db, "blogs", id)); } catch (e) {}
  }
};
