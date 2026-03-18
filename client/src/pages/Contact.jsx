import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ state: 'idle', message: '' }); // idle, loading, success, error

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error("Error loading contact info", error);
      }
    };
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitStatus({ state: 'loading', message: '' });
      await api.post('/messages', data);
      
      setSubmitStatus({ state: 'success', message: 'Thank you! Your message has been sent successfully.' });
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus({ state: 'idle', message: '' }), 5000);
    } catch (error) {
      setSubmitStatus({ 
        state: 'error', 
        message: error.response?.data?.message || 'Something went wrong. Please try again later.' 
      });
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#0c0014] py-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow uppercase tracking-wider">Contact Us</h1>
          <p className="text-xl text-gray-400">We'd love to hear from you. Drop us a line.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info container */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Whether you have a news tip, a question about our programs, or inquiries regarding advertising, our team is ready to respond.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Our Headquarters</h3>
                  <p className="text-gray-400">{settings?.contactAddress || '123 Media Avenue, New York, NY 10001, USA'}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-primary hover:underline cursor-pointer">{settings?.contactEmail || 'contact@thedaynewsglobal.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                  <p className="text-gray-400">{settings?.contactPhone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 md:p-10">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            
            {submitStatus.state === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-300">
                {submitStatus.message}
              </div>
            )}
            
            {submitStatus.state === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-300">
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                  <input 
                    {...register("name")}
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    {...register("email")}
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input 
                  {...register("subject")}
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="How can we help you?"
                />
                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  {...register("message")}
                  rows="6"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Type your message here..."
                ></textarea>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={submitStatus.state === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitStatus.state === 'loading' ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <><Send size={20} /> Send Message</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
