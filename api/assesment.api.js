const courseModel = require('../models/course.model');
const assesment = require('express').Router();
const studentCourseModel = require('../models/studentCourse.model');
const userModel = require("../models/user.model");
const assesmentModel = require('../models/assesment.model')
const jwt=require("jsonwebtoken");
const moment = require('moment');
assesment.post('/createAssesment',async(req,res)=>{
    const {openDate , dueDate , category ,courseId , fullMark ,questions , token , username,title} = req.body;
    jwt.verify(token ,"instructor" ,async (err, decodded)=>{
        if(err){
            res.json({message:"error in token"})
        }
        else{
            let instructorCourse = await userModel.findOne({username})
            if(instructorCourse){
                let course = await courseModel.findOne({_id:courseId , instructorId:instructorCourse._id});
                if(course){
                    const assesment = await assesmentModel.findOne({courseId:course._id , title});
                    if(assesment){
                        res.json({message:"please enter another title"})
                    }
                    else{
                        await assesmentModel.insertMany({openDate , dueDate, category ,courseId, fullMark , questions,title});
                        res.json({message:"done"})
                    }
                }
                else
                {
                    res.json({message:"invalidCourse"})
                } 
            }
            else{
                res.json({message:"invalid username"})
            }

    }
    })  
})
assesment.get("/solveAssesment/:assesmentId/:username", async(req,res)=>{
    let _id = req.params.assesmentId;
    let username = req.params.username;
    let student = await userModel.findOne({username});
    let studentCourse = await studentCourseModel.findOne({userID:student._id})
    const d = new Date();
    let momentDate = moment(d).format("YYYY-MM-DDTHH:MM")
    console.log(`momentDate:${momentDate}`);
    const assesment = await assesmentModel.findOne({_id })
    console.log(`duedate : ${assesment.dueDate}`);
    //let range = moment().range(assesment.openDate , assesment.dueDate);
    let test = moment(momentDate).isBetween(assesment.openDate,assesment.dueDate)
    console.log(test);
    if(test){
        let temp = false ;
        for (let i = 0; i < studentCourse.grades.length; i++) {
            if ( studentCourse.grades[i].assesmentId == _id)
            {
                temp = true 
                break;
            }
        }
        if(temp){
            res.json({message:"you can't Enter exam again"})
        }
        else{
            res.json({assesment , open:true});         
        }
    }
    else {
        res.json({message:"exam closed" , open:false})
    }
     
})
assesment.delete("/deleteAssesment/:assesmentId",async(req,res)=>{
    const {username , token} = req.body;
    jwt.verify(token , "instructor" , async(err,decodded)=>{
        if(err){
            res.json("error in token");
        }
        else{
            let _id = req.params.assesmentId;
            const assesment = await assesmentModel.findOne({_id })
            const instructor = await userModel.findOne({username});
            if(instructor){
                const course = await courseModel.findOne({_id:assesment.courseId , instructorId:instructor._id});
                if(course){
                    await assesmentModel.deleteOne({_id});
                    res.json({message:`assesment ${assesment.title} deleted`});
                }
                else{
                    res.json({message:"you haven't acces to this exam"})
                }
            }
            else{
                res.json({message:"invalid username"})
            }

        }
    })
})
assesment.get('/courseExams/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseExams = await assesmentModel.find({courseId ,category:"exam"});
    const d = new Date()
    let momentDate = moment(d).format("YYYY-MM-DDTHH:MM")
    console.log(`momentDate:${momentDate}`);
    const assesment = await assesmentModel.find({});
    let exams = []
    for (let i = 0; i < courseExams.length; i++) {
        let test = moment(momentDate).isBetween(courseExams[i].openDate,courseExams[i].dueDate)
        //console.log(test);
        var temp = {assesment:courseExams[i],open:test};
        console.log(temp);
        exams.push(temp);
    }
    if(exams[0]){
        res.json({exams});
        
    }
    else{
        res.json({message : "there is no  Exams for this course"})
    }

})
assesment.get('/allAssesments',async(req,res)=>{
    const d = new Date()
    let momentDate = moment(d).format("YYYY-MM-DDTHH:MM")
    console.log(`momentDate:${momentDate}`);
    const assesment = await assesmentModel.find({});
    let assesments = []
    for (let i = 0; i < assesment.length; i++) {
        let test = moment(momentDate).isBetween(assesment[i].openDate,assesment[i].dueDate)
        //console.log(test);
        var temp = {assesment:assesment[i],open:test};
        console.log(temp);
        assesments.push(temp);
    }
    if(assesments[0]){
        res.json({assesments})
    }
    else{
        res.json({message:"there is no assesments "})
    }
    
})
assesment.get('/courseExams/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseExams = await assesmentModel.find({courseId ,category:"exam"});
    if(courseExams[0]){
        res.json({courseExams});
    }
    else{
        res.json({message : "there is no  Exams for this course"})
    }

})
assesment.get('/courseQuizes/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseQuizes = await assesmentModel.find({courseId ,category:"quiz"});
    const d = new Date()
    let momentDate = moment(d).format("YYYY-MM-DDTHH:MM")
    console.log(`momentDate:${momentDate}`);
    const assesment = await assesmentModel.find({});
    let quizzes = []
    for (let i = 0; i < courseQuizes.length; i++) {
        let test = moment(momentDate).isBetween(courseQuizes[i].openDate,courseQuizes[i].dueDate)
        //console.log(test);
        var temp = {assesment:courseQuizes[i],open:test};
        console.log(temp);
        quizzes.push(temp);
    }
    if(quizzes[0]){
        res.json({quizzes});
    }
    else{
        res.json({message : "there is no Quizes for this course"})
    }

})


module.exports=assesment;
