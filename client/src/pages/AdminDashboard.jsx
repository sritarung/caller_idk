import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Create socket connection
const socket = io('http://localhost:5001');

export default function AdminDashboard() {
  const [status, setStatus] = useState({
    first_name: false,
    middle_initial: false,
    last_name: false,
    last_four_digits: false,
    zip_code: false,
    human_voice: false,
    matching_voice: false,
    matching_face: false
  });
  
  const [activeUser, setActiveUser] = useState('John Doe');
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    // Socket event listeners
    socket.on('verification_update', (data) => {
      const updatedStatus = {
        first_name: Boolean(data.first_name),
        middle_initial: Boolean(data.middle_initial),
        last_name: Boolean(data.last_name),
        last_four_digits: Boolean(data.last_four_digits),
        zip_code: Boolean(data.zip_code),
        human_voice: Boolean(data.human_voice),
        matching_voice: Boolean(data.matching_voice),
        matching_face: Boolean(data.matching_face)
      };
      
      setStatus(updatedStatus);
      
      // Calculate verification progress
      const totalChecks = Object.keys(updatedStatus).length;
      const completedChecks = Object.values(updatedStatus).filter(Boolean).length;
      setVerificationProgress(Math.round((completedChecks / totalChecks) * 100));
    });

    // Cleanup on unmount
    return () => {
      socket.off('verification_update');
    };
  }, []);

  // Helper function for status icons with appropriate colors
  const StatusIndicator = ({ verified }) => {
    return verified ? (
      <span className="flex items-center text-green-600 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Verified
      </span>
    ) : (
      <span className="flex items-center text-red-500 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Pending
      </span>
    );
  };

  // Status card component
  const StatusCard = ({ title, items }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="font-semibold text-lg mb-4 text-gray-800 flex items-center">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700">{item.label}:</span>
            <StatusIndicator verified={item.status} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Top header gradient band */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-16 w-full"></div>
      
      <div className="max-w-6xl mx-auto p-6 -mt-8">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-cyan-800">Verification Dashboard</h1>
            <p className="text-cyan-600 mt-1">Real-time user verification status</p>
          </div>
          <div className="bg-cyan-50 p-3 rounded-lg shadow-sm border border-cyan-100">
            <div className="text-sm text-cyan-600">Current User</div>
            <div className="font-medium text-gray-800">{activeUser}</div>
          </div>
        </header>

        {/* Progress Overview */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg text-cyan-800">Verification Progress</h2>
            <span className="text-lg font-bold text-cyan-600">{verificationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${verificationProgress}%` }}
            ></div>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
            <div className={`p-2 rounded ${verificationProgress >= 25 ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-500'}`}>
              25%
            </div>
            <div className={`p-2 rounded ${verificationProgress >= 50 ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-500'}`}>
              50%
            </div>
            <div className={`p-2 rounded ${verificationProgress >= 75 ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-500'}`}>
              75%
            </div>
            <div className={`p-2 rounded ${verificationProgress >= 100 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              Complete
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <StatusCard 
            title={
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </span>
            }
            items={[
              { label: 'First Name', status: status.first_name },
              { label: 'Middle Initial', status: status.middle_initial },
              { label: 'Last Name', status: status.last_name }
            ]}
          />
          
          {/* Payment Information */}
          <StatusCard 
            title={
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Payment Information
              </span>
            }
            items={[
              { label: 'Last 4 Digits', status: status.last_four_digits },
              { label: 'Zip Code', status: status.zip_code }
            ]}
          />
          
          {/* Biometric Verification */}
          <div className="md:col-span-2">
            <StatusCard 
              title={
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
                  </svg>
                  Biometric Verification
                </span>
              }
              items={[
                { label: 'Human Voice', status: status.human_voice },
                { label: 'Voice Match', status: status.matching_voice },
                { label: 'Face Match', status: status.matching_face }
              ]}
            />
          </div>
        </div>

      </div>
    </div>
  );
}