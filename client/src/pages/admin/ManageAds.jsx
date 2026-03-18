import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X, UploadCloud } from 'lucide-react';

const ManageAds = () => {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const imageUrl = watch('imageUrl');

  const fetchAds = async () => {
    try {
      const { data } = await api.get('/ads/admin');
      setAds(data);
    } catch (error) {
      alert("Error fetching ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({ title: '', imageUrl: '', linkUrl: '', placement: 'home_top', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (ad) => {
    setEditingId(ad._id);
    reset({
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      placement: ad.placement,
      isActive: ad.isActive
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
        await api.put(`/ads/${editingId}`, data);
      } else {
        await api.post('/ads', data);
      }
      closeModal();
      fetchAds();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await api.delete(`/ads/${id}`);
        fetchAds();
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
          <h1 className="text-3xl font-bold text-white mb-2">Advertisements</h1>
          <p className="text-gray-400">Manage banner ads across the platform.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus size={18} /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ads.map(ad => (
          <div key={ad._id} className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${ad.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-white font-bold">{ad.title}</span>
              </div>
              <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 font-mono">{ad.placement.replace('_', ' ').toUpperCase()}</span>
            </div>

            <div className="p-4 flex-grow bg-black/20 flex items-center justify-center relative group min-h-[150px]">
              <img src={ad.imageUrl} alt={ad.title} className="max-h-32 object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all block text-sm">
                  {ad.linkUrl}
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                Status: <span className={ad.isActive ? 'text-green-400' : 'text-red-400'}>{ad.isActive ? 'Active' : 'Draft/Disabled'}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(ad)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(ad._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {ads.length === 0 && (
          <div className="col-span-full text-center py-20 bg-[#121212] rounded-xl border border-white/5 text-gray-500">
            No advertisements found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212] flex-shrink-0">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Internal Title/Name *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Placement Zone *</label>
                <select
                  {...register("placement", { required: "Placement is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                >
                  <option value="home_top">Homepage Top Header</option>
                  <option value="home_middle">Homepage Middle Break</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Link URL *</label>
                <input
                  {...register("linkUrl", { required: "Link is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="https://..."
                />
                {errors.linkUrl && <p className="text-red-400 text-xs mt-1">{errors.linkUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Banner Image URL *</label>
                <div className="flex gap-4">
                  <input
                    {...register("imageUrl", { required: "Image is required" })}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                    <UploadCloud size={20} /> {isUploading ? 'Uploading...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                <p className="text-gray-600 text-xs mt-1.5">📐 Top Header: <span className="text-primary/70">1200 × 300 px</span> · Middle Break: <span className="text-primary/70">600 × 150 px</span> · Max 1MB</p>
                {imageUrl && (
                  <div className="mt-3 bg-black/40 p-2 rounded border border-white/10 flex justify-center">
                    <img src={imageUrl} className="max-h-24 object-contain" />
                  </div>
                )}
                {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" {...register("isActive")} className="sr-only" />
                    <div className="block bg-gray-600 w-10 h-6 rounded-full checkbox-bg transition-colors"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                  </div>
                  <div className="text-white text-sm font-medium">Banner is Active (Visible)</div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                  {editingId ? 'Update' : 'Create'} Banner
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

export default ManageAds;
