const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors = require('cors');
const path=require('path')
const port=3000;
app.use(express.json());
const signup = require('./api/signup.api');
const signin = require('./api/signin.api');
const addCourse = require('./api/addCourse.api');
const registerCourse=require('./api/registerCourse.api');
const removeCourse = require("./api/removeCourse.api");
const removeUser=require("./api/removeUser.api");
const adminDashBoard=require('./api/admin.dashboard.api');
const uploadLecture = require('./api/uploadLecture.api');
const uploadAssigment = require('./api/uploadAssigment.api');
const uploadAssigmentsSolution = require('./api/uploadAssigmentSolution.api');
const assesment = require('./api/assesment.api');
const userProfile = require('./api/userProfile.api');
const editUser = require('./api/editUser.api')
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors());
app.use(signup);
app.use(signin);
app.use(addCourse);
app.use(registerCourse);
app.use(removeCourse);
app.use(removeUser);
app.use(adminDashBoard);
app.use(uploadLecture);
app.use(uploadAssigment);
app.use(uploadAssigmentsSolution);
app.use(userProfile);
app.use(assesment);
app.use(editUser);
app.get('/',(req,res)=>{
    res.json({message:'hello'});
})
mongoose.connect('mongodb+srv://admin:admin@cluster0.vk4zz.mongodb.net/GP',{useNewUrlParser:true , useUnifiedTopology:true});
app.listen(process.env.PORT || port,()=>{
    console.log('Bsm Allah');
})
//mongodb+srv://admin:admin@cluster0.vk4zz.mongodb.net/GP
