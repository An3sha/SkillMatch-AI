import React, { useState } from 'react';
import { supabase } from '../App';
import { Target } from 'lucide-react';
import { Button } from './ui/button';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google login error:', error.message);
        alert('Login failed: ' + error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-300/15 to-indigo-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">100B Jobs 🚀</h1>
            </div>

            <h2 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Find Your
              <span className="block bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Dream Team
              </span>
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
              Connect with top talent from around the world. Build teams that turn ambitious visions into reality.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
         

          <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-600">Sign in with your Google account</p>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg text-gray-700 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center space-x-4 shadow-sm transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-base">
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
