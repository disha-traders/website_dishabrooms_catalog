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
          setConfig((prev) => ({ ...prev, ...savedSettings }));
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
