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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-white p-4">
      {/* Logo Section */}
      <div className="mb-12 flex flex-col items-center">
        <img src="/logo.png" alt="Company Logo" className="w-24 h-auto mb-4" />
        <h1 className="text-3xl font-bold text-cyan-900 text-center">Account Setup</h1>
        <p className="text-cyan-700 mt-2 text-center">Please select the account type that fits your role</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
        {/* Individual User Option */}
        <button
          className={`border-2 rounded-xl p-6 w-full md:w-64 flex flex-col items-center transition-all ${
            selectedType === 'individual' 
              ? 'border-cyan-600 bg-cyan-100 shadow-md' 
              : 'border-gray-300 hover:border-cyan-400 hover:shadow-md'
          }`}
          onClick={() => handleSelection('individual')}
          aria-label="Select individual user account"
        >
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-cyan-50 rounded-full p-4">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="40" r="25" fill="#f0d6b9" />
              <path d="M30 35 Q50 20 70 35" fill="none" stroke="#0097b2" strokeWidth="4" />
              <rect x="40" y="32" width="20" height="5" fill="#0097b2" rx="2" />
              <circle cx="35" cy="35" r="4" fill="#0097b2" />
              <circle cx="65" cy="35" r="4" fill="#0097b2" />
              <path d="M35 55 Q50 65 65 55" fill="none" stroke="#0097b2" strokeWidth="4" />
            </svg>
          </div>
          <span className="text-xl font-medium text-cyan-800 mb-2">Individual User</span>
          <p className="text-sm text-gray-600 text-center">Access your personal dashboard and settings</p>
          
          {selectedType === 'individual' && (
            <div className="mt-4 text-cyan-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Selected
            </div>
          )}
        </button>
        
        {/* Admin Option */}
        <button
          className={`border-2 rounded-xl p-6 w-full md:w-64 flex flex-col items-center transition-all ${
            selectedType === 'admin' 
              ? 'border-cyan-600 bg-cyan-100 shadow-md' 
              : 'border-gray-300 hover:border-cyan-400 hover:shadow-md'
          }`}
          onClick={() => handleSelection('admin')}
          aria-label="Select admin account"
        >
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-cyan-50 rounded-full p-4">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="40" r="25" fill="#f0d6b9" />
              <rect x="25" y="30" width="50" height="10" fill="#0097b2" rx="2" />
              <circle cx="35" cy="35" r="4" fill="#fff" />
              <circle cx="65" cy="35" r="4" fill="#fff" />
              <path d="M40 50 Q50 45 60 50" fill="none" stroke="#0097b2" strokeWidth="3" />
              <rect x="35" y="70" width="30" height="15" fill="#0097b2" rx="2" />
              <rect x="45" y="65" width="10" height="8" fill="#0097b2" />
            </svg>
          </div>
          <span className="text-xl font-medium text-cyan-800 mb-2">Administrator</span>
          <p className="text-sm text-gray-600 text-center">Manage users and system settings</p>
          
          {selectedType === 'admin' && (
            <div className="mt-4 text-cyan-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Selected
            </div>
          )}
        </button>
      </div>
      
      {/* Continue Button */}
      {selectedType && (
        <button 
          className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          onClick={() => handleSelection(selectedType)}
        >
          Continue
        </button>
      )}
    </div>
  );
}

export default AccountTypeSelection;