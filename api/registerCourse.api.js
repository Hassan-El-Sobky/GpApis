const courseModel = require('../models/course.model');
const registerCourse = require('express').Router();
const studentCourseModel = require('../models/studentCourse.model');
const userModel = require("../models/user.model");
const assesmentModel = require('../models/assesment.model')
const jwt=require("jsonwebtoken");
registerCourse.post('/registerCourse',(req,res)=>{
    const {username ,token, courseCode}=req.body;
    jwt.verify(token , "student" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error"});
        }
        else{
            const userid = await userModel.findOne({username:username});
            const courseid = await courseModel.findOne({courseCode:courseCode});
            console.log(userid);
            if(userid && courseid){
                await studentCourseModel.insertMany({userID:userid._id, courseId:courseid._id})
                res.json({message:"done"})
       }
            
            else{
                res.json({message:"error in course or student id"});
            }

        }
    })
    
})
registerCourse.get('/studentcourses/:username',async (req,res)=>{
    const username= req.params.username;
    console.log(username);
            const userId = await userModel.findOne({username});
            console.log(userId._id);
            if(userId ){
                let studentCourseid = await  studentCourseModel.find({userID:userId._id} );
                console.log(studentCourseid.length);
                let studentCourses =[];
                
                for (let i = 0; i < studentCourseid.length; i++) {
                   studentCourses.push(await courseModel.findOne({_id:studentCourseid[i].courseId}));   
                }
                 
                if ( studentCourses){
                    res.json({studentCourses});
                }
                else {
                    res.json({message:"not enrolled in any course"});
                }
            }
            else{
                res.json({message:"error in course or student id"});
            }

    
})
registerCourse.get('/courseStudents/:id',async(req,res)=>{
    try {
        const _id=req.params.id;
        const courseStudent = await studentCourseModel.find({courseId:_id});
        let courseStudents =[];
        for (let i = 0; i < courseStudent.length; i++) {
            courseStudents.push(await userModel.findOne({_id:courseStudent[i].userID},{_id:1 , username:1 , role:1}));
        }
        res.json({courseStudents})
    } catch (error) {
        res.json({messsage:error});
    }

})
registerCourse.post('/grade/:username',async(req,res)=>{
    const studentUserName = req.params.username;
    let {grades,assesmentId } = req.body ;
          let student = await userModel.findOne({username:studentUserName});
          let assesment = await assesmentModel.findOne({_id:assesmentId})
          console.log(assesment);
          let course = await courseModel.findOne({_id:assesment.courseId})
          let studentCourse =await studentCourseModel.findOne({userID:student._id , courseId:course._id});
                let studentGrades=[]
                let temp
                if(studentCourse.grades){
                    for (let i = 0; i < studentCourse.grades.length; i++) {
                        temp = (studentCourse.grades[i].assesmentId===grades.assesmentId);
                        if(temp){console.log(grades.assesmentId);
                        }
                    } 
                    console.log(temp);
                    if(temp){
                            res.json({message:"you can't add different grade to the same exam"})
                    }
                    else{
                        studentCourse.grades.push(grades);
                        await studentCourseModel.updateOne({userID:student._id , courseId:course._id},{userID:studentCourse.userID,
                        courserId:studentCourse.courseId , grades:studentCourse.grades})}
                        res.json({message:"grade added"})
                }
                else{
                    await studentCourseModel.updateOne({userID:student._id , courseId:course._id},{userID:studentCourse.userID,
                        courserId:studentCourse.courseId , grades});
                        console.log(studentGrades);
                        res.json({message:"grade added"});
                }

            
        
})

module.exports=registerCourse;
