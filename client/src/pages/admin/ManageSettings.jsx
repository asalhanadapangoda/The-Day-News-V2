import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Save, UploadCloud, Globe, Phone, MapPin, Mail, Hash } from 'lucide-react';

const ManageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        // Because fields might be nested like socialLinks.facebook, we flatten them for react-hook-form or set them via reset object
        reset({
          siteName: data.siteName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          contactAddress: data.contactAddress || '',
          footerText: data.footerText || '',
          aboutUsText: data.aboutUsText || '',
          socialLinks_facebook: data.socialLinks?.facebook || '',
          socialLinks_linkedin: data.socialLinks?.linkedin || '',
          socialLinks_instagram: data.socialLinks?.instagram || '',
          socialLinks_youtube: data.socialLinks?.youtube || '',
        });
      } catch (error) {
        console.error("Error fetching settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (formData) => {
    setIsSaving(true);
    setSaveStatus(null);
    
    // Un-flatten social links
    const dataToSend = {
      siteName: formData.siteName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      contactAddress: formData.contactAddress,
      footerText: formData.footerText,
      aboutUsText: formData.aboutUsText,
      socialLinks: {
        facebook: formData.socialLinks_facebook,
        linkedin: formData.socialLinks_linkedin,
        instagram: formData.socialLinks_instagram,
        youtube: formData.socialLinks_youtube,
      }
    };

    try {
      await api.put('/settings', dataToSend);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Global Settings</h1>
          <p className="text-gray-400">Manage site-wide variables, contact info, and hero banner.</p>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          Settings saved successfully! Changes are live on the website.
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          Failed to save settings. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section: Contact & Footer Info */}
        <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#1a1a1a] px-6 py-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-primary" /> Company Information & Contact
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Website Root Title</label>
              <input 
                {...register("siteName")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2"><Mail size={16}/> Contact Email</label>
              <input 
                {...register("contactEmail")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2"><Phone size={16}/> Contact Phone Support</label>
              <input 
                {...register("contactPhone")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Physical Address</label>
              <input 
                {...register("contactAddress")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>



            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Footer Copyright Text</label>
              <input 
                {...register("footerText")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section: Social Media */}
        <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#1a1a1a] px-6 py-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Hash className="text-primary" /> Social Media Links
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Facebook URL</label>
              <input 
                {...register("socialLinks_facebook")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
              <input 
                {...register("socialLinks_linkedin")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Instagram URL</label>
              <input 
                {...register("socialLinks_instagram")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">YouTube URL</label>
              <input 
                {...register("socialLinks_youtube")}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-4 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl flex justify-between items-center shadow-2xl">
          <p className="text-gray-400 text-sm hidden md:block">Double check your inputs before saving publicly.</p>
          <button 
            type="submit" 
            disabled={isSaving || isUploading}
            className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <><Save size={20} /> Deploy Settings</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ManageSettings;
