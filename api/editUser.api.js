const server = require('express').Router();
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check,validationResult} = require('express-validator')
server.put('/userEdit',/*check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),*/
check('rePassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        return false
    }
    return true;
})
,async(req,res)=>{
    const {oldUserName,username, oldPassword,password,rePassword,token}=req.body;
    console.log(password);
    const errors = validationResult(req);
    
    const user = await userModel.findOne({username:oldUserName});
    const match = await bcrypt.compare(oldPassword, user.password);
    try {
        jwt.verify(token ,"student" ,async (err, decodded)=>{
            if(err){
                res.json({message:"there is error"});
            }
            else{
               if(match){
                   if(errors.isEmpty()==true){
                       let user1 = await userModel.findOne({username})
                       if(user1){
                           res.json("user exist")
                       }else{
                            if (password) {
                                check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                                bcrypt.hash(password, 4, async (err, hash)=> {
                                    if (username) {
                                    await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:username}});
                                    res.json('updated');   
                                    }
                                    else{
                                        await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:oldUserName}});
                                        res.json('updated'); 
                                    }

                                });   
                            }
                            else {

                                bcrypt.hash(oldPassword, 4, async (err, hash)=> {
                                    if (username) {
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:username}});
                                        res.json('updated');
                                    }
                                    else{
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:oldUserName}});
                                        res.json('updated');
                                    }
                                });                              
                                }

                       }

                   }
                   else{
                    console.log(errors.array());
                   }
               }else{
                   res.json('Wrong Password!');
               }
            }
        })
        
    } catch (error) {
        
    }
})

module.exports= server;