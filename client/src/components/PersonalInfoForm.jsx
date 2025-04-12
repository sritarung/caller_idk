import { useState } from "react";

export default function IterativeForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    lastFourDigits: "",
    zipCode: ""
  });
  const [error, setError] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const formSteps = [
    {
      fields: [
        {
          name: "firstName",
          label: "First Name",
          validate: (value) => value.trim() === "Franklin" ? "" : "First name is incorrect"
        },
        {
          name: "middleInitial",
          label: "Middle Initial",
          validate: (value) => value.trim() === "D" ? "" : "Middle initial is incorrect"
        },
        {
          name: "lastName",
          label: "Last Name",
          validate: (value) => value.trim() === "Roosevelt" ? "" : "Last name is incorrect"
        }
      ]
    },
    {
      fields: [
        {
          name: "lastFourDigits",
          label: "Last 4 Digits of Credit Card",
          validate: (value) => value.trim() === "1234" ? "" : "Please enter the valid 4 digits"
        }
      ]
    },
    {
      fields: [
        {
          name: "zipCode",
          label: "Zip Code",
          validate: (value) => value.trim() === "12345" ? "" : "Please enter the valid zip code (e.g., 12345)"
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const currentFields = formSteps[step].fields;
    let validationErrors = {};

    currentFields.forEach((field) => {
      const errorMsg = field.validate(formData[field.name]);
      if (errorMsg) {
        validationErrors[field.name] = errorMsg;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    if (step < formSteps.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const handleReset = () => {
    setStep(0);
    setFormData({
      firstName: "",
      middleInitial: "",
      lastName: "",
      lastFourDigits: "",
      zipCode: ""
    });
    setError({});
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-green-600">Form Submitted Successfully</h2>
        <div className="bg-gray-50 p-4 rounded">
          {Object.entries(formData).map(([key, val]) => (
            <p key={key} className="mb-2"><span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}</p>
          ))}
        </div>
        <button 
          onClick={handleReset}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  const currentFields = formSteps[step].fields;

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Personal Information</h2>

      {currentFields.map((field) => (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
          {error[field.name] && (
            <p className="text-red-500 text-sm mt-1">{error[field.name]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-between">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="ml-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {step === formSteps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          {formSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 mx-1 rounded-full ${
                index < step ? "bg-blue-500" :
                index === step ? "bg-blue-300" :
                "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
