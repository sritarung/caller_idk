import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserForm() {

  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Last Four Digits, 3: Zip Code, 4: Voice, 5: Final
  const [verificationResults, setVerificationResults] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

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

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
    try {
      // Submit current data including voice verification status
      await axios.post('http://localhost:5001/userform', {
        ...formData,
        // Include all fields for the current step
        ...(step === 1 && {
          first_name: formData.first_name,
          middle_initial: formData.middle_initial,
          last_name: formData.last_name
        }),
        ...(step === 2 && {
          last_four_digits: formData.last_four_digits
        }),
        ...(step === 3 && {
          zip_code: formData.zip_code
        }),
        // Always include voice verification status if available
        ...(step === 4 && {
          human_voice: formData.human_voice,
          matching_voice: formData.matching_voice
        })
      });
  
      // Move to next step
      if (step < 5) {
        setStep(step + 1);
      } else {
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
      // Prepare data in format backend expects
      const submissionData = {
        first_name: formData.first_name,
        middle_initial: formData.middle_initial,
        last_name: formData.last_name,
        last_four_digits: formData.last_four_digits,
        zip_code: formData.zip_code,
        human_voice: formData.human_voice ? 1 : 0,  // Convert to integer
        matching_voice: formData.matching_voice ? 1 : 0,
        matching_face: formData.matching_face ? 1 : 0
      };
  
      // Submit to backend
      const response = await axios.post('http://localhost:5001/userform', submissionData, {
        headers: {
          'Content-Type': 'application/json'
        }
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
  
      // Navigate based on verification status
      if (formData.human_voice && formData.matching_voice) {
        navigate('/success');
      } else {
        setStep(5); // Show final rejection step
      }
  
    } catch (error) {
      console.error('Final submission error:', error.response?.data || error.message);
      alert(`Final submission failed: ${error.response?.data?.error || error.message}`);
    }
  };
  

  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    audioBlob: null,
    audioUrl: '',
    error: null
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };


  const saveAudioToFile = () => {
    if (recordingState.audioBlob) {
      const url = URL.createObjectURL(recordingState.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.wav';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

const analyzeRecording = async () => {
  if (!audioBlob) return;
  
  setIsAnalyzing(true);
  
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    const response = await axios.post(
      'http://localhost:5001/verify-voice', 
      formData,
      { 
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    // Update form data with verification results
    setFormData(prev => ({
      ...prev,
      human_voice: true, // Assuming it's human if verification succeeds
      matching_voice: response.data.is_match
    }));

    setAnalysisResult({
      isHumanVoice: true,
      isMatchingVoice: response.data.is_match
    });

    if (response.data.is_match) {
      alert("Voice verification successful!");
    } else {
      alert("Voice verification failed: Voice doesn't match our records");
    }

  } catch (error) {
    console.error('Verification error:', error);
    alert(`Verification failed: ${error.response?.data?.error || error.message}`);
  } finally {
    setIsAnalyzing(false);
  }
};
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-6">Verification Form</h2>
      
      {/* Progress Indicator - updated for 5 steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {stepNum}
              </div>
              {stepNum < 5 && (
                <div className={`h-1 flex-1 mx-2 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Personal</span>
          <span>Card</span>
          <span>Address</span>
          <span>Voice</span>
          <span>Result</span>
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
              className={`py-2 px-4 text-white rounded ${ validation.last_four_digits?
                'bg-blue-500 hover:bg-blue-600':
                'bg-gray-400 cursor-not-allowed'
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
              onClick={handleNextStep}
              disabled={!validation.zip_code}
              className={`py-2 px-4 text-white rounded ${validation.zip_code?
               'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Voice Verification */}
      {step === 4 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Voice Verification</h3>
          <p className="mb-4 bg-blue-50 p-4 rounded">
            Please read the following sentence aloud when you press record:
            <br />
            <strong>"My name is {formData.first_name} {formData.last_name} and I agree to these terms."</strong>
          </p>

          <div className="mb-4">
            {audioUrl ? (
              <div className="flex flex-col items-center">
                <audio controls src={audioUrl} className="mb-4" />
                <button 
                  onClick={() => {
                    setAudioUrl('');
                    setAudioBlob(null);
                    setAnalysisResult(null);  // <-- Reset analysis result
                    setIsAnalyzing(false); 
                  }}
                  className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Re-record
                </button>
              </div>
            ) : (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-2 px-4 text-white rounded mb-4 ${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            )}

            {audioUrl && !isAnalyzing && !analysisResult && (
              <button
                onClick={analyzeRecording}
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit for Analysis
              </button>
            )}

            {isAnalyzing && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p>Analyzing your voice recording...</p>
              </div>
            )}

            {analysisResult && (
              <div className={`p-4 rounded mt-4 ${
                analysisResult.isHumanVoice && analysisResult.isMatchingVoice 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-semibold">
                  {analysisResult.isHumanVoice && analysisResult.isMatchingVoice 
                    ? '✓ Voice verification successful!' 
                    : 'Voice verification failed'}
                </p>
                {!analysisResult.isHumanVoice && (
                  <p>Our system couldn't confirm this was a human voice.</p>
                )}
                {analysisResult.isHumanVoice && !analysisResult.isMatchingVoice && (
                  <p>The voice doesn't match our records.</p>
                )}
              </div>
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
              className={`py-2 px-4 text-white rounded ${
                analysisResult ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Final Result */}
      {step === 5 && (
        <div>
          {formData.human_voice && formData.matching_voice ? (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Verification Complete!</h3>
              <p className="mb-6">Your identity has been successfully verified.</p>
              <button
                onClick={() => navigate('/success')}
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">✗</div>
              <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
              <p className="mb-6">
                We couldn't verify your identity. Please contact support for assistance.
              </p>
              <button
                onClick={() => navigate('/face-recognition')}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Face recognition
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}