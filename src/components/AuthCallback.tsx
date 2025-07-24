import React, { useEffect } from 'react';
import { supabase } from '../App';
import { useNavigate } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        navigate('/');
        return;
      }

      if (data.session) {
        // Successfully authenticated, redirect to main app
        navigate('/');
      } else {
        // No session found, redirect to login
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c4cc9] mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}; 