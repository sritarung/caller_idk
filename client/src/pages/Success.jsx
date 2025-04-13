import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  // Auto-redirect after countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    const redirect = setTimeout(() => {
      navigate('/');
    }, 10000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);
  
  // Confetti effect
  useEffect(() => {
    // Create confetti elements
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-pink-500', 'bg-purple-500'];
    
    // Create and animate confetti pieces
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      
      // Get random values for confetti piece styling
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 16 + 8;
      const delay = Math.random() * 3;
      
      // Apply styling
      confetti.className = `absolute ${randomColor} opacity-80`;
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.left = `${left}%`;
      confetti.style.top = '-20px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animation = `confetti-fall 4s ease-in-out ${delay}s infinite`;
      
      confettiContainer.appendChild(confetti);
    }
    
    // Add keyframe animation to style
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
      @keyframes confetti-fall {
        0% { 
          transform: translateY(-20px) rotate(0deg);
          opacity: 1;
        }
        75% {
          opacity: 1;
        }
        100% { 
          transform: translateY(100vh) rotate(360deg); 
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Confetti container */}
      <div id="confetti-container" className="absolute inset-0 z-0 pointer-events-none"></div>
      
      {/* Success card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 mb-8 animate-bounce-once">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-100 rounded-full p-4 border-4 border-white shadow-lg">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verification Successful!</h1>
          <p className="text-gray-600 mb-6">Your identity has been confirmed and authenticated.</p>
          
          <div className="flex items-center justify-center space-x-2 text-green-500 font-medium mb-6">
            <Shield className="w-5 h-5" />
            <span>Your session is now secure</span>
          </div>
          
          <div className="h-2 bg-gray-100 rounded-full mb-2">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-1000 ease-linear" 
              style={{ width: `${(countdown / 10) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
      
      {/* Manual navigation button */}
      <button 
        onClick={() => navigate('/')}
        className="relative z-10 flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
      
      {/* Achievement banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white py-3 px-4 text-center relative z-20">
        <p className="font-medium">Security achievement unlocked: Biometric authentication complete!</p>
      </div>
    </div>
  );
};

export default SuccessPage;