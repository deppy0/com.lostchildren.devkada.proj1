import { Link, useNavigate } from 'react-router-dom';
import '../css/Font.css';
import monimedLogo from '../assets/logoMonimed.svg';

export default function Index() {
  const nav = useNavigate();

  const goToHome = () => {
    //auth logic dito
    nav('/home');
  };
  return (
    <div className="min-h-screen bg-[#F7F9F9] font-k2d flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Logo Section */}
		<img src={monimedLogo} className="w-50 h-50" alt="Monimed"></img>
        {/* Heading */}
        <div className="text-center mt-6">
          <h1 className="text-3xl leading-tight text-gray-900 font-normal">
            Monitor your
            <br />
            Medicine with
          </h1>
          <h2 className="text-4xl text-[#2081C3] font-semibold mt-1">Ease</h2>
        </div>

        {/* Form Container */}
        <div className="w-full mt-8 space-y-4">
          
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] transition-colors"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-1">
            <a href="#" className="text-sm text-[#63D2FF] hover:text-[#2081C3] transition-colors">
              Forgot Password ?
            </a>
          </div>

          {/* Login Button */}
          <button onClick={goToHome} className="w-full bg-[#2081C3] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2 text-lg hover:cursor-pointer">
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center justify-center mt-8 space-x-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-400 text-sm">Or sign up with</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Google Sign In Button */}
        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-full mt-6 flex items-center justify-center gap-2 transition-colors hover:cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* Footer Link */}
        <div className="mt-8 text-sm text-gray-500">
          Not register yet ? <Link to = "/signup" className="text-gray-900 font-semibold hover:underline">Create Account</Link>
        </div>

      </div>
    </div>
  );
}
