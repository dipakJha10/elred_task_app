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
    const bearerHeader = req.headers["authorization"];
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    console.log(bearerToken);
    let tokendata = parseJwt(bearerToken);
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
    const task = await taskModel.findByIdAndUpdate(req.body.task_id, req.body, {
      new: true,
      runValidators: true,
    });
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
      error: error.message,
    });
  }
});

// delete task

router.delete("/deleteTask", async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete(req.body.task_id);
    if (task) {
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.SUCCCESS_MSG,
      });
    } else {
      res.status(200).json({
        status: httpStatus.OK,

        message: "specified task is not there",
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

router.get("/fecthTask", async (req, res) => {
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

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

module.exports = router;
