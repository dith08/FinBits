import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import LogoImg from '../assets/Logo.png';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google login gagal: ' + errorParam);
      return;
    }

    if (token && userId) {
      authService.handleGoogleCallback(token, userId);
      navigate('/dashboard');
      return;
    }

    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }

    const savedCredentials = localStorage.getItem('finbits_remember_me');
    if (savedCredentials) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } catch (err) {
        console.error('Error loading saved credentials:', err);
      }
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      
      if (rememberMe) {
        localStorage.setItem('finbits_remember_me', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('finbits_remember_me');
      }
      
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Login gagal, coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    authService.googleSignIn(); 
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10B981] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 z-10">
        <div className="absolute top-8 left-8 flex items-center group cursor-pointer">
          <img 
            src={LogoImg} 
            alt="FinBits Logo" 
            className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all" 
          />
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 mt-5">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-400 text-sm">Silahkan masuk ke akun FinBits anda.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm"
                placeholder="Masukan email anda"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-12 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm"
                  placeholder="Masukan Password anda"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 border cursor-pointer accent-[#10B981]"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] hover:bg-[#13d394] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Atau via</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-transparent border border-white/10 flex items-center justify-center space-x-3 py-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Login dengan Google</span>
            </button>
          </form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Belum punya akun?{' '}
            <a href="/register" className="text-[#10B981] hover:text-[#059669] font-semibold transition-colors">
              Buat akun sekarang
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#050505] overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: `linear-gradient(#10B981 0.5px, transparent 0.5px), linear-gradient(90deg, #10B981 0.5px, transparent 0.5px)`, 
            backgroundSize: '40px 40px' 
          }}>
        </div>
        <div className="absolute w-[500px] h-[500px] bg-[#10B981] opacity-[0.07] rounded-full blur-[120px]"></div>

        <div className="relative z-10 grid grid-cols-2 gap-4 p-12">
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-[#10B981] uppercase tracking-[0.2em]">Status Sistem</span>
              <div className="h-2 w-2 bg-[#10B981] rounded-full animate-ping"></div>
            </div>
            <div className="h-[100px] flex items-end gap-1">
              {[40, 70, 45, 90, 65, 80, 30, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#10B981] to-emerald-400 opacity-50 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-gray-500">Memproses produktivitas & finansial real-time...</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Keamanan</p>
            <p className="text-xl font-mono">256-AES</p>
            <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
              <div className="bg-[#10B981] h-full w-[80%]"></div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Latensi</p>
            <p className="text-xl font-mono text-blue-400">12ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;