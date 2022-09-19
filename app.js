const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userApi = require("./api/signUp");
const taskApi = require("./api/task");
const db = require("./db/db");
const authService = require("./utilities/authServe");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send({
    status: "ON",
    message: "Api service is running!!",
  });
});

app.use("/api/", userApi);

app.use(authService.verifyToken, function (req, res, next) {
  authService.tokenValidation(req, res, next);
});

app.use("/api/", taskApi);

app.listen(process.env.PORT || 8888, () => {
  console.log("server is up at 8888");
});
