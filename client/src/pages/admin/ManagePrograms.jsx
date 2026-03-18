import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X, UploadCloud, Star } from 'lucide-react';

const ManagePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const coverImageUrl = watch('coverImage');
  const posterImageUrl = watch('posterImage');

  const fetchPrograms = async () => {
    try {
      const { data } = await api.get('/programs');
      setPrograms(data);
    } catch (error) {
      alert('Error fetching programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({ title: '', description: '', coverImage: '', posterImage: '', isFeatured: false });
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingId(prog._id);
    reset({
      title: prog.title,
      description: prog.description,
      coverImage: prog.coverImage,
      posterImage: prog.posterImage || '',
      isFeatured: prog.isFeatured,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValue(field, data.url);
    } catch (error) {
      alert('File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/programs/${editingId}`, data);
      } else {
        await api.post('/programs', data);
      }
      closeModal();
      fetchPrograms();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this program? This does NOT delete its episodes automatically.')) {
      try {
        await api.delete(`/programs/${id}`);
        fetchPrograms();
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
          <h1 className="text-3xl font-bold text-white mb-2">Manage Programs</h1>
          <p className="text-gray-400">Master shows and broadcast events.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus size={18} /> Add Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programs.map((prog) => (
          <div key={prog._id} className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors flex flex-col relative">
            {prog.isFeatured && (
              <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                <Star size={10} className="fill-black" /> Featured
              </div>
            )}
            <div className="h-40 relative">
              <img src={prog.coverImage} alt={prog.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">{prog.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{prog.description}</p>
              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-white/5">
                <button onClick={() => openEditModal(prog)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(prog._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-white/5 text-gray-500">
          No programs found. Click 'Add Program' to create one.
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212] flex-shrink-0">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Program' : 'New Program'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Program Title *</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none resize-none"
                    rows="3"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Cover Banner Image URL *</label>
                  <div className="flex gap-4">
                    <input
                      {...register('coverImage', { required: 'Cover image is required' })}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                      placeholder="https://..."
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                      <UploadCloud size={20} /> {isUploading ? 'Uploading...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverImage')} disabled={isUploading} />
                    </label>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">Recommended: <span className="text-primary/70">1280 x 480 px</span> (landscape) · Max 2MB · JPG or PNG</p>
                  {coverImageUrl && (
                    <div className="mt-3 h-32 w-full rounded border border-white/10 overflow-hidden relative">
                      <img src={coverImageUrl} className="w-full h-full object-cover" alt="Cover preview" />
                    </div>
                  )}
                  {errors.coverImage && <p className="text-red-400 text-xs mt-1">{errors.coverImage.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Homepage Poster Image <span className="text-primary text-xs font-normal">(Portrait photo shown on homepage)</span></label>
                  <div className="flex gap-4">
                    <input
                      {...register('posterImage')}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                      placeholder="https://..."
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                      <UploadCloud size={20} /> {isUploading ? 'Uploading...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'posterImage')} disabled={isUploading} />
                    </label>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">Recommended: <span className="text-primary/70">600 x 900 px</span> (portrait 2:3) · Max 2MB · JPG or PNG</p>
                  {posterImageUrl && (
                    <div className="mt-3 w-32 h-48 rounded-lg border border-white/10 overflow-hidden relative">
                      <img src={posterImageUrl} className="w-full h-full object-cover" alt="Poster Preview" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" {...register('isFeatured')} className="sr-only" />
                      <div className="block bg-gray-600 w-10 h-6 rounded-full checkbox-bg transition-colors"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                    </div>
                    <div className="text-white text-sm font-medium">Feature this program on the Homepage</div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                  {editingId ? 'Update' : 'Create'} Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        input:checked ~ .checkbox-bg {
          background-color: var(--color-primary);
        }
        input:checked ~ .dot {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default ManagePrograms;
