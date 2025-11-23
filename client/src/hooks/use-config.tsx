import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { config as defaultConfig } from "@/lib/config";

export function useConfig() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    // Guard against missing firebase config to prevent crashes in dev
    if (!db) return;

    try {
      const unsub = onSnapshot(doc(db, "settings", "dishaTraders"), (doc) => {
        if (doc.exists()) {
          // Merge with default to ensure all fields exist
          setConfig((prev) => ({ ...prev, ...doc.data() } as any));
        }
      });
      return () => unsub();
    } catch (error) {
      console.warn("Error connecting to Firebase settings:", error);
    }
  }, []);

  return config;
}
