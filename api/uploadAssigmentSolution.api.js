const assigmentModel = require('../models/assigment.model');
const assigmentSolutionModel = require('../models/assigmentSolution.model');
const userModel = require('../models/user.model');
const studentCourseModel = require('../models/studentCourse.model');
const multer=require('multer');
const express = require('express');
const uploadAssigmentsSolution=express();
const jwt=require("jsonwebtoken");
const moment = require('moment');
const courseModel = require('../models/course.model');  
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/assigmentsSolution/')
    },
    filename: function (req, file, cb) {
        x=file.originalname.replace(/\s+/g, '');
      cb(null, Date.now()+x  )
    }
  })
  function fileFilter (req, file, cb) {
    let extension = file.mimetype;
    if(extension!="text/csv"&&extension!="application/pdf"&&extension!="application/msword"&&
       extension!="application/vnd.openxmlformats-officedocument.wordprocessingml.documentx"&&extension!="application/vnd.ms-powerpoint"&&
       extension!="application/vnd.openxmlformats-officedocument.presentationml.presentation"&&
       extension!="application/zip"&&extension!="application/vnd.ms-excel"&&extension!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      &&extension!="text/plain"&&extension!="application/vnd.rar"){
        cb(null,false);
    }
    else{
        cb(null , true);
    }   
  }
const assigmentsSolution = multer({dest:'uploads/assigmentsSolution/',storage,fileFilter});
uploadAssigmentsSolution.post('/uploadassigmentsSolution',assigmentsSolution.single('assigmentSolutionFile'),async (req,res)=>{
    const {username,additionPoint,assigmentCode,token, courseCode} =req.body
    jwt.verify(token , "student" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error in token"});
        }
        else{
            //console.log(req.file);
            if(req.file===undefined){
                 res.json({message:"unsupported file type"})
                }
            else{
            //let pathh= req.file.path.replace('uploads/','');
            //const fileUrl = "http://lmsapis.herokuapp.com/"+pathh;
            const user = await userModel.findOne({username});
            const course = await courseModel.findOne({courseCode});
            if(course){
                const studentCourse = await studentCourseModel.findOne({userID:user._id,courseId:course._id});

                if(studentCourse){
                    const assigment = await assigmentModel.findOne({assigmentCode , courseId: studentCourse.courseId});

                    if (assigment) {
                        const solution = await assigmentSolutionModel.findOne({userId:user._id , assigmentId:assigment._id});
                        console.log(solution);
                      if(solution){
                           res.json({message:"you can't upload second solution  , thankYou"});
                        }
                        else{
                            let d = new Date();
                            let momentDate = moment(d).format("YYYY-MM-DDTHH:MM");
                            console.log("momentDate : "+momentDate);
                            console.log("deadline : "+assigment.deadLine);
                            let test = moment(momentDate).isBetween(assigment.uploadDate,assigment.deadLine);
                            if(test){
                            await assigmentSolutionModel.insertMany({userId:user._id , additionPoint , assigmentId:assigment._id , fileUrl:`http://localhost:3000/${req.file.path}` });
                            res.json({message:'done' , message2:req.file}) }
                            else {
                                res.json({message:"upload closed"})
                            }
                        }
                    }
                else
                {
                    res.json({message : "you can't access this course"})
                }
            }
            else{
                res.json({message:"incorrect courseCode"})
            }

            }
        }
        }
    })
})

uploadAssigmentsSolution.get("/allStudentAssigments/:id/:courseid",async(req,res)=>{
    let userId = req.params.id;
    let courseId= req.params.courseid;
    let user = await userModel.findOne({_id:userId});
    let courseAssigments= await assigmentModel.find({courseId})
    let solutions=[];
    for (let i = 0; i < courseAssigments.length; i++) {
         solutions.push({assigmentTitle : courseAssigments[i].title , username:user.username , solution: await assigmentSolutionModel.find({userId ,assigmentId: courseAssigments[i]._id}) })
    }
    res.json({solutions})
})
module.exports=uploadAssigmentsSolution;
