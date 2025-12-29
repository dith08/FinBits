import React from 'react';
import LogoImg from '../assets/Logo.png';
import Registerllustration from '../assets/IlustrationRegister.png';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Kiri: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 justify-center">
         <div className="absolute top-7 left-7 text-2xl flex items-center">
          <img src={LogoImg} alt="FinBits Logo" className="h-9 w-auto" />
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0 mt-6">
          <h1 className="text-3xl font-bold text-emerald-500 mb-8 tracking-wide">
            Register
          </h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold">Username</label>
              <input
                type="text"
                className="w-full bg-black border border-gray-700 rounded-md p-3 focus:border-emerald-500 outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold">Email</label>
              <input
                type="email"
                className="w-full bg-black border border-gray-700 rounded-md p-3 focus:border-emerald-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-black border border-gray-700 rounded-md p-3 focus:border-emerald-500 outline-none transition"
              />
            </div>

            {/* Password Confirmation */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold">Password Confirmation</label>
              <input
                type="password"
                className="w-full bg-black border border-gray-700 rounded-md p-3 focus:border-emerald-500 outline-none transition"
              />
            </div>

            {/* Register Button */}
            <div className="pt-6 flex justify-center lg:justify-start">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-12 rounded-lg transition duration-300 text-lg"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Kanan: Illustration Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 border-l border-gray-800">
        <div className="relative w-full max-w-lg">
          <img 
            src={Registerllustration} 
            alt="Registration Illustration" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;