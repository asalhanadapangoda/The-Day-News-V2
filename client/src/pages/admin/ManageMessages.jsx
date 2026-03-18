import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Inbox, Mail, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (error) {
      alert("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this message?")) {
      try {
        await api.delete(`/messages/${id}`);
        fetchMessages();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
          <p className="text-gray-400">Inbound inquiries from the public website.</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map(msg => (
          <div 
            key={msg._id} 
            className={`bg-[#121212] border rounded-xl p-6 transition-all ${
              msg.isRead ? 'border-white/5 opacity-80' : 'border-primary/50 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              
              <div className="flex gap-4 items-start">
                <div className={`mt-1 p-3 rounded-full ${msg.isRead ? 'bg-white/5 text-gray-500' : 'bg-primary/20 text-primary'}`}>
                  {msg.isRead ? <CheckCircle size={20} /> : <Mail size={20} />}
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{msg.subject}</h3>
                    {!msg.isRead && (
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4 flex flex-wrap gap-x-6 gap-y-2 font-mono">
                    <span>From: <strong className="text-gray-300">{msg.name}</strong></span>
                    <span>Email: <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">{msg.email}</a></span>
                    <span>Date: {format(new Date(msg.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 text-gray-300 whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 md:ml-4 shrink-0 border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="w-10 h-[38px] flex justify-center items-center shrink-0 bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-2 rounded transition-colors"
                  title="Delete Message"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-24 bg-[#121212] rounded-xl border border-white/5 flex flex-col items-center justify-center">
             <Inbox size={48} className="text-gray-600 mb-4" />
             <h3 className="text-xl text-white font-medium mb-1">Inbox Zero</h3>
             <p className="text-gray-500">No contact messages received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
