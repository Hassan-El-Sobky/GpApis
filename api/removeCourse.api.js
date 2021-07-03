const courseModel = require('../models/course.model');
const removeCourse = require('express').Router();
const jwt=require("jsonwebtoken");
removeCourse.delete('/removeCourse/:id',async(req,res)=>{
    const {token}=req.body;
    jwt.verify(token , "admin" , async(err, decodded)=>{
        if(err){
            res.json({message:'there is error in token'});
            console.log("error");
        }
        else
        {
            
            await courseModel.deleteOne({_id:req.params.id});
            res.json({message:'course Removed'});
            console.log('done');
            
        }
    })
})
module.exports=removeCourse;
