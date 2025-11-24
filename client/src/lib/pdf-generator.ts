import { jsPDF } from "jspdf";
import { Product } from "./products";

interface Config {
  companyName: string;
  brandName: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
}

// Helper to load image and convert to Base64
const loadImage = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          console.warn("Could not convert image to base64 (CORS?)", url);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn("Failed to load image", url);
      resolve(null);
    };
  });
};

export const generateCatalog = async (products: Product[], config: Config, coverImageUrl: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // --- PAGE 1: COVER PAGE ---
  
  // Background color for cover
  doc.setFillColor(0, 33, 71); // #002147
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Load Cover Image
  const coverImgBase64 = await loadImage(coverImageUrl);
  if (coverImgBase64) {
    try {
      // Centered large image
      const imgWidth = 150;
      const imgHeight = 150;
      const x = (pageWidth - imgWidth) / 2;
      const y = 60;
      doc.addImage(coverImgBase64, "JPEG", x, y, imgWidth, imgHeight);
    } catch (e) {
      console.warn("Error adding cover image", e);
    }
  }

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text(config.brandName.toUpperCase(), pageWidth / 2, 40, { align: "center" });
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("PREMIUM PRODUCT CATALOG", pageWidth / 2, 50, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(config.companyName, pageWidth / 2, pageHeight - 30, { align: "center" });
  doc.text(`Contact: ${config.contact.phone}`, pageWidth / 2, pageHeight - 20, { align: "center" });
  
  // --- PRODUCT PAGES ---
  
  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(p => {
    if (p.isActive !== false) {
      const cat = p.category || "Uncategorized";
      if (!productsByCategory[cat]) productsByCategory[cat] = [];
      productsByCategory[cat].push(p);
    }
  });
  
  // Sort categories alphabetically or by some logic if needed
  const categories = Object.keys(productsByCategory).sort();
  
  for (const category of categories) {
    const categoryProducts = productsByCategory[category];
    
    // Pagination logic for this category
    const itemsPerPage = 6;
    const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
    
    for (let i = 0; i < totalPages; i++) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Header
      doc.setFillColor(0, 168, 150); // #00A896
      doc.rect(0, 0, pageWidth, 25, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(category.toUpperCase(), 15, 17);
      
      // Footer
      doc.setFillColor(240, 244, 248); // Light gray
      doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
      
      doc.setTextColor(0, 33, 71);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const footerText = `${config.companyName} | ${config.contact.phone} | ${config.contact.email}`;
      doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: "center" });
      
      // Products Grid
      const pageProducts = categoryProducts.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
      
      // Grid config
      const startY = 35;
      const colWidth = (pageWidth - 20) / 2; // 2 columns, 10mm margin each side
      const rowHeight = 80;
      const marginX = 10;
      
      // Use a for...of loop to await image loading properly
      for (let j = 0; j < pageProducts.length; j++) {
        const product = pageProducts[j];
        const col = j % 2;
        const row = Math.floor(j / 2);
        
        const x = marginX + (col * colWidth);
        const y = startY + (row * rowHeight);
        
        // Card Border
        doc.setDrawColor(230, 230, 230);
        doc.rect(x + 2, y, colWidth - 4, rowHeight - 5);
        
        // Product Image
        if (product.imageUrl) {
          const imgBase64 = await loadImage(product.imageUrl);
          if (imgBase64) {
             try {
               // Aspect fit logic
               const maxImgW = colWidth - 10;
               const maxImgH = 45;
               const imgX = x + 5;
               const imgY = y + 5;
               doc.addImage(imgBase64, "JPEG", imgX, imgY, maxImgW, maxImgH, undefined, "FAST");
             } catch (e) {
               // Fallback rectangle
               doc.setFillColor(240, 240, 240);
               doc.rect(x + 5, y + 5, colWidth - 10, 45, "F");
             }
          } else {
             doc.setFillColor(240, 240, 240);
             doc.rect(x + 5, y + 5, colWidth - 10, 45, "F");
          }
        }
        
        // Product Details
        const textY = y + 55;
        
        // Code
        doc.setTextColor(0, 168, 150); // Teal
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(product.code, x + 5, textY);
        
        // Name
        doc.setTextColor(0, 33, 71); // Dark Blue
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        const nameLines = doc.splitTextToSize(product.name, colWidth - 10);
        doc.text(nameLines, x + 5, textY + 5);
        
        // Size (if exists)
        if (product.size) {
           doc.setTextColor(100, 100, 100);
           doc.setFontSize(9);
           doc.setFont("helvetica", "normal");
           doc.text(`Size: ${product.size}`, x + 5, textY + 12 + (nameLines.length * 3));
        }
      }
    }
  }
  
  doc.save(`${config.brandName.replace(/\s+/g, "_")}_Catalog.pdf`);
};
