import { Link } from 'react-router-dom';
import '../css/Font.css';
import pillImage from '../assets/signupBanner.png'
// import pillsIllustration from '../assets/pillsIllustration.svg'; // Make sure to import your illustration

export default function Signup() {
  return (
    <div className="min-h-screen bg-[#F7F9F9] font-k2d flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col">
        
        {/* Back Button */}
        <div className="absolute top-8 left-10 text-[#2081C3] hover:opacity-80 transition-opacity">
          <Link to="/" className="text-[#2081C3] hover:opacity-80 transition-opacity">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <img 
            src={pillImage} 
            alt="Medical Pills" 
            className="w-[250px] h-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl text-gray-900 font-medium mb-8">Get Started</h1>

        {/* Form Container */}
        <form className="w-full space-y-4">
          
          {/* Firstname Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Firstname"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] transition-colors"
            />
          </div>

          {/* Lastname Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Lastname"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] transition-colors"
            />
          </div>

          {/* Email Input (SVG from Index.jsx) */}
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

          {/* Password Input (SVG from Index.jsx) */}
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

          {/* Confirm Password Input (SVG from Index.jsx) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] transition-colors"
            />
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            className="w-full bg-[#2081C3] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors mt-6 text-lg hover:cursor-pointer"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
}