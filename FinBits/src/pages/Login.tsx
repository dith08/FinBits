import React from 'react';
import LogoImg from '../assets/Logo.png';
import LoginIllustration from '../assets/IlustrationLogin.png';

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Bagian Kiri: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24 lg:px-32">
        {/* Logo */}
        <div className="absolute top-7 left-7 text-2xl flex items-center">
          <img src={LogoImg} alt="FinBits Logo" className="h-9 w-auto" />
        </div>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-semibold text-[#10B981] mb-8 text-center lg:text-left">
            Login
          </h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-black border border-gray-800 rounded-md p-3 focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-black border border-gray-800 rounded-md p-3 focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-md transition-all duration-200"
            >
              Login
            </button>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="px-4 text-sm text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full border border-gray-800 flex items-center justify-center space-x-2 py-3 rounded-md hover:bg-gray-900 transition-all duration-200"
            >
              <span>Login with</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-sm text-center lg:text-center">
            Tidak Punya akun?{' '}
            <a href="/register" className="text-[#10B981] hover:underline font-medium">
              Daftar
            </a>
          </p>
        </div>
      </div>

      {/* Bagian Kanan: Ilustrasi (Sembunyi di Mobile) */}
      <div className="hidden lg:flex w-1/2 border-l border-gray-800 items-center justify-center p-20">
        <div className="relative w-full max-w-lg">
          {/* Ilustrasi Placeholder */}
          {/* Di sini lu bisa pake SVG atau Image asli. Ini gw buat simulasi simplenya */}
          <div className="relative z-10">
             {/* Lu bisa ganti image ini sama file aslinya */}
             <img 
               src={LoginIllustration} 
               alt="Illustration" 
               className="w-85 h-86"
               style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))' }}
             />
          </div>
          
          {/* Dekorasi Tambahan */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#10B981] opacity-10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;