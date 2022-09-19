// mail templates for user services

let emailContentCreation = (user, notification, code) => {
  let finalObject = {};
  switch (notification) {
    case "OTP sharing":
      finalObject.subject = `OTP for the login to the system`;
      finalObject.text = `Hi ${user.fullName} Your login OTP code is in this mail. PLease don't share it with anyone
      Your OTP is Here ${code.otp}`
      finalObject.emailTo = user.email;
  }
  return finalObject;
};

module.exports = {
  emailContentCreation,
};
