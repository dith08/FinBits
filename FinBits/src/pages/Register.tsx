import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import LogoImg from '../assets/Logo.png';
import { authService } from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google sign up gagal: ' + errorParam);
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
  }, [navigate, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter ya!');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess('Akun berhasil dibuat! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Registrasi gagal, coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setLoading(true);
    authService.googleSignIn();
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10B981] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 z-10 py-12">
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
              Buat Akun
            </h1>
            <p className="text-gray-400 text-sm">Mulai menjadi lebih baik bareng FinBits.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 text-green-400 text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Nama Pengguna</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm placeholder:text-gray-600"
                placeholder="Masukan nama pengguna"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Alamat Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm placeholder:text-gray-600"
                placeholder="Masukan alamat email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pr-12 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm placeholder:text-gray-600"
                  placeholder="Masukan password"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pr-12 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 backdrop-blur-sm placeholder:text-gray-600"
                  placeholder="Masukan konfirmasi password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#10B981] hover:bg-[#13d394] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Membuat Akun...' : 'Mulai Sekarang'}
            </button>

            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Atau daftar via</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-transparent border border-white/10 flex items-center justify-center space-x-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Daftar dengan Google</span>
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-gray-500">
            Sudah punya akun?{' '}
            <a href="/login" className="text-[#10B981] hover:text-[#059669] font-semibold transition-colors">
              Login di sini
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

        <div className="relative z-10 grid grid-cols-2 gap-4 p-12 w-full max-w-2xl">
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">Topologi Jaringan</span>
              <span className="text-[10px] font-mono text-gray-500">Node: 0x99...F2</span>
            </div>
            <div className="flex justify-around items-center h-20 relative">
              <div className="w-4 h-4 bg-[#10B981] rounded-full shadow-[0_0_10px_#10B981]"></div>
              <div className="h-[2px] flex-grow bg-gradient-to-r from-[#10B981] to-blue-500 mx-2 opacity-30"></div>
              <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-emerald-500 mx-2 opacity-30"></div>
              <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-50"></div>
            </div>
            <p className="mt-4 font-mono text-[10px] text-center text-gray-500 uppercase tracking-widest italic">Menginisialisasi handshake terenkripsi...</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center">
            <div className="w-10 h-10 mb-3 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <p className="text-gray-400 text-[10px] uppercase font-bold">Privasi</p>
            <p className="text-sm font-mono mt-1 text-white">Terenkripsi</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-1 bg-red-500 rounded-full"></div>
                <p className="text-gray-500 text-[9px] uppercase font-bold">Aliran Data</p>
             </div>
             <div className="space-y-1">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[40%] bg-emerald-500"></div></div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-emerald-500"></div></div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[55%] bg-emerald-500"></div></div>
             </div>
          </div>
        </div>

        <div className="absolute bottom-10 flex gap-10 opacity-30 font-mono text-[9px] tracking-widest text-gray-400">
           <span>PROTOKOL_KEAMANAN: v4.2</span>
           <span>ENKRIPSI: SH-512</span>
           <span>LOKAL: ID_JKT</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;