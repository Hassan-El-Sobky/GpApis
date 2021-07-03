const signin = require('express').Router()
const userModel=require('../models/user.model')
const {check , validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt=require("jsonwebtoken")
signin.post('/signin',async(req,res)=>{
    //res.json({messge:'signin'})
    const {email , password} = req.body
    let user = await userModel.findOne({email:email.toLowerCase()})
    if (user){
        const match = await bcrypt.compare(password, user.password); 
        if(match){
            //console.log(typeof(user._id));
            let token
            res.role=user.role;
            if(user.role==='student'){
                token = jwt.sign({role:'student' , username : user.username  },"student")
            }
            else if (user.role==='admin'){
                token = jwt.sign({role:'admin' , username : user.username  },"admin")
            }
            else if (user.role==='instructor'){
                token = jwt.sign({role:'instructor' , username : user.username  },"instructor")
            }
            res.json({uname:user.username, token , message:user.role ,message2:user.imageUrl})
        }
        else{
            res.json({message:"login failed",status:"Password inCorrect",})
        }
    }
    else{
        res.json({message:"login failed",status:"mail inCorrect",})
    }
   // console.log(res.role);
})


module.exports=signin
