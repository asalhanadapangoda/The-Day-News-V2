import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X, UploadCloud, Users } from 'lucide-react';

const ManageTeam = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const photoUrl = watch('photoUrl');

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/team');
      setMembers(data);
    } catch (error) {
      alert('Error fetching team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({ name: '', role: '', bio: '', photoUrl: '', linkedinUrl: '', order: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    reset({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photoUrl: member.photoUrl,
      linkedinUrl: member.linkedinUrl || '',
      order: member.order || 0,
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
      setValue('photoUrl', data.url);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/team/${editingId}`, data);
      } else {
        await api.post('/team', data);
      }
      closeModal();
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this team member?')) {
      try {
        await api.delete(`/team/${id}`);
        fetchMembers();
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
          <h1 className="text-3xl font-bold text-white mb-2">Our Team</h1>
          <p className="text-gray-400">Manage team members displayed on the About page.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map(member => (
          <div key={member._id} className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all flex flex-col group">
            <div className="h-52 relative overflow-hidden bg-[#1a1a1a]">
              <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wider">{member.role}</p>
              {member.bio && <p className="text-gray-400 text-sm line-clamp-3 flex-grow">{member.bio}</p>}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <span className="text-gray-600 text-xs font-mono">Order: {member.order}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(member)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(member._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <div className="col-span-full text-center py-24 bg-[#121212] rounded-2xl border border-white/5 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-lg">No team members yet. Add your first one!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212]">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Member' : 'Add Team Member'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. Kasun Perera"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role / Title *</label>
                <input
                  {...register('role', { required: 'Role is required' })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. Editor in Chief"
                />
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Short Bio</label>
                <textarea
                  {...register('bio')}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none resize-none"
                  rows="3"
                  placeholder="A brief description about this team member..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Photo *</label>
                <div className="flex gap-3">
                  <input
                    {...register('photoUrl', { required: 'Photo is required' })}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/10 transition-colors">
                    <UploadCloud size={18} /> {isUploading ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                <p className="text-gray-600 text-xs mt-1.5">📐 Recommended: <span className="text-primary/70">400 × 500 px</span> (portrait) · Clear face photo · Max 1MB · JPG or PNG</p>
                {photoUrl && (
                  <div className="mt-3 w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={photoUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                {errors.photoUrl && <p className="text-red-400 text-xs mt-1">{errors.photoUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
                <input
                  {...register('linkedinUrl')}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                <input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="0"
                />
                <p className="text-gray-600 text-xs mt-1">Lower numbers appear first.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                  {editingId ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
