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

  useEffect(() => {
    // Socket event listeners
    socket.on('verification_update', (data) => {
      setStatus({
        first_name: Boolean(data.first_name),
        middle_initial: Boolean(data.middle_initial),
        last_name: Boolean(data.last_name),
        last_four_digits: Boolean(data.last_four_digits),
        zip_code: Boolean(data.zip_code),
        human_voice: Boolean(data.human_voice),
        matching_voice: Boolean(data.matching_voice),
        matching_face: Boolean(data.matching_face)
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off('verification_update');
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Real-Time Verification Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status items */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Personal Information</h2>
          <p>First Name: {status.first_name ? '✅ Verified' : '❌ Not Verified'}</p>
          <p>Middle Initial: {status.middle_initial ? '✅ Verified' : '❌ Not Verified'}</p>
          <p>Last Name: {status.last_name ? '✅ Verified' : '❌ Not Verified'}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Payment Information</h2>
          <p>Last 4 Digits: {status.last_four_digits ? '✅ Verified' : '❌ Not Verified'}</p>
          <p>Zip Code: {status.zip_code ? '✅ Verified' : '❌ Not Verified'}</p>
        </div>
        
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Biometric Verification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p>Human Voice: {status.human_voice ? '✅ Verified' : '❌ Not Verified'}</p>
            <p>Voice Match: {status.matching_voice ? '✅ Verified' : '❌ Not Verified'}</p>
            <p>Face Match: {status.matching_face ? '✅ Verified' : '❌ Not Verified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}