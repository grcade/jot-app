import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { Loader2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData }));
      navigate('/');
    } catch (err) {
      setError(err.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-2">Welcome Back</h1>
            <p className="text-text-secondary font-medium">Continue your journey with JotApp</p>
        </div>

        <div className="bg-bg-surface p-8 rounded-2xl border border-border-subtle shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Password</label>
                <a href="#" className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent/20 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/[0.03] text-center">
            <p className="text-text-secondary text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:underline font-bold transition-all">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
