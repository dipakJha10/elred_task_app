const jsonwebtoken = require("jsonwebtoken");
const constants = require("../utilities/constants");
const httpStatus = require("http-status");
const models = require("../models/models");

const userAuthModel = models.auth;
const signIn = async (signedUser) => {
  const token = await jsonwebtoken.sign(
    signedUser,
    constants.authConstants.secret_key,
    {
      expiresIn: constants.authConstants.expires_in,
    }
  );

  return token;
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res
      .status(403)
      .send({ status: httpStatus.FORBIDDEN, message: "Access Denied" });
  }
};

const tokenValidation = (req, res, next) => {
  jsonwebtoken.verify(
    req.token,
    constants.authConstants.secret_key,
    async (err, authData) => {
      if (err) {
        res.status(403).send({
          status: httpStatus.FORBIDDEN,
          message: constants.constants.FORBIDDEN_MSG,
          err: err,
        });
      } else {
        let tokenData = parseJwt(req.token);
        const authdata = await userAuthModel.findOne({
          email: tokenData.email,
          isActive: true,
        });
        if (authdata) {
          next();
        } else {
          res.status(403).send({
            status: httpStatus.LOGIN_TIME_OUT,
            message: "user has been logout",
            err: err,
          });
        }
      }
    }
  );
};

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
module.exports = {
  signIn,
  verifyToken,
  tokenValidation,
};
