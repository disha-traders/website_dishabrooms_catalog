import { useState, useEffect } from "react";
import { config as defaultConfig } from "@/lib/config";
import { dbGetSettings } from "@/lib/db-service";

export function useConfig() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedSettings = await dbGetSettings();
        if (savedSettings) {
          // Merge saved settings
          const mergedConfig = { ...defaultConfig, ...savedSettings };
          
          // Ensure whatsappLink is synced with contact.whatsapp
          if (mergedConfig.contact?.whatsapp) {
             // Remove any non-numeric characters except the country code which is usually implied
             // If they enter +91 98765 43210 -> 919876543210
             // If they enter 9876543210 (without country code), we assume 91 or use as is (better to use as is or prepend if needed, but let's just strip)
             const cleanNumber = mergedConfig.contact.whatsapp.replace(/[^0-9]/g, "");
             
             mergedConfig.social = {
               ...mergedConfig.social,
               whatsappLink: `https://wa.me/${cleanNumber}`
             };
          }
          
          setConfig(mergedConfig);
        }
      } catch (error) {
        console.warn("Error loading settings:", error);
      }
    };

    loadConfig();
    
    // Optional: Listen for local storage changes to sync across tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "disha_settings") {
        loadConfig();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return config;
}
