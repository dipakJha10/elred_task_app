const constants = {
  SUCCCESS_MSG: "Request Successfull..!!",
  FORBIDDEN_MSG: "Not Authorized..!!",
  FAILURE_MSG: "Request Failed..!!",
  AUTHORIZATION_SUCCESS_MESSAGE: "Login successFull..!!",
  PASSWORD_MISMATCH: "Username password does Not match..!!",
  USER_NOT_EXISTS: "User does not exist..!!",
  TASK_DOES_NOT_EXITS: "Specified task is not there",
};

const authConstants = {
  secret_key: "1234567890",
  expires_in: "1h",
};


module.exports = {
  constants,
  authConstants
};
