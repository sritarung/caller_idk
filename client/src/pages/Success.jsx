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
    const colors = ['#0097b2', '#00b2a9', '#25c9d0', '#5bd0d4', '#7be5e9'];
    
    // Create and animate confetti pieces
    for (let i = 0; i < 120; i++) {
      const confetti = document.createElement('div');
      
      // Get random values for confetti piece styling
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const width = Math.random() * 8 + 4;
      const height = Math.random() * 12 + 6;
      const delay = Math.random() * 3;
      
      // Apply styling
      confetti.className = 'absolute opacity-80';
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.left = `${left}%`;
      confetti.style.top = '-20px';
      confetti.style.backgroundColor = randomColor;
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
          opacity: 0.8;
        }
        75% {
          opacity: 0.6;
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f0f9fb 0%, #e0f2f7 100%)'
    }}>
      {/* Confetti container */}
      <div id="confetti-container" className="absolute inset-0 z-0 pointer-events-none"></div>
      
      {/* Success card */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 mb-8 transition-all duration-700 ease-out transform translate-y-0">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="rounded-full p-3 border-4 border-white shadow-md" style={{ backgroundColor: 'rgba(0, 151, 178, 0.1)' }}>
            <CheckCircle className="w-14 h-14" style={{ color: '#0097b2' }} />
          </div>
        </div>
        
        <div className="h-1 w-full absolute top-0 left-0 overflow-hidden rounded-t-xl">
          <div className="h-full" style={{ 
            background: 'linear-gradient(90deg, #0097b2, #5bd0d4)', 
            width: '100%' 
          }}></div>
        </div>
        
        <div className="mt-10 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0097b2' }}>Verification Successful</h1>
          <p className="text-gray-600 mb-6">Your identity has been confirmed and authenticated.</p>
          
          <div className="flex items-center justify-center space-x-2 font-medium mb-6" style={{ color: '#0097b2' }}>
            <Shield className="w-5 h-5" />
            <span>Your session is now secure</span>
          </div>
          
          <div className="h-1.5 bg-gray-100 rounded-full mb-2">
            <div 
              className="h-1.5 rounded-full transition-all duration-1000 ease-linear" 
              style={{ 
                width: `${(countdown / 10) * 100}%`,
                background: 'linear-gradient(90deg, #0097b2, #5bd0d4)' 
              }}
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
        className="relative z-10 flex items-center space-x-2 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        style={{ backgroundColor: '#0097b2' }}
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
      
      {/* Achievement toast notification instead of banner */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 py-3 px-5 rounded-lg shadow-lg text-white z-20 flex items-center space-x-2" 
        style={{ 
          backgroundColor: 'rgba(0, 151, 178, 0.9)',
          backdropFilter: 'blur(8px)'
        }}>
        <Shield className="w-5 h-5" />
        <p className="font-medium text-sm">Biometric authentication complete</p>
      </div>
    </div>
  );
};

export default SuccessPage;