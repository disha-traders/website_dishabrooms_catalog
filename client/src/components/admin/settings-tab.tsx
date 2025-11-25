import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useConfig } from "@/hooks/use-config";
import { Loader2, Save, CheckCircle, AlertCircle, Plus, X, MapPin, Database } from "lucide-react";
import { dbSaveSettings } from "@/lib/db-service";

export function SettingsTab() {
  const liveConfig = useConfig();
  const [localConfig, setLocalConfig] = useState(liveConfig);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [newBranch, setNewBranch] = useState("");

  // Sync config when loaded
  useEffect(() => {
    setLocalConfig(liveConfig);
  }, [liveConfig]);

  const handleAddBranch = () => {
    if (!newBranch.trim()) return;
    
    const currentBranches = localConfig.branches || [];
    setLocalConfig({
      ...localConfig,
      branches: [...currentBranches, newBranch.trim()]
    });
    setNewBranch("");
  };

  const handleRemoveBranch = (indexToRemove: number) => {
    const currentBranches = localConfig.branches || [];
    setLocalConfig({
      ...localConfig,
      branches: currentBranches.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setStatus({ type: null, message: '' });
    
    try {
      await dbSaveSettings(localConfig);
      setStatus({ type: 'success', message: "Settings saved successfully!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch (e) {
      console.error("Error saving settings", e);
      const msg = (e as Error).message || "Failed to save settings.";
      setStatus({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
      <CardHeader className="bg-white border-b px-6 py-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-[#002147]">General Information</CardTitle>
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
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Brand Name</Label>
            <Input 
              value={localConfig.brandName} 
              onChange={(e) => setLocalConfig({...localConfig, brandName: e.target.value})}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Phone Number</Label>
            <Input 
               value={localConfig.contact.phone}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, phone: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">WhatsApp Number</Label>
            <Input 
               value={localConfig.contact.whatsapp}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, whatsapp: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
               placeholder="919876543210"
            />
            <p className="text-xs text-gray-400">Enter full number with country code (e.g. 919876543210). No spaces or + symbol.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Email Address</Label>
            <Input 
               value={localConfig.contact.email}
               onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, email: e.target.value}})}
               className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-600 font-medium">Business Address</Label>
          <Textarea 
             value={localConfig.contact.address}
             onChange={(e) => setLocalConfig({...localConfig, contact: {...localConfig.contact, address: e.target.value}})}
             className="bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[100px] focus:border-[#00A896]"
          />
        </div>

        {/* Branches Management */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-gray-600 font-medium block">Branch Locations</Label>
          <div className="flex gap-2">
            <Input 
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              placeholder="Add a branch city (e.g. Chennai)"
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
              onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
            />
            <Button 
              onClick={handleAddBranch}
              type="button"
              className="bg-[#00A896] hover:bg-[#008C7D] text-white shrink-0"
            >
              <Plus size={18} /> Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {localConfig.branches && localConfig.branches.length > 0 ? (
              localConfig.branches.map((branch: string, index: number) => (
                <div key={index} className="flex items-center gap-1 bg-blue-50 text-[#002147] px-3 py-1.5 rounded-lg border border-blue-100 text-sm font-medium group">
                  <MapPin size={14} className="text-[#00A896]" />
                  {branch}
                  <button 
                    onClick={() => handleRemoveBranch(index)}
                    className="ml-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No branches added yet.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Hero Title</Label>
              <Input 
                value={localConfig.hero?.title || ""}
                onChange={(e) => setLocalConfig({...localConfig, hero: { ...localConfig.hero, title: e.target.value }})} 
                placeholder="e.g. Premium Cleaning Solutions"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Hero Subtitle</Label>
              <Input 
                value={localConfig.hero?.subtitle || ""}
                onChange={(e) => setLocalConfig({...localConfig, hero: { ...localConfig.hero, subtitle: e.target.value }})}
                placeholder="e.g. Quality brooms and mops for every home"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
              />
            </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-gray-600 font-medium block">Social Media Links</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                Facebook Link
              </Label>
              <Input 
                value={localConfig.social?.facebookLink || ""}
                onChange={(e) => setLocalConfig({
                  ...localConfig, 
                  social: {...localConfig.social, facebookLink: e.target.value}
                })}
                placeholder="https://www.facebook.com/dishatraders"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
                data-testid="input-facebook-link"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm0 2C5.7 4 4 5.7 4 7.8v8.4c0 2.1 1.7 3.8 3.8 3.8h8.4c2.1 0 3.8-1.7 3.8-3.8V7.8c0-2.1-1.7-3.8-3.8-3.8H7.8zm8.5 3c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-4.3 2c2.9 0 5.3 2.4 5.3 5.3s-2.4 5.3-5.3 5.3-5.3-2.4-5.3-5.3 2.4-5.3 5.3-5.3zm0 2c-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3-1.5-3.3-3.3-3.3z" /></svg>
                Instagram Link
              </Label>
              <Input 
                value={localConfig.social?.instagramLink || ""}
                onChange={(e) => setLocalConfig({
                  ...localConfig, 
                  social: {...localConfig.social, instagramLink: e.target.value}
                })}
                placeholder="https://www.instagram.com/dishatraders"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
                data-testid="input-instagram-link"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 6.4c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4l-1.2 4.4 4.5-1.2c1.2.7 2.5 1 3.9 1 4.4 0 8-3.6 8-8 0-2.1-.8-4.1-2.3-5.6zm-5.6 13.5c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.5.6.6-2.4-.2-.2c-.7-1.1-1-2.3-1-3.6 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.8 2s2 3 2 4.8c0 3.7-3 6.7-6.7 6.7z"/><path d="M12.5 9.5c-.3 0-.6.2-.7.5-.1.3.1.6.4.7.8.3 1.4.9 1.7 1.7.1.3.4.5.7.4.3-.1.5-.4.4-.7-.4-1.1-1.2-2-2.2-2.4-.1-.1-.2-.1-.3-.1z" /></svg>
                WhatsApp Link
              </Label>
              <Input 
                value={localConfig.social?.whatsappLink || ""}
                onChange={(e) => setLocalConfig({
                  ...localConfig, 
                  social: {...localConfig.social, whatsappLink: e.target.value}
                })}
                placeholder="https://wa.me/919876543210"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
                data-testid="input-whatsapp-link"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
                LinkedIn Link
              </Label>
              <Input 
                value={localConfig.social?.linkedinLink || ""}
                onChange={(e) => setLocalConfig({
                  ...localConfig, 
                  social: {...localConfig.social, linkedinLink: e.target.value}
                })}
                placeholder="https://www.linkedin.com/company/dishatraders"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
                data-testid="input-linkedin-link"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium text-sm flex items-center gap-2">
                <div className="w-5 h-5 rounded text-white text-xs flex items-center justify-center font-bold" style={{background: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)'}}>A</div>
                Aratai Messenger Link
              </Label>
              <Input 
                value={localConfig.social?.arataiLink || ""}
                onChange={(e) => setLocalConfig({
                  ...localConfig, 
                  social: {...localConfig.social, arataiLink: e.target.value}
                })}
                placeholder="https://www.aratai.app/dishatraders"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors focus:border-[#00A896]"
                data-testid="input-aratai-link"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving} 
            className="bg-[#002147] hover:bg-[#003366] text-white gap-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FirebaseSetupGuide() {
  return (
    <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-blue-50/50 mt-8 border border-blue-100">
      <CardHeader className="px-6 py-4 border-b border-blue-100">
        <CardTitle className="text-lg text-[#002147] flex items-center gap-2">
          <Database size={18} className="text-[#00A896]" />
          Firebase Setup Guide (Free Tier)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4 text-sm text-gray-700">
        <div className="space-y-2">
          <p className="font-semibold text-[#002147]">Step 1: Create Database</p>
          <p>Go to <a href="https://console.firebase.google.com" target="_blank" className="text-blue-600 hover:underline">Firebase Console</a> &gt; Build &gt; <strong>Firestore Database</strong>.</p>
          <div className="bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100 text-xs">
            <strong>Important:</strong> Do NOT click on "Storage". We only use "Firestore Database".
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-[#002147]">Step 2: Select Free Plan</p>
          <p>Click "Create Database". Select <strong>Start in Test Mode</strong> (easiest) or Production Mode.</p>
          <p>Choose a location (e.g., <code>nam5 (us-central)</code>). This is free.</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-[#002147]">Step 3: Get Config</p>
          <p>Go to Project Settings &gt; General &gt; "Your apps" &gt; SDK Setup and Configuration.</p>
          <p>Copy the <code>firebaseConfig</code> object and paste it into your code.</p>
        </div>
      </CardContent>
    </Card>
  );
}
