import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlayCircle } from 'lucide-react';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await api.get('/programs');
        setPrograms(data);
      } catch (error) {
        console.error("Error loading programs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 text-glow">All Programs</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our wide range of award-winning journalism and specialized media broadcasting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <Link 
            key={program._id} 
            to={`/programs/${program.slug}`} 
            className="group relative h-72 rounded-2xl overflow-hidden block shadow-2xl border border-white/5 hover:border-primary/50 transition-all duration-500"
          >
            {/* Background Image */}
            <img 
              src={program.coverImage} 
              alt={program.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="flex items-center gap-4">
                {program.logoImage && (
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg p-1.5 border border-white/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <img src={program.logoImage} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight drop-shadow-lg">
                    {program.title}
                  </h2>
                  <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mt-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <PlayCircle size={14} /> View Episodes
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No programs found. Check back later!
        </div>
      )}
    </div>
  );
};

export default Programs;
