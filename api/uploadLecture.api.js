const courseModel = require('../models/course.model');
const lectureModel = require('../models/lecture.model');
const userModel = require('../models/user.model')
const multer=require('multer');
const express = require('express');
const uploadLecture=express();
const path = require('path')
const jwt=require("jsonwebtoken");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/lectures/')
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

const lectures = multer({dest:'uploads/lectures',storage,fileFilter});
uploadLecture.post('/uploadLecture',lectures.single('lectureFile'),async(req,res,next)=>{
    const {title , uploadDate , description , courseCode , token , username} =req.body
    jwt.verify(token , "instructor" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error in token"});
        }
        else{
            console.log(req.file);
            if(req.file===undefined){
                   res.json({message:"unsupported file type"})
                }
            else {
           // let pathh= req.file.path.replace('uploads/','');
            //const fileUrl = "http://lmsapis.herokuapp.com/"+pathh;
            const user = await userModel.findOne({username});
            if (user) {
                const course = await courseModel.findOne({courseCode , instructorId:user._id});
                if(course){
                    await lectureModel.insertMany({title , uploadDate , description , courseId:course._id , fileUrl:`http://localhost:3000/${req.file.path}` });
                    res.json({message:'done' , message2:req.file})

                }
                else
                {
                    res.json({message : "unavailable course"})
                }
            }
            else {
                res.json({message:"incorrect instructor user name"})
            }
            }
        }
    })
   
})

uploadLecture.get('/alluploads',async(req,res)=>{
    const uploadd = await lectureModel.find({})
    res.json({uploadd});
})

uploadLecture.get('/allLectures/:courseId',async(req,res)=>{
    let _id = req.params.courseId;
    let course = await courseModel.findOne({_id});
    let lectures = await lectureModel.find({courseId:course._id});
    res.json({lectures});
})
uploadLecture.delete('/deleteLecture/:lectureId',async(req,res)=>{
    let _id=req.params.lectureId;
    const {token , username , courseId}=req.body;
    jwt.verify(token , "instructor" , async(err, decodded)=>{
        if(err){
            res.json({message:'there is error in token'});
            console.log("error");
        }
        else
        {
            let instructor = await userModel.findOne({username});
            if (instructor) {
                let course = await courseModel.findOne({ _id:courseId ,instructorId:instructor._id})
                if ( course ){
                    let deletedLecture = await lectureModel.findOne({_id , courseId:course._id})
                    await lectureModel.deleteOne({_id , courseId:course._id});
                    res.json({message:`lecture  ${deletedLecture.title} Deleted`});
                }
                else {
                    res.json({message:"you haven't acces to delete this lecture"})
                }
            }
            else {
                res.json({message:"invalid instructor username"});
            }

        }
    })  
})
module.exports=uploadLecture;
