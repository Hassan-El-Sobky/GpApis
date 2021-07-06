const courseModel = require('../models/course.model');
const addCoursee = require('express');
const addCourse = addCoursee();
const multer = require('multer')
const userModel= require('../models/user.model');
const jwt=require("jsonwebtoken");
const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        x=file.originalname.replace(/\s+/g, '');
      cb(null, Date.now()+x  )
    }
  })
  function fileFilter (req, file, cb) {
    let extension = file.mimetype;
    if(extension!="image/png"&&extension!="image/jpg"&&extension!="image/jpeg"&&extension!="image/webp"){
        cb(null,false);
    }
    else{
        cb(null , true);
    }   
  }

const courseImage = multer({dest:'uploads',storage , fileFilter });
addCourse.post('/addCourse',courseImage.single('courseImage'),async(req,res)=>{
    const {courseName, courseCode, courseDepartment, prerequisite, token , username}=req.body;
    console.log(req.file);
    jwt.verify(token ,"instructor" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error"});
        }
        else{
            const user = await userModel.findOne({username});
            if (user) {
                if(req.file===undefined){
                    res.json({message:"unsupportes file type"})
                }
                else{
                   // let pathh= req.file.path.replace('uploads/','');
                    //let imageUrl="http://lmsapis.herokuapp.com/"+pathh;
                    let courses = await courseModel.findOne({courseCode});
                    if (courses) {
                
                        res.json({message:"course code isn't available"});
                        console.log("notcode");
        
                    }
                    else{
                        console.log("asdqwrf"+req.file.path);
                        await courseModel.insertMany({courseName, courseCode, courseDepartment, prerequisite , instructorId:user._id , imageUrl:`http://localhost:3000/${req.file.path}`});
                        console.log("done");
                        let coursee = await courseModel.findOne({courseCode})
                        res.json({message:"Course Created",message2:coursee.imageUrl});
                    }
            }
            }
            else{
                res.json('incorrect instructor user name')
            }
           
    }  
    })
    //res.json('tamam')
})

addCourse.get('/insrtuctorCourses/:username',async (req,res)=>{
    const username= req.params.username;
    console.log(username);
            const instructorId = await userModel.findOne({username});
            console.log(instructorId._id);
            if(instructorId ){
                let instructorCourses = await  courseModel.find({instructorId:instructorId._id} );
                if ( instructorCourses){
                    res.json({instructorCourses});
                }
                else {
                    res.json({message:"wasn't created in any course"});
                }
            }
            else{
                res.json({message:"error in course or instructor id"});
            }

    
})
addCourse.get('/course/:courseId',async (req,res)=>{
    const _id = req.params.courseId;
    const course = await courseModel.findById({_id});
    if(course){
        res.json({course});
    }
    else{
        res.json({message:"no course"})
    }
})
addCourse.get('/searchCourse',async (req,res)=>{
    const searchKey = req.query.coursename;
    console.log(searchKey);
    const searchResult = await courseModel.find({$or:[{courseName:{$regex:searchKey , $options : 'i'}},{courseCode:{$regex:searchKey , $options : 'i'}},{courseDepartment:{$regex:searchKey , $options : 'i'}}]})
    res.json({searchResult});
})
module.exports=addCourse
