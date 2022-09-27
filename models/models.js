const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
  createdAt: {
    type: Number,
  },
});

const authModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
  },
});

var enu = {
  values: ["Completed", "InComplete"],
  message: `status should be Completed or InComplete `,
};

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
    required: [true, "Task Status is required"],
    enum: enu,
  },
});

const user = mongoose.model("user", userSchema);
const auth = mongoose.model("auth", authModel);
const task = mongoose.model("task", taskModel);
module.exports = { user, auth, task };
