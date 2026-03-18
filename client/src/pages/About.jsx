import { useState, useEffect } from 'react';
import api from '../services/api';
import { Linkedin, Users } from 'lucide-react';

const About = () => {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/team');
        setTeamMembers(data);
      } catch (error) {
        console.error('Error loading team data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center bg-[#0c0014] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[#0c0014] opacity-50"></div>
        <div className="absolute w-96 h-96 bg-primary/30 rounded-full blur-[100px] -top-20 -left-20"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow tracking-wider uppercase">About Us</h1>
          <p className="text-xl text-primary font-semibold">The Day News Global</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="glass-card p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full"></div>
          <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-primary pl-4">About THE DAY NEWS</h2>
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              The Day News Global serves as a premier, interactive media platform dedicated to the pursuit of knowledge.
              We empower a global audience to gain meaningful insights through active engagement with diverse perspectives.
            </p>
            <p>
              Positioned as your strategic media partner in cyberspace, we bridge the gap between unheard information
              and actionable understanding, fostering a community where continuous learning is integrated into the daily experience.
            </p>
          </div>
        </div>

        {/* Our Team Section */}
        <div>
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The passionate individuals behind The Day News Global, dedicated to bringing you the most impactful stories from around the world.
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map(member => (
                <div
                  key={member._id}
                  className="group bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-2 duration-500 shadow-lg"
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden bg-[#111]">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-transparent to-transparent"></div>
                  </div>

                  {/* Info */}
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-5 text-gray-400 hover:text-[#0077B5] transition-colors text-sm font-medium"
                      >
                        <Linkedin size={17} />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-white/5 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-lg">Team information coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
