import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X, UploadCloud, Search } from 'lucide-react';
import { format } from 'date-fns';

const ManageEpisodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Filters
  const [filterProgram, setFilterProgram] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const thumbnailImageUrl = watch('thumbnailImage');

  const fetchData = async () => {
    try {
      const [epsRes, progsRes] = await Promise.all([
        api.get('/episodes'),
        api.get('/programs')
      ]);
      setEpisodes(epsRes.data);
      setPrograms(progsRes.data);
    } catch (error) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({
      title: '',
      description: '',
      thumbnailImage: '',
      videoUrl: '',
      program: filterProgram || (programs.length > 0 ? programs[0]._id : '')
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ep) => {
    setEditingId(ep._id);
    reset({
      title: ep.title,
      description: ep.description,
      thumbnailImage: ep.thumbnailImage,
      videoUrl: ep.videoUrl,
      program: ep.program?._id || ''
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
      setValue('thumbnailImage', data.url);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/episodes/${editingId}`, data);
      } else {
        await api.post('/episodes', data);
      }
      closeModal();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this episode definitively?")) {
      try {
        await api.delete(`/episodes/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const filteredEpisodes = episodes.filter(ep => {
    const matchProgram = filterProgram ? ep.program?._id === filterProgram : true;
    const matchSearch = ep.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProgram && matchSearch;
  });

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Episodes</h1>
          <p className="text-gray-400">Video content linked to Programs.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium whitespace-nowrap">
          <Plus size={18} /> Add Episode
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#121212] border border-white/5 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between h-auto">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-primary [&>option]:bg-[#1a1a1a]"
          >
            <option value="">All Programs</option>
            {programs.map(p => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEpisodes.map(ep => (
          <div key={ep._id} className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors flex flex-col">
            <div className="h-40 relative">
              <img src={ep.thumbnailImage} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-primary/90 text-[10px] font-bold uppercase px-2 py-1 rounded text-white truncate max-w-[80%]">
                {ep.program?.title || 'Unknown'}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1" title={ep.title}>{ep.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{ep.description}</p>
              <div className="text-xs text-gray-500 mb-4 font-mono">
                {format(new Date(ep.publishDate), 'MMM dd, yyyy HH:mm')}
              </div>

              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-white/5">
                <button onClick={() => openEditModal(ep)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(ep._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-white/5 text-gray-500">
          No episodes found matching your criteria.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212] flex-shrink-0">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Episode' : 'New Episode'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Episode Title *</label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Belongs to Program *</label>
                  <select
                    {...register("program", { required: "Program is required" })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none [&>option]:bg-[#1a1a1a]"
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                  {errors.program && <p className="text-red-400 text-xs mt-1">{errors.program.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    {...register("description")}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none resize-none"
                    rows="3"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Video Embed URL (YouTube/MP4) *</label>
                  <input
                    {...register("videoUrl", { required: "Video URL is required" })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.videoUrl && <p className="text-red-400 text-xs mt-1">{errors.videoUrl.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Thumbnail/Cover Image URL *</label>
                  <div className="flex gap-4">
                    <input
                      {...register("thumbnailImage", { required: "Image is required" })}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                      placeholder="https://..."
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                      <UploadCloud size={20} /> {isUploading ? 'Uploading...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">📐 Recommended: <span className="text-primary/70">1280 × 720 px</span> (16:9 landscape) · Max 2MB · JPG or PNG</p>
                  {thumbnailImageUrl && (
                    <div className="mt-3 h-32 w-48 rounded border border-white/10 overflow-hidden relative">
                      <img src={thumbnailImageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {errors.thumbnailImage && <p className="text-red-400 text-xs mt-1">{errors.thumbnailImage.message}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                  {editingId ? 'Update' : 'Create'} Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEpisodes;
