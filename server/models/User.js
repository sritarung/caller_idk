const mongoose = require('mongoose');

// Helper function to check if password is strong (for admins)
const isStrongPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return regex.test(password);  // At least 8 characters, with uppercase and special characters
};

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(value) {
        // Check if the user is individual and username is a valid 10-digit phone number
        if (this.role === 'individual') {
          return /^\d{10}$/.test(value);  // 10-digit phone number check
        }
        // Admin username can be any unique string (already enforced by unique)
        return true;
      },
      message: 'Phone number must be a 10-digit number for individual users.'
    }
  },
  password: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(value) {
        if (this.role === 'individual') {
          // Password for individual should be a 5-digit number
          return /^\d{5}$/.test(value);  // 5-digit number check
        }
        // Password for admin should be strong (uppercase, special char, at least 8 chars)
        return isStrongPassword(value);
      },
      message: 'Password for individual users must be a 5-digit number and for admin, it must be at least 8 characters long with an uppercase letter and a special character.'
    }
  },
  role: { 
    type: String, 
    default: 'individual', 
    enum: ['individual', 'admin'] 
  }
});

module.exports = mongoose.model('User', UserSchema);
