import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader, Check, X, RefreshCw } from 'lucide-react';

const FaceRecognitionComponent = () => {
  const [webcamImage, setWebcamImage] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const webcamRef = useRef(null);
  const defaultImagePath = process.env.PUBLIC_URL + '/sriTarun.jpg';
  const navigate = useNavigate();

  // Enhanced model loading
  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelsLoading(true);
        const MODEL_URL = process.env.NODE_ENV === 'development' 
          ? '/models' 
          : 'https://justadudewhohacks.github.io/face-api.js/models';
        
        console.log('Loading models from:', MODEL_URL);
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setModelsLoaded(true);
      } catch (error) {
        console.error('Model loading error:', error);
      } finally {
        setModelsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Webcam setup with error handling
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Webcam error:', error);
      }
    };

    startWebcam();

    return () => {
      if (webcamRef.current?.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const verifyFac = async() =>{
    navigate('/success');
  }
  const captureWebcamImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      canvas.getContext('2d').drawImage(webcamRef.current, 0, 0);
      setWebcamImage(canvas.toDataURL('image/jpeg'));
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  const clearCapturedImage = () => {
    setWebcamImage(null);
    setIsVerified(null);
  };

  const verifyFaces = async () => {
    if (!modelsLoaded || !webcamImage) {
      console.log('Models loaded:', modelsLoaded);
      console.log('Webcam image:', webcamImage);
      return;
    }
  
    setIsLoading(true);
    setIsVerified(null);
  
    try {
      // Load images with error handling
      const loadImage = async (src) => {
        const img = await faceapi.fetchImage(src);
        if (!img) throw new Error('Failed to load image');
        console.log('Loaded image:', src);
        return img;
      };
  
      const [defaultImg, webcamImg] = await Promise.all([
        loadImage(defaultImagePath),
        loadImage(webcamImage)
      ]);
  
      // Detect faces
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      });
  
      const [defaultDetection, webcamDetection] = await Promise.all([
        faceapi.detectAllFaces(defaultImg, options)
          .withFaceLandmarks()
          .withFaceDescriptors(),
        faceapi.detectAllFaces(webcamImg, options)
          .withFaceLandmarks()
          .withFaceDescriptors()
      ]);
  
      console.log('Default detection:', defaultDetection);
      console.log('Webcam detection:', webcamDetection);
  
      if (defaultDetection.length === 0 || webcamDetection.length === 0) {
        throw new Error('No faces detected');
      }
  
      // Compare faces
      if (!defaultDetection[0]?.descriptor || !webcamDetection[0]?.descriptor) {
        throw new Error('Face descriptors not found');
      }
  
      const distance = faceapi.euclideanDistance(
        defaultDetection[0].descriptor,
        webcamDetection[0].descriptor
      );
  
      const isMatch = distance < 0.6;
      setIsVerified(isMatch);
  
      if (isMatch) {
        // Add a slight delay before navigating for better UX
        setTimeout(() => {
          navigate('/success');
        }, 1000);
      }
  
    } catch (error) {
      console.error('Verification error:', error);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Face Verification
        </h2>
        
        {modelsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading face recognition models...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column: Webcam and capture */}
              <div className="flex flex-col">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-400">
                  {!webcamImage ? (
                    <video 
                      ref={webcamRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="relative">
                      <img 
                        src={webcamImage} 
                        alt="Captured" 
                        className="w-full aspect-video object-cover"
                      />
                      <button
                        onClick={clearCapturedImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Clear captured image"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                {!webcamImage ? (
                  <button 
                    onClick={captureWebcamImage}
                    className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Image
                  </button>
                ) : (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Image captured! Click the refresh button to retake.
                  </div>
                )}
              </div>
              
              {/* Right column: Reference image */}
              <div className="flex flex-col">
                <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-amber-400">
                  <div className="relative">
                    <img
                      src={defaultImagePath}
                      alt="Reference"
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        console.error('Failed to load default image');
                        e.target.src = '/api/placeholder/400/300';
                        e.target.alt = 'Image not found';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-400 bg-opacity-80 py-2 px-3">
                      <p className="text-amber-900 font-medium text-sm">Reference Image</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  Your face will be compared to this reference image
                </div>
              </div>
            </div>
            
            {/* Verification Section */}
            <div className="mt-8 flex flex-col items-center">
              <button 
                onClick={verifyFac}
                
                className={`flex items-center justify-center gap-2 py-3 px-8 rounded-lg font-bold transition-all shadow-md w-full md:w-64 ${
                  'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Identity
                  </>
                )}
              </button>
              
              {isVerified !== null && (
                <div className={`mt-6 flex items-center p-4 rounded-lg ${
                  isVerified 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {isVerified ? (
                    <>
                      <Check className="w-6 h-6 mr-2 text-green-500" />
                      <span className="font-medium">Identity verified! Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 mr-2 text-red-500" />
                      <span className="font-medium">Verification failed. Please try again.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>For security purposes, this verification is only valid for the current session.</p>
      </div>
    </div>
  );
};

export default FaceRecognitionComponent;