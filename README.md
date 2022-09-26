# elred_task_app

# Title: elred app 

# Description:  

This app is about user creating and managing daily task. App has the features of register user, login via email password, login via email and otp and it is authenticated by jwt validation. 

# steps and scenarios:

1. Registering User:- User can create account by registering their fullName, emailId and password. EndPoint:- api/signUp.js


2. Login By Credential:- Then user can login into their account by their login credential that is their email and password. When they try to login with their credential if their creadential matches with stored data in the db then it will generate an otp and send to their respective emails. Then user can check their email for the OTP to login to the app.
EndPoint:- api/passwordlogIn

3. login by OTP:- Once they send request with OTP by login with otp api, api will check the for the same otp into the db, when OTP matches then it will send the response that user successfully login and then the bearer token has been generated that user can use for the authentication purpose in the postman.
EndPoint:- api/emailLogin


4.  The upper scenario is in the case of when user is try to logging in with email and password.And in this case I don't think we need an otp for login. But as per the requirement of the task I have build that one. 

5. Login by EmailId and Otp:- So in the convential way where user can try to logIn with its email id only then the One time password must be used for the login service. So for that I have bult an separate api where user can login with email id and the generated api. So in this way I have covered both cases and scenario. One is that this task has requirement and the other one is the conventional way of the OTP generation.
EndPoint:- api/otpLogin


6. Creating Task:- Then once a user logged in they can create their task for which I have built a post api where user need to just post their task and status of the task. And it will store it into the the db.  And one more thing for the task verfication, like which user has created which task I have used the object Id of the document of the register user that also has been saved in the task document collection. So when the user requests by sending query in the with the email, it searches the user is geniune or not or it present in our db or not. If it is there then it take the information that is requested by the json object body and creates the task.
EndPoint:- api/task

5. Editing task:- For editing the task , a patch api need to be build. User can edit their task on the basis of their task_ID that is the object id of that particular task.
EndPoint:- api/editTask

6. Delete Task:- For the deleting a task user just need to send the task_Id in the object body as an request for deleting the task. It will delete the task completely from the app.
EndPoint:- api/deleteTask

7. For the deployment I have used the heroku that is online platform for the app and website hosting. 
Url of the heroku app is :- https://mysterious-reef-81155.herokuapp.com/

8. one Get Api has been added for view tasks for the particular userID and userId as not been passed then view all the tasks.

9. Stacks Used: Nodejs, express, mongoDB,Mongoose, JWT , Heroku, Postman for the the testing. 


#Note: For the authentication session I have set the default value 30sec , But for the api testing we can increase the timing of the session in constants.js file in that is in the utiliies folder.



















