const assigmentModel = require('../models/assigment.model');
const courseModel = require('../models/course.model');
const userModel=require('../models/user.model')
const multer=require('multer');
const express = require('express');
const uploadAssigments=express();
const jwt=require("jsonwebtoken");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/assigments/')
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
const assigments = multer({dest:'uploads/assigments/',storage,fileFilter});

uploadAssigments.post('/uploadassigments',assigments.single('assigmentFile'),async (req,res)=>{
    const {title,deadLine,description,assigmentCode,courseCode,token , username} =req.body
    jwt.verify(token , "instructor" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error in token"});
        }
        else{
            console.log(req.file);
            if(req.file===undefined){
                 res.json({message:"unsupported file type"})
              }
            else{
            //let pathh= req.file.path.replace('uploads/','');
            //const fileUrl = "http://lmsapis.herokuapp.com/"+pathh;
            const user = await userModel.findOne({username})
            if (user) {
                const course = await courseModel.findOne({courseCode , instructorId : user._id});
                if(course){
                    const assigment = await assigmentModel.findOne({assigmentCode , courseCode});
                    //console.log(assigmentsss);
                    if(!assigment){
                        await assigmentModel.insertMany({title , deadLine , description , assigmentCode,courseId:course._id , fileUrl:`http://localhost:3000/${req.file.path}` });
                        
                        res.json({message:'done', message2:req.file})
                    }
                    else{
    
                        res.json({message:'reserver Code'});
                    }
                }
                else {
                    res.json({message:"unavailable course"})
                }

            }
            else{
                res.json({message:"incorrect instructor user name"})
            }
            }

        }
    })
})

uploadAssigments.get('/allAssigment/:courseId',async (req,res)=>{
    let _id = req.params.courseId;
    const course = await courseModel.findOne({_id});
    const assigments = await assigmentModel.find({courseId:course._id});
    res.json({assigments});
}) ; 
uploadAssigments.delete('/deleteAssigment/:assigmentId' , async (req,res)=>{
    let _id = req.params.assigmentId;
    const {token , username , courseId} = req.body;
    jwt.verify(token , 'instructor' , async(err , decodded)=>{
        if(err){
            res.json({message:"error in token"});
        }
        else {
            let instructor = await userModel.findOne({username});
            if(instructor){
                let course = await courseModel.findOne({_id:courseId , instructorId:instructor._id});
                if(course ){
                    let deletedAssigment = await assigmentModel.findOne({_id , courseId:course._id});
                    await assigmentModel.deleteOne({_id , courseId:course._id});
                        res.json({message : `Assigment ${deletedAssigment.title} deleted`})
                }
                else{
                    res.json({message:"you haven't acces to delete this assigment"})
                }
            }
            else{
                res.json({message:"invalid instructor username"})
            }
        }
    })
})
module.exports=uploadAssigments;
