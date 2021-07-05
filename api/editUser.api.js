const server = require('express').Router();
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const {check,validationResult} = require('express-validator');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/userImages/')
    },
    filename: function (req, file, cb) {
        x=file.originalname.replace(/\s+/g, '');
      cb(null, Date.now()+x  )
    }
  })
  function fileFilter (req, file, cb) {
    let extension = file.mimetype;
    if(extension!="image/png"&&extension!="image/jpg"&&extension!="image/jpeg"&&extension!="image/webp"){
        cb(null,false);
    }
    else{
        cb(null , true);
    }   
  }
  const userImage = multer({dest:'./uploads/userImages/',storage , fileFilter });

server.put('/editUser' ,userImage.single("userImage") , check('rePassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        return false
    }
    return true;
}) , async (req,res)=>{
    const { name ,username ,oldPassword,password , rePassword } = req.body
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const user = await userModel.findOne({username});
        console.log(user);
        if(user){
            const match = await bcrypt.compare(oldPassword, user.password);
            if(match){
                if(password && password!="null"){
                    check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                    bcrypt.hash(password, 4, async (err, hash)=> {
                        if (name&&req.file!==undefined) {
                            await userModel.updateMany({username},{$set:{password:hash, name , imageUrl:`http://localhost:3000/${req.file.path}`}});
                            res.json('updated');   
                            }
                            else if (name){
                                await userModel.updateMany({username},{$set:{password:hash, name , imageUrl:user.imageUrl}});
                                res.json('updated');

                            }
                            else if (req.file!==undefined)
                            {
                                await userModel.updateMany({username},{$set:{password:hash, name:user.name , imageUrl:`http://localhost:3000/${req.file.path}`}});
                                res.json('updated');
                            }
                            else{
                                await userModel.updateMany({username},{$set:{password:hash, name:user.name ,imageUrl:user.imageUrl}});
                                res.json('updated'); 
                            }


                    });  
                }
                else{
                    bcrypt.hash(oldPassword, 4, async (err, hash)=> {
                        if (name&&req.file!==undefined) {
                            await userModel.updateMany({username},{$set:{oldPassword:hash, name:user.name , imageUrl:`http://localhost:3000/${req.file.path}`}});
                            res.json('updated');
                        }
                        else if (name){
                            await userModel.updateMany({username},{$set:{oldPassword:hash, username:username , imageUrl:user.imageUrl}});
                            res.json('updated');
                        }
                        else if (req.file!==undefined){
                            await userModel.updateMany({username},{$set:{oldPassword:hash, name:user.name , imageUrl:`http://localhost:3000/${req.file.path}`}});
                            res.json('updated');
                        }
                        else{
                            await userModel.updateMany({username},{$set:{oldPassword:hash, name:user.name , imageUrl:user.imageUrl}});
                            res.json('updated');
                        }
                    }); 
                    
                }
            }
            else{
                res.json({message:"Wrong Old password"})
            }
        }
        else{
            res.json({message:"invalid username"})
        }
    }
    else 
    {
        res.json({message : errors.array()})
    }

} )
module.exports= server;