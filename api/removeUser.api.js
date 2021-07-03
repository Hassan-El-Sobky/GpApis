const userModel=require('../models/user.model');
const removeUser=require("express").Router();
const jwt = require('jsonwebtoken');
removeUser.delete('/removeUser/:id',async(req,res)=>{
    const {token}=req.body;
    jwt.verify(token, "admin" , async(err, decodded)=>{
        if(err){
            res.json({message:'there is error'});
        }
        else{

            await userModel.deleteOne({_id:req.params.id});
            res.json({message:'userDeleted'});
        }

    })
})
module.exports=removeUser;
