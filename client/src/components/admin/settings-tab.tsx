import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useConfig } from "@/hooks/use-config";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SettingsTab() {
  const liveConfig = useConfig();
  const [localConfig, setLocalConfig] = useState(liveConfig);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Sync config when loaded
  useEffect(() => {
    setLocalConfig(liveConfig);
  }, [liveConfig]);

  const handleSaveSettings = async () => {
    if (!db) {
      setStatus({ type: 'error', message: "Firebase not connected" });
      return;
    }
    
    setSaving(true);
    setStatus({ type: null, message: '' });
    
    try {
      await setDoc(doc(db, "settings", "dishaTraders"), localConfig, { merge: true });
      setStatus({ type: 'success', message: "Settings saved successfully!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch (e) {
      console.error("Error saving settings", e);
      setStatus({ type: 'error', message: "Failed to save settings. Check console for details." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
      <CardHeader className="bg-white border-b px-6 py-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-brand-cetacean">General Information</CardTitle>
          {status.message && (
            <div className={`text-sm flex items-center gap-2 px-3 py-1 rounded-full ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {status.message}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Company Name</Label>
            <Input 
              value={localConfig.companyName}
              onChange={(e) => setLocalConfig({...localConfig, companyName: e.target.value})} 
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Brand Name</Label>
            <Input 
              value={localConfig.brandName} 
              onChange={(e) => setLocalConfig({...localConfig, brandName: e.target.value})}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Phone Number</Label>
            <Input 
               value={localConfig.contact.phone}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, phone: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">WhatsApp Number</Label>
            <Input 
               value={localConfig.contact.whatsapp}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, whatsapp: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Email Address</Label>
            <Input 
               value={localConfig.contact.email}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, email: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-600 font-medium">Business Address</Label>
          <Textarea 
             value={localConfig.contact.address}
             onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, address: e.target.value}})}
             className="bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Hero Title</Label>
              <Input 
                value={localConfig.hero?.title || ""}
                onChange={(e) => setLocalConfig({...localConfig, hero: { ...localConfig.hero, title: e.target.value }})} 
                placeholder="e.g. Premium Cleaning Solutions"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Hero Subtitle</Label>
              <Input 
                value={localConfig.hero?.subtitle || ""}
                onChange={(e) => setLocalConfig({...localConfig, hero: { ...localConfig.hero, subtitle: e.target.value }})}
                placeholder="e.g. Quality brooms and mops for every home"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving} 
            className="bg-brand-blue hover:bg-blue-700 text-white gap-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
