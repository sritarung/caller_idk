import { useState } from 'react';

export default function IndividualUserLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('User logged in with:', { phoneNumber, accessCode });
      // Here you would typically redirect to dashboard or home page
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Individual User Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                5-Digit Access Code
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  inputMode="numeric"
                  value={accessCode}
                  onChange={handleAccessCodeChange}
                  placeholder="Enter your 5-digit code"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.length < 10 || accessCode.length !== 5}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || phoneNumber.length < 10 || accessCode.length !== 5
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}