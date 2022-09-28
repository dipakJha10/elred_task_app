const router = require("express").Router();
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const models = require("../models/models");
const constants = require("../utilities/constants");
const emailService = require("../utilities/email_config");
const emailContent = require("../utilities/emailTemplate");
const authService = require("../utilities/authServe");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = models.user;
const userAuthModel = models.auth;

// register user

router.post("/signUp", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      fullName: fullName,
      email: email,
      password: encryptedPassword,
    });
    res.status(200).json({
      status: httpStatus.OK,
      message: constants.constants.SUCCCESS_MSG,
      data: "user has been registered",
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

// user login with only email nd otp

router.post("/emailLogin", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const otp = crypto.randomInt(0, 1000000);
      const otpObj = {
        email: req.body.email,
        otp: otp,
      };
      let result = await userAuthModel.findOneAndUpdate(
        { email: req.body.email },
        otpObj,
        {
          new: true,
          upsert: true,
          rawResult: true, // Return the raw result from the MongoDB driver
        }
      );
      let mailObject = emailContent.emailContentCreation(
        user,
        "OTP sharing",
        otpObj
      );
      emailService.sendEmail(mailObject);
      res.status(200).json({
        status: httpStatus.OK,
        message: "PLease check your mail for the login OTP Code",
      });
    } else {
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.USER_NOT_EXISTS,
        data: null,
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

// user login Api with email and password

router.post("/passwordlogIn", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = await authService.signIn({
          email: req.body.email,
        });
        let data = {
          email: req.body.email,
          token: token,
        };

        const otp = crypto.randomInt(0, 1000000);
        // console.log(otp);

        const otpObj = {
          email: req.body.email,
          otp: otp,
        };
        console.log(otpObj);
        let result = await userAuthModel.findOneAndUpdate(
          { email: req.body.email },
          otpObj,
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );

        let mailObject = emailContent.emailContentCreation(
          user,
          "OTP sharing",
          otpObj
        );
        emailService.sendEmail(mailObject);
        res.status(200).json({
          status: httpStatus.OK,
          message: "PLease check your mail for the login OTP Code",
          data: data,
        });
      } else {
        res.status(200).json({
          status: httpStatus.OK,
          message: constants.constants.PASSWORD_MISMATCH,
          data: null,
        });
      }
    } else {
      res.status(200).json({
        status: httpStatus.OK,
        message: constants.constants.USER_NOT_EXISTS,
        data: null,
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

// user login with otp
router.get("/otpLogin", async (req, res) => {
  try {
    const otp = await userAuthModel.findOne({
      otp: req.body.otp,
    });
    const user = await userModel.findOne({
      email: otp.email,
    });
    if (!otp) {
      res.status(500).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: constants.constants.FORBIDDEN_MSG,
      });
    } else {
      const token = await authService.signIn({
        email: otp.email,
        userId: user._id,
      });
      let data = {
        token: token,
        expires_in: constants.authConstants.expires_in,
      };
      const auth_token = await userAuthModel.findOneAndUpdate(
        { email: otp.email },
        {
          token: token,
          isActive: true,
        },
        {
          new: true,
          upsert: true,
          rawResult: true, // Return the raw result from the MongoDB driver
        }
      );
      console.log(auth_token);
      res.status(200).json({
        status: httpStatus.OK,
        message: "You are successfully logged in",
        data: data,
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





module.exports = router;
