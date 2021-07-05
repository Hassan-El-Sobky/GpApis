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

server.put('/userEdit',userImage.single("userImage"),/*check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),*/
check('rePassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        return false
    }
    return true;
})
,async(req,res)=>{
    const {oldUserName,username, oldPassword,password,rePassword}=req.body;
    console.log(password);
    const errors = validationResult(req);
    
    const user = await userModel.findOne({username:oldUserName});
    const match = await bcrypt.compare(oldPassword, user.password);
    console.log(req.file);
    try {

               if(match){
                   if(errors.isEmpty()==true){
                       let user1 = await userModel.findOne({username})
                       console.log(user1&&user1!==user);
                       if(user1&&user1==user){
                           res.json("user exist")
                       }else{ 
                            if (password) {
                                check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                                bcrypt.hash(password, 4, async (err, hash)=> {
                                    if (username&&req.file!==undefined) {
                                    await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:username , imageUrl:`http://localhost:3000/${req.file.path}`}});
                                    res.json('updated');   
                                    }
                                    else if (username){
                                        await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:username , imageUrl:user.imageUrl}});
                                        res.json('updated');

                                    }
                                    else if (req.file!==undefined)
                                    {
                                        await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:oldUserName , imageUrl:`http://localhost:3000/${req.file.path}`}});
                                        res.json('updated');
                                    }
                                    else{
                                        await userModel.updateMany({username:oldUserName},{$set:{password:hash, username:oldUserName ,imageUrl:user.imageUrl}});
                                        res.json('updated'); 
                                    }

                                });   
                            }
                            else {
                                bcrypt.hash(oldPassword, 4, async (err, hash)=> {
                                    if (username&&req.file!==undefined) {
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:username , imageUrl:`http://localhost:3000/${req.file.path}`}});
                                        res.json('updated');
                                    }
                                    else if (username){
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:username , imageUrl:user.imageUrl}});
                                        res.json('updated');
                                    }
                                    else if (req.file!==undefined){
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:oldUserName , imageUrl:`http://localhost:3000/${req.file.path}`}});
                                        res.json('updated');
                                    }
                                    else{
                                        await userModel.updateMany({username:oldUserName},{$set:{oldPassword:hash, username:oldUserName , imageUrl:user.imageUrl}});
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
            
        
    } catch (error) {
        
    }
})

module.exports= server;