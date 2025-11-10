const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    // Regex to validate email format
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6 // Enforce a minimum password length
  }
}, {
  // Automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true
});

// 2. Pre-save Hook: Hash password before saving
// This function will run *before* a new user document is saved to the DB
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document about to be saved

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a 'salt' to hash the password with
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);
  
  // Continue to the next step (saving the document)
  next();
});

// 3. Create and Export the Model
// Mongoose will create a collection named 'users' (pluralizes 'User')
const User = mongoose.model('User', userSchema);

module.exports = User;