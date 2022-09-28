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
    let tokendata = parseJwt(req.token);
    console.log(tokendata);

    const task = new taskModel({
      userId: tokendata.userId,
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
      error: error.message,
    });
  }
});

// editing task

router.patch("/editTask", async (req, res) => {
  try {
    const token = parseJwt(req.token);
    const taskData = await taskModel.findById(req.body.task_id);
    if (taskData.userId === token.userId) {
      const task = await taskModel.findOneAndUpdate(
        req.body.task_id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      console.log(task);
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.SUCCCESS_MSG,
        data: task,
      });
    } else {
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.FAILURE_MSG,
        error: "Not Authorised, task is woned by other user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      error: error.message,
    });
  }
});

// delete task

router.delete("/deleteTask", async (req, res) => {
  try {
    const token = parseJwt(req.token);
    const taskData = await taskModel.findById(req.body.task_id);
    if (taskData.userId === token.userId) {
      const task = await taskModel.findByIdAndDelete(req.body.task_id);
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.SUCCCESS_MSG,
      });
    } else {
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.FAILURE_MSG,
        error: "Not Authorised, task is owned by other user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      data: null,
    });
  }
});

// view all tasks

router.get("/fetchTask", async (req, res) => {
  try {
    let result;
    if (req.query.userId) {
      result = await taskModel.find({
        userId: req.query.userId,
      });
    } else {
      let offset;
      let limit;
      if (req.query.pageNo && req.query.perPage) {
        req.query.perPage = parseInt(req.query.perPage);
        req.query.pageNo = parseInt(req.query.pageNo);
        offset = req.query.perPage * (req.query.pageNo - 1);
        limit = req.query.perPage;
      } else {
        offset = 0;
        limit = 20;
      }
      result = await taskModel.find({}).skip(offset).limit(limit);
    }
    res.status(200).json({
      status: httpStatus.OK,
      message: constants.constants.SUCCCESS_MSG,
      data: result,
      count: result.length,
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

// logout api

router.post("/logout", async (req, res) => {
  try {
    const token = parseJwt(req.token);
    const acess_token = await userAuthModel.findOneAndUpdate(
      token.email,
      {
        isActive: false,
      },
      {
        new: true,
        upsert: true,
        rawResult: true, // Return the raw result from the MongoDB driver
      }
    );
    res.status(200).json({
      status: httpStatus.LOGIN_TIME_OUT,
      message: constants.constants.FORBIDDEN_MSG,
      data: "User has been logout",
    });
  } catch (eror) {
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: constants.constants.FAILURE_MSG,
      data: null,
    });
  }
});

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

module.exports = router;
