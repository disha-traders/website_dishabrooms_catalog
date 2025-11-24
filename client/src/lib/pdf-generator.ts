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
  
  const headerHeight = pageHeight * 0.15; // Top 15% for Header (Reduced size)
  const footerHeight = pageHeight * 0.15; // Bottom 15% for Footer
  const contentHeight = pageHeight - headerHeight - footerHeight; // Middle 70% for Image
  
  // 1. Header Section (Top 15%)
  doc.setFillColor(0, 33, 71); // #002147 Dark Blue
  doc.rect(0, 0, pageWidth, headerHeight, "F");
  
  // Header Content Centering
  const headerCenterY = headerHeight / 2;
  
  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28); // Slightly smaller to fit
  doc.setFont("helvetica", "bold");
  // Add slight letter spacing simulation by adding spaces between characters? No, JS PDF doesn't support it easily.
  // We will just center it perfectly.
  doc.text("Disha Traders", pageWidth / 2, headerCenterY - 6, { align: "center" });
  
  // Tagline
  doc.setTextColor(0, 168, 150); // #00A896 Teal
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("All Types of India's Premium Cleaning Brand in one Place", pageWidth / 2, headerCenterY + 4, { align: "center" });
  
  doc.setTextColor(200, 200, 200); // Light Gray
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic"); // Made italic for better style
  doc.text("Direct from Manufacturer", pageWidth / 2, headerCenterY + 10, { align: "center" });

  

  // 2. Image Section (Middle 60%)
  const coverImgBase64 = await loadImage(coverImageUrl);
  if (coverImgBase64) {
    try {
      doc.addImage(coverImgBase64, "JPEG", 0, headerHeight, pageWidth, contentHeight);
    } catch (e) {
      console.warn("Error adding cover image", e);
      // Fallback
      doc.setFillColor(240, 240, 240);
      doc.rect(0, headerHeight, pageWidth, contentHeight, "F");
    }
  } else {
      doc.setFillColor(240, 240, 240);
      doc.rect(0, headerHeight, pageWidth, contentHeight, "F");
  }


  // 3. Footer Section (Bottom 15%)
  const footerY = pageHeight - footerHeight;
  
  doc.setFillColor(0, 33, 71); // #002147 Dark Blue
  doc.rect(0, footerY, pageWidth, footerHeight, "F");
  
  // Footer Content Centering
  const footerCenterY = footerY + (footerHeight / 2);
  
  doc.setTextColor(255, 255, 255);
  
  // Company Name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(config.companyName, pageWidth / 2, footerCenterY - 8, { align: "center" });
  
  // Contact Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Contact: ${config.contact.phone} | ${config.contact.email}`, pageWidth / 2, footerCenterY + 4, { align: "center" });
  doc.text(config.contact.address, pageWidth / 2, footerCenterY + 12, { align: "center" });
  
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
      doc.setFillColor(0, 33, 71); // #002147 (Dark Blue Background as requested)
      doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
      
      doc.setTextColor(255, 255, 255); // White Text
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
