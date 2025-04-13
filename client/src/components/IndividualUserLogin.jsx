import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, AlertCircle, Eye, EyeOff, Phone, KeyRound } from 'lucide-react';

export default function IndividualUserLogin() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Custom brand color
  const brandColor = "#0097b2";
  const brandLightColor = "#e6f7fa"; // Light version for backgrounds

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate login API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('User logged in with:', { phoneNumber, accessCode });
      navigate('/userform'); // Redirect after successful login
    }, 1000);
  };
  
  const handleAccessCodeChange = (e) => {
    const input = e.target.value;
    // Only allow digits, and max 5 characters
    if (/^\d{0,5}$/.test(input)) {
      setAccessCode(input);
    }
  };
  
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Basic formatting for phone number
    if (/^\d{0,10}$/.test(input.replace(/\D/g, ''))) {
      setPhoneNumber(input);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ backgroundColor: '#0097b2' }}></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-16 w-auto shadow-lg rounded-lg"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          User Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-2 sm:text-sm transition-all duration-200"
                  style={{ 
                    focusRing: brandColor,
                    focusBorderColor: brandColor 
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                5-Digit Access Code
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="code"
                  name="code"
                  type={showAccessCode ? "text" : "password"}
                  required
                  inputMode="numeric"
                  value={accessCode}
                  onChange={handleAccessCodeChange}
                  placeholder="Enter 5-digit code"
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-2 sm:text-sm transition-all duration-200"
                  style={{ 
                    focusRing: brandColor,
                    focusBorderColor: brandColor 
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showAccessCode ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    style={{
                      transform: rememberMe ? 'translateX(100%)' : 'translateX(0)',
                      borderColor: rememberMe ? brandColor : '#D1D5DB'
                    }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    style={{ backgroundColor: rememberMe ? brandLightColor : '#D1D5DB' }}
                  ></label>
                </div>
                <label htmlFor="remember-me" className="text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium hover:text-opacity-90 transition-colors" style={{ color: brandColor }}>
                  Need help?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !phoneNumber || !accessCode}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                  isSubmitting || !phoneNumber || !accessCode
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
                }`}
                style={{ 
                  backgroundColor: isSubmitting || !phoneNumber || !accessCode ? '#7fd3e1' : brandColor,
                  focusRing: brandColor
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entering...
                  </>
                ) : (
                  <>
                    Enter Username <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-600">
          By accessing, you agree to our <a href="#" className="font-medium hover:text-opacity-90 transition-colors" style={{ color: brandColor }}>Terms of Service</a> and <a href="#" className="font-medium hover:text-opacity-90 transition-colors" style={{ color: brandColor }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}