import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthContext from '../../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import logo from '../../assets/logo.png';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const result = await login(data.email, data.password);

    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0014] p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md glass-card p-10 relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src={logo} alt="The Day News Admin" className="h-[100px] w-auto mb-6 object-contain" />
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm">Secure login required to continue</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-lg mb-6 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-gray-500" size={20} />
              <input
                {...register("email")}
                type="email"
                placeholder="Admin Email"
                className="w-full bg-[#121212] border border-white/10 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-500" size={20} />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full bg-[#121212] border border-white/10 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-70 mt-4"
          >
            {isSubmitting ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-xs transition-colors">
            ← Return to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
