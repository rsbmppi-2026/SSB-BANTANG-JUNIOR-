import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon,
  Image as ImageIcon,
  Save,
  Trash2,
  CheckCircle2,
  Palette,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import Layout from '../components/ui/Layout';
import { useSettings } from '../App';
import { uploadFile } from '../lib/supabase';

export default function Settings() {
  const { appName, setAppName, logoUrl, setLogoUrl, heroBgUrl, setHeroBgUrl } = useSettings();
  
  const [localAppName, setLocalAppName] = useState(appName);
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl || '');
  const [localHeroBgUrl, setLocalHeroBgUrl] = useState(heroBgUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setAppName(localAppName);
    setLogoUrl(localLogoUrl || null);
    setHeroBgUrl(localHeroBgUrl || null);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setLocalAppName('SSB BANTANG JUNIOR');
    setLocalLogoUrl('https://storage.googleapis.com/aistudio-yeti-pre-prod-user-assets/q2q3jltn5bcm-IMG_20250218_065922.png');
    setLocalHeroBgUrl('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2693');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingLogo(true);
      try {
        const publicUrl = await uploadFile(file, 'settings');
        if (publicUrl) {
          setLocalLogoUrl(publicUrl);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setLocalLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleHeroBgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingHero(true);
      try {
        const publicUrl = await uploadFile(file, 'settings');
        if (publicUrl) {
          setLocalHeroBgUrl(publicUrl);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploadingHero(false);
      }
    }
  };

  const handleRemoveHeroBg = () => {
    setLocalHeroBgUrl('');
    if (heroBgInputRef.current) {
      heroBgInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-glow uppercase tracking-tight flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-[var(--color-primary)]" />
              PENGATURAN APLIKASI
            </h1>
            <p className="text-white/40 text-sm mt-2">Atur identitas akademi dan tampilan aplikasi</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
             >
                <Trash2 className="w-4 h-4" /> Reset Default
             </button>
             <button 
                onClick={handleSave}
                className="glow-button !py-2 flex items-center gap-2"
             >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Save className="w-4 h-4 text-black" />}
                {isSaved ? 'Tersimpan' : 'Simpan Perubahan'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identitas Aplikasi */}
          <div className="space-y-6">
             <h3 className="text-xs font-black uppercase text-[var(--color-primary)] tracking-[0.3em] flex items-center gap-3">
                <Palette className="w-4 h-4" /> IDENTITAS AKADEMI <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent" />
             </h3>

             <div className="glass-card p-6 space-y-6">
                {/* Nama Aplikasi */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Nama Akademi</label>
                   <input
                     type="text"
                     value={localAppName}
                     onChange={(e) => setLocalAppName(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all font-display font-bold text-lg"
                     placeholder="SSB BANTANG JUNIOR"
                   />
                </div>

                {/* Logo Upload */}
                <div className="space-y-3">
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Logo Akademi</label>
                   
                   <div className="flex items-center gap-4">
                     <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                       {isUploadingLogo && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                           <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                         </div>
                       )}
                       {localLogoUrl ? (
                         <img src={localLogoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                       ) : (
                         <ImageIcon className="w-8 h-8 text-white/20" />
                       )}
                     </div>
                     
                     <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label 
                          htmlFor="logo-upload"
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 w-fit"
                        >
                           <Upload className="w-3.5 h-3.5" /> Upload Logo
                        </label>
                        {localLogoUrl && (
                          <button 
                            onClick={handleRemoveLogo}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 w-fit"
                          >
                             <X className="w-3.5 h-3.5" /> Hapus Logo
                          </button>
                        )}
                     </div>
                   </div>
                   <p className="text-[10px] text-white/30 tracking-wide mt-2">
                      Upload gambar logo resolusi tinggi (PNG/JPG transparan direkomendasikan).
                   </p>
                </div>

                {/* Hero Background Upload */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                   <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Background Hero (Landing Page)</label>
                   
                   <div className="space-y-4">
                     <div className="w-full h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                       {isUploadingHero && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                           <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                         </div>
                       )}
                       {localHeroBgUrl ? (
                         <img src={localHeroBgUrl} alt="Hero BG" className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-8 h-8 text-white/20" />
                            <span className="text-[10px] text-white/30 font-bold">TIDAK ADA BACKGROUND</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroBgChange}
                            ref={heroBgInputRef}
                            className="hidden"
                            id="hero-bg-upload"
                          />
                          <label 
                            htmlFor="hero-bg-upload"
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer transition-colors"
                            title="Upload Background"
                          >
                             <Upload className="w-5 h-5 text-white" />
                          </label>
                          {localHeroBgUrl && (
                            <button 
                              onClick={handleRemoveHeroBg}
                              className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-lg transition-colors"
                              title="Hapus Background"
                            >
                               <X className="w-5 h-5 text-white" />
                            </button>
                          )}
                       </div>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] text-white/30 tracking-wide max-w-[200px]">
                           Upload gambar lanskap untuk background Landing Page.
                        </p>
                        <label 
                          htmlFor="hero-bg-upload"
                          className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest cursor-pointer hover:underline"
                        >
                           Ganti Gambar
                        </label>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
             <h3 className="text-xs font-black uppercase text-[var(--color-primary)] tracking-[0.3em] flex items-center gap-3">
                PREVIEW <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent" />
             </h3>

             <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] to-[#172554]/20" />
                
                <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                   <div className={`w-32 h-32 rounded-3xl flex items-center justify-center overflow-hidden ${localLogoUrl ? '' : 'bg-[var(--color-primary)] shadow-[0_0_30px_var(--color-primary-glow)]'}`}>
                      {localLogoUrl ? (
                        <img src={localLogoUrl} alt="Logo Preview" className="w-full h-full object-contain drop-shadow-2xl" />
                      ) : (
                        <span className="text-black font-black text-4xl">{localAppName.charAt(0) || 'B'}</span>
                      )}
                   </div>
                   <div>
                     <h2 className="text-2xl font-display font-bold text-[var(--color-primary)]">{localAppName || 'Menu'}</h2>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-2">Academy Management</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
