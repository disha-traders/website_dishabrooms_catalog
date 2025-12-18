import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, setDoc, getDoc } from "firebase/firestore";
import { Product, products as mockProducts, categories as defaultCategories } from "@/lib/products";

// Local Storage Keys
const LS_PRODUCTS = "disha_products";
const LS_CATEGORIES = "disha_categories";
const LS_BLOGS = "disha_blogs";

// Types
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
      "title": "How Disha Brooms Are Made",
      "date": "2025-01-10",
      "author": "Disha Traders",
      "sections": [
        {
          "type": "text",
          "content": "Disha Traders manufactures eco-friendly grass and coir brooms using traditional village methods..."
        },
        {
          "type": "text",
          "content": "Our women-led workforce ensures quality, sustainability, and rural employment."
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
