import mongoose from 'mongoose';
import { EMAIL_REGEX } from '../utils/regex.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
 email: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  match: [EMAIL_REGEX, 'Please fill a valid email address'],
  unique: [true, 'Email already exists']
 },
 name: {
  type: String,
  required: [true, 'Name is required for creating account'],
  trim: true,
  minlength: [3, 'Name must be atleast 3 characters long'],
  maxlength: [50, 'Name must not exceed 50 characters'],
 },
 password: {
  type: String,
  required: [true, 'Password is required for creating account'],
  trim: true,
  minlength: [6, 'Password must be at least 6 characters long'],
  maxlength: [100, 'Password must not exceed 100 characters'],
  select: false, // exclude password from query results by default till we explicitly selects it for auth
 },
}, {
 timestamps: true //automatically adds createdAt and updatedAt fields to schema
})


// pres save hook to hash password before saving user document to database
userSchema.pre("save", async function () {
 if (!this.isModified("password")) {
  return; // if passsword is not modified skip hashing and move to next middleware
 }

 const hashPassword = await bcrypt.hash(this.password, 10);
 this.password = hashPassword;

 return;
})

//hashing password - It is important to hash passwords before storing them in database to enhance security and protect user data in case of a data breach. Hashing transforms the password into a fixed length string of characters that is not reversible, making it difficult retrieve original password. Prevents unauthorized access to user accounts.

userSchema.methods.comparePassword = async function(password){
return bcrypt.compare(password, this.password); 
// compares the password and passord hash stored in database
}

const userModel = mongoose.model('User', userSchema);
export default userModel;