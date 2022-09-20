const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
  },
  createdAt: {
    type: Number,
  },
});

const authModel = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
  },
});

const taskModel = new mongoose.Schema({
  userId: {
    type: String,    
  },
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);
const auth = mongoose.model("auth", authModel);
const task = mongoose.model("task", taskModel);
module.exports = { user, auth, task };
