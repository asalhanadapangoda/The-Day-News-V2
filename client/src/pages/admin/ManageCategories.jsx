import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    reset({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    reset({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, data);
      } else {
        await api.post('/categories', data);
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
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
          <h1 className="text-3xl font-bold text-white mb-2">Manage Categories</h1>
          <p className="text-gray-400">Classifications for Articles.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a] text-gray-400 text-sm uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-400 text-sm truncate max-w-xs">{cat.description}</td>
                <td className="px-6 py-4 flex justify-end gap-3 text-right">
                  <button onClick={() => openEditModal(cat)} className="text-primary hover:text-white p-2 bg-primary/10 rounded-lg transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-white p-2 bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#121212]">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Category Name</label>
                <input 
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="e.g. World News"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description (Optional)</label>
                <textarea 
                  {...register("description")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-primary focus:outline-none resize-none"
                  rows="3"
                  placeholder="Brief description of this category..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors">
                  {editingId ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
