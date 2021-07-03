const userModel=require('../models/user.model')
const jwt=require("jsonwebtoken");
const courseModel = require('../models/course.model');
const admin = require('express').Router();
admin.get('/allStudents',async(req,res)=>{
   
            let numOfStudent = await userModel.count({role:"student"});
            let allStudents = await userModel.find({role:"student"});
            if(allStudents)
            {
                res.json({allStudents,numOfStudent});
            }
            else
            {
                res.json({message:"noStudents"});
            }
   
})
admin.get('/allInstructors',async(req,res)=>{
    let numOfInstructors = await userModel.count({role:"instructor"});
    let allInstructors = await userModel.find({role:"instructor"});
    if(allInstructors)
    {
        res.json({allInstructors , numOfInstructors});
    }
    else
    {
        res.json({message:"NO Instructors"});
    }

})
admin.get('/allCourses',async(req,res)=>{
    
    let numOfCourses = await courseModel.count({});
    let allCourses = await courseModel.find({});
        if(allCourses){
            res.json({allCourses , numOfCourses});
        }
        else{
            res.json({message:"therei is No courses"})
        }


})
admin.patch('/enableCourse/:id',async (req,res)=>{
  const {state , token}=req.body;
  jwt.verify(token, "admin" , async(err, decodded)=>{
    if(err){
        res.json({message:'there is error in token'});
    }
    else{

        await courseModel.updateOne({_id:req.params.id},{$set:{state}});
        res.json({message:"enable course success"})
    }

})
})
admin.get('/allPendingCourses',async(req,res)=>{
    let numOfPendingCourses = await courseModel.count({state:"pending"});
    let allPendingCourses = await courseModel.find({state:"pending"});
        if(allPendingCourses){
            res.json({allPendingCourses , numOfPendingCourses});
        }
        else{
            res.json({message:"therei is No pending courses"})
        }

})
admin.get('/allAvailableCourses',async(req,res)=>{
    let numOfAvailableCourses = await courseModel.count({state:"available"});
    let allAvailableCourses = await courseModel.find({state:"available"});
        if(allAvailableCourses){
            res.json({allAvailableCourses , numOfAvailableCourses});
        }
        else{
            res.json({message:"therei is No Avaialable courses"})
        }

})
module.exports=admin