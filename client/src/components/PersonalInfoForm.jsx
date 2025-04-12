
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Last Four Digits, 3: Zip Code
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_initial: '',
    last_name: '',
    last_four_digits: '',
    zip_code: '',
    human_voice: false,
    matching_voice: false,
    matching_face: false
  });

  const [validation, setValidation] = useState({
    first_name: null,
    middle_initial: null,
    last_name: null,
    last_four_digits: null,
    zip_code: null
  });

  // Expected correct values
  const expectedValues = {
    first_name: "John",
    middle_initial: "D",
    last_name: "Doe",
    last_four_digits: "1234",
    zip_code: "12345"
  };

  const safelyValidate = (value) => {
    if (value === null || value === undefined) return false;
    const trimmedValue = String(value).trim();
    if (trimmedValue === '') return false;
    return true
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const safeValue = value === null || value === undefined ? '' : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : safeValue
    }));

    if (name === 'first_name') {
      setValidation(prev => ({ ...prev, first_name: safelyValidate(safeValue) }));
    } else if (name === 'middle_initial') {
      setValidation(prev => ({ ...prev, middle_initial: safelyValidate(safeValue) }));
    } else if (name === 'last_name') {
      setValidation(prev => ({ ...prev, last_name: safelyValidate(safeValue) }));
    } else if (name === 'last_four_digits') {
      setValidation(prev => ({ ...prev, last_four_digits: safelyValidate(safeValue) }));
    } else if (name === 'zip_code') {
      setValidation(prev => ({ ...prev, zip_code: safelyValidate(safeValue) }));
    }
  };

  const handleNextStep = async () => {
    // Submit current step data
    try {
      await axios.post('http://localhost:5001/userform', {
        ...formData,
        // Only include fields relevant to current step
        ...(step === 1 ? {
          first_name: formData.first_name,
          middle_initial: formData.middle_initial,
          last_name: formData.last_name
        } : {}),
        ...(step === 2 ? {
          last_four_digits: formData.last_four_digits
        } : {}),
        ...(step === 3 ? {
          zip_code: formData.zip_code
        } : {})
      });

      // Move to next step or complete
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Final submission - navigate to success page
        await handleFinalSubmit();
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      // Submit all data one final time
      await axios.post('http://localhost:5001/userform', {
        first_name: formData.first_name,
        middle_initial: formData.middle_initial,
        last_name: formData.last_name,
        last_four_digits: formData.last_four_digits,
        zip_code: formData.zip_code
      });

      // Reset form
      setFormData({
        first_name: '',
        middle_initial: '',
        last_name: '',
        last_four_digits: '',
        zip_code: '',
        human_voice: false,
        matching_voice: false,
        matching_face: false
      });

      setValidation({
        first_name: null,
        middle_initial: null,
        last_name: null,
        last_four_digits: null,
        zip_code: null
      });

      // Navigate to success page
      navigate('/success'); // Make sure you have this route set up

    } catch (error) {
      console.error('Final submission error:', error);
      alert('Final submission failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-6">Verification Form</h2>
      
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>1</div>
          <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>2</div>
          <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>3</div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Personal Info</span>
          <span>Card Details</span>
          <span>Address</span>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="mb-4">
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${
                validation.first_name === true ? 'border-green-500' : 
                validation.first_name === false ? 'border-red-500' : ''
              }`}
              autoFocus
            />
            {validation.first_name === false && (
              <span className="text-sm text-red-600">
                ✗ Must be non-empty
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Middle Initial</label>
            <input
              type="text"
              name="middle_initial"
              value={formData.middle_initial}
              onChange={handleChange}
              maxLength="1"
              className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${
                validation.middle_initial === true ? 'border-green-500' : 
                validation.middle_initial === false ? 'border-red-500' : ''
              }`}
            />
            {validation.middle_initial === false && (
              <span className="text-sm text-red-600">
                ✗ Must be non-empty
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${
                validation.last_name === true ? 'border-green-500' : 
                validation.last_name === false ? 'border-red-500' : ''
              }`}
            />
            {validation.last_name === false && (
              <span className="text-sm text-red-600">
                ✗ Must be non-empty
              </span>
            )}
          </div>

          <button 
            onClick={handleNextStep}
            disabled={!validation.first_name || !validation.middle_initial || !validation.last_name}
            className={`w-full py-2 px-4 text-white rounded ${
              validation.first_name && validation.middle_initial && validation.last_name
                ? 
              'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Last Four Digits */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Card Details</h3>
          <div className="mb-4">
            <label className="block mb-1">Last 4 Digits of Card</label>
            <input
              type="text"
              name="last_four_digits"
              value={formData.last_four_digits}
              onChange={handleChange}
              minLength="4"
              maxLength="4"
              className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${
                validation.last_four_digits === true ? 'border-green-500' : 
                validation.last_four_digits === false ? 'border-red-500' : ''
              }`}
              autoFocus
            />
            {validation.last_four_digits === false && (
              <span className="text-sm text-red-600">
                ✗ Must be non-empty
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <button 
              onClick={handlePrevStep}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button 
              onClick={handleNextStep}
              // disabled={!validation.last_four_digits}
              className={`py-2 px-4 text-white rounded ${
                'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Zip Code */}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Address Information</h3>
          <div className="mb-4">
            <label className="block mb-1">Zip Code</label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              maxLength="5"
              className={`w-full p-2 border rounded focus:ring focus:ring-blue-200 ${
                validation.zip_code === true ? 'border-green-500' : 
                validation.zip_code === false ? 'border-red-500' : ''
              }`}
              autoFocus
            />
            {validation.zip_code === false && (
              <span className="text-sm text-red-600">
                ✗ Must be non-empty
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <button 
              onClick={handlePrevStep}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button 
              onClick={handleNextStep} // This will trigger final submission
              disabled={!validation.zip_code}
              className={`py-2 px-4 text-white rounded ${validation.zip_code?
               'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}