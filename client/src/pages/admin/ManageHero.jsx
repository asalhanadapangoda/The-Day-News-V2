import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X, UploadCloud } from 'lucide-react';

const ManageHero = () => {
  const [heroes, setHeroes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  const imageUrl = watch('imageUrl');

  const fetchHeroes = async () => {
    try {
      const { data } = await api.get('/heroes/admin');
      setHeroes(data);
    } catch (error) {
      alert("Error fetching heroes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({ title: '', subtitle: '', imageUrl: '', linkUrl: '', order: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (hero) => {
    setEditingId(hero._id);
    reset({ 
      title: hero.title, 
      subtitle: hero.subtitle,
      imageUrl: hero.imageUrl, 
      linkUrl: hero.linkUrl, 
      order: hero.order,
      isActive: hero.isActive
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setValue('imageUrl', data.url);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/heroes/${editingId}`, data);
      } else {
        await api.post('/heroes', data);
      }
      closeModal();
      fetchHeroes();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hero slide?")) {
      try {
        await api.delete(`/heroes/${id}`);
        fetchHeroes();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Homepage Hero Sliders</h1>
          <p className="text-gray-400">Manage the rotating featured slider on the homepage.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus size={18} /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {heroes.map(hero => (
          <div key={hero._id} className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${hero.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-white font-bold">{hero.title}</span>
              </div>
              <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 font-mono">ORDER: {hero.order}</span>
            </div>
            
            <div className="p-4 flex-grow bg-black/20 flex items-center justify-center relative group min-h-[150px]">
              <img src={hero.imageUrl} alt={hero.title} className="w-full h-40 object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white font-semibold text-sm mb-2">{hero.subtitle}</p>
                <a href={hero.linkUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all block text-xs">
                  {hero.linkUrl}
                </a>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                Status: <span className={hero.isActive ? 'text-green-400' : 'text-red-400'}>{hero.isActive ? 'Active' : 'Draft'}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(hero)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(hero._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {heroes.length === 0 && (
          <div className="col-span-full text-center py-20 bg-[#121212] rounded-xl border border-white/5 text-gray-500">
            No hero slides found. Add one to appear on the homepage!
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212] flex-shrink-0">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Slide' : 'New Slide'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Headline Title *</label>
                <input 
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle / Description</label>
                <input 
                  {...register("subtitle")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target Link URL</label>
                <input 
                  {...register("linkUrl")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="/programs/slug"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Order (Sort Pos)</label>
                  <input 
                    type="number"
                    {...register("order")}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Background Image URL *</label>
                <div className="flex gap-4">
                  <input 
                    {...register("imageUrl", { required: "Image is required" })}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                    <UploadCloud size={20} /> {isUploading ? 'Uploading...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                <p className="text-gray-600 text-xs mt-1.5">📐 Recommended: <span className="text-primary/70">1920 × 1080 px</span> (landscape) · Max 2MB · JPG or PNG</p>
                {imageUrl && (
                  <div className="mt-3 bg-black/40 p-2 rounded border border-white/10 flex justify-center">
                    <img src={imageUrl} className="max-h-24 object-contain" />
                  </div>
                )}
                {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div className="mt-2 py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" {...register("isActive")} className="sr-only" />
                    <div className="block bg-gray-600 w-10 h-6 rounded-full checkbox-bg transition-colors"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                  </div>
                  <div className="text-white text-sm font-medium">Slide is Active (Visible)</div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                  {editingId ? 'Update' : 'Create'} Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        input:checked ~ .checkbox-bg {
          background-color: #22c55e;
        }
        input:checked ~ .dot {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default ManageHero;
