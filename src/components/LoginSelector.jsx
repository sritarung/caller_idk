import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function AccountTypeSelection() {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  
  const handleSelection = (type) => {
    setSelectedType(type);
    console.log(`Selected account type: ${type}`);
    if (type === 'individual') {
        navigate('/individual');
      } else if (type === 'admin') {
        navigate('/admin');
      }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-16">Please select your account type</h1>
      
      <div className="flex flex-row gap-8 w-full max-w-3xl justify-center">
        {/* Individual User Option */}
        <button
          className={`border rounded-lg p-8 w-64 flex flex-col items-center transition-all ${
            selectedType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => handleSelection('individual')}
        >
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="40" r="25" fill="#f0d6b9" />
              <path d="M30 35 Q50 20 70 35" fill="none" stroke="#5d4037" strokeWidth="4" />
              <rect x="40" y="32" width="20" height="5" fill="#5d4037" rx="2" />
              <circle cx="35" cy="35" r="4" fill="#5d4037" />
              <circle cx="65" cy="35" r="4" fill="#5d4037" />
              <path d="M35 55 Q50 65 65 55" fill="none" stroke="#5d4037" strokeWidth="4" />
            </svg>
          </div>
          <span className="text-lg font-medium text-gray-800">Individual user</span>
        </button>
        
        {/* Admin Option */}
        <button
          className={`border rounded-lg p-8 w-64 flex flex-col items-center transition-all ${
            selectedType === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => handleSelection('admin')}
        >
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="40" r="25" fill="#f0d6b9" />
              <rect x="25" y="30" width="50" height="10" fill="#5d4037" rx="2" />
              <circle cx="35" cy="35" r="4" fill="#fff" />
              <circle cx="65" cy="35" r="4" fill="#fff" />
              <path d="M40 50 Q50 45 60 50" fill="none" stroke="#5d4037" strokeWidth="3" />
              <rect x="35" y="70" width="30" height="15" fill="#5d4037" rx="2" />
              <rect x="45" y="65" width="10" height="8" fill="#5d4037" />
            </svg>
          </div>
          <span className="text-lg font-medium text-gray-800">Admin</span>
        </button>
      </div>
    </div>
  );
}

export default AccountTypeSelection;
