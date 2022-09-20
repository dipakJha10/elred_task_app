const router = require("express").Router();
const httpStatus = require("http-status");
const models = require("../models/models");
const constants = require("../utilities/constants");
const taskModel = models.task;
const userAuthModel = models.auth;
const userModel = models.user;

// creating task

router.post("/task", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.query.email });
    console.log(user);
    const task = new taskModel({
      userId: user._id,
      task: req.body.task,
      status: req.body.status,
    });
    const newTask = await task.save();
    console.log(newTask);

    res.status(200).json({
      status: httpStatus.OK,
      message: constants.constants.SUCCCESS_MSG,
      data: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      data: null,
    });
  }
});

// editing task

router.patch("/editTask", async (req, res) => {
  try {
    const task = await taskModel.findOneAndUpdate(
      { userId: req.query.userId },

      req.body,
      { new: true }
    );
    console.log(task);
    res.status(200).json({
      status: httpStatus.OK,
      message: constants.constants.SUCCCESS_MSG,
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      data: null,
    });
  }
});

// delete task

router.delete("/deleteTask", async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({
      userId: req.body.userId,
    });
    console.log(task);
    res.status(200).json({
      status: httpStatus.OK,
      message: constants.constants.SUCCCESS_MSG,
      message:"task has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      data: null,
    });
  }
});

module.exports = router;
