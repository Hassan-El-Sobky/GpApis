const signup = require('express').Router()
const userModel=require('../models/user.model')
const {check , validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
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

signup.post('/signup',userImage.single("userImage"),
check('name').matches(/[A-Z][a-z]*/),
check('username').matches(/[a-z]*/),
check('email').isEmail(),
check('mobilePhone').matches(/^(01)[0512][0-9]{8}$/),
check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
check('rePassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        return false
    }
    return true;
})
,async (req,res)=>{
    //res.json({messge:'signup'})
    const {name , username , email , password , rePassword , gender  , role , mobilePhone } = req.body
    const errors = validationResult(req)
    console.log(errors.array());
    if(errors.isEmpty()){
        let user = await userModel.findOne({email:email.toLowerCase()});
        if(user === null){
            user = await userModel.findOne({username});
            if (user === null) {
                bcrypt.hash(password, 7 , async(err, hash)=> {
                    if(req.file===undefined){
                        res.json({message:"unsupported file type"})
                    }
                    else {
                      //  let pathh= req.file.path.replace('uploads/','');
                        //let imageUrl="http://lmsapis.herokuapp.com/"+pathh;
                        await userModel.insertMany({name , username , email:email.toLowerCase() , password : hash , gender , role , imageUrl:`http://localhost:3000/${req.file.path}`,mobilePhone });
                        user = await userModel.findOne({username})
                        res.json({message:'user'+username+'Created' , user});
                    }

                });
            }
            else{
                res.json({message:'username Exist'});
            }
        }
        else{
            res.json({message:'email Exist'});
        }
    }
    else{
        res.json(errors.array())
    }
})
signup.post('/addInstructor',userImage.single('userImage'),
check('name').matches(/[A-Z][a-z]*/),
check('username').matches(/[a-z]*/),
check('email').isEmail(),
check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
check('rePassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        return false
    }
    return true;
})  ,async(req,res)=>{
    const {name , username , email , password , rePassword , gender , token,mobilePhone } = req.body;
    jwt.verify(token ,"admin" ,async (err, decodded)=>{
        if(err){
            res.json({message:"there is error"});
        }
        else{
            
            const errors = validationResult(req)
            console.log(errors.array());
            if(errors.isEmpty()){
                let user = await userModel.findOne({email:email.toLowerCase()});
                if(user === null){
                    user = await userModel.findOne({username});
                    if (user === null) {
                        bcrypt.hash(password, 7 , async(err, hash)=> {
                            if(req.file===undefined){
                                res.json({message:"unsupported file type"})
                            }
                            else{
                                let pathh= req.file.path.replace('uploads/','');
                                let imageUrl="http://lmsapis.herokuapp.com/"+pathh;
                                await userModel.insertMany({name , username , email:email.toLowerCase() , password : hash , gender , role:"instructor" ,imageUrl,mobilePhone});
                                user = await userModel.findOne({username})
                                res.json({message:'Instructor'+username+'Created' , user});
                            }

                        });
                    }
                    else{
                        res.json({message:'username Exist'});
                    }
                }
                else{
                    res.json({message:'email Exist'});
                }
            }
            else{
                res.json(errors.array())
            }
    }  
    })
})
signup.get('/searchuser' , async (req,res)=>{
    const searchKey = req.query.username;
    console.log(searchKey);
    const searchResult = await userModel.find({$or:[{username:{$regex:searchKey}},{name:{$regex:searchKey}},{email:{$regex:searchKey.toLowerCase()}}]})
    if(searchResult){
    res.json({searchResult});
    }
    else {
        res.json({message:"notFound users"})
    }
})

signup.get('/searchInstructor' , async (req,res)=>{
    const searchKey = req.query.username;
    console.log(searchKey);
    const searchResult = await userModel.find({$and:[{$or:[{username:{$regex:searchKey}},{name:{$regex:searchKey}},
                                                 {email:{$regex:searchKey.toLowerCase()}}]}, {role:"instructor"}]})
    if(searchResult){
    res.json({searchResult});
    }
    else {
        res.json({message:"notFound instructors"})
    }
})
signup.get('/searchStudent' , async (req,res)=>{
    const searchKey = req.query.username;
    console.log(searchKey);
    const searchResult = await userModel.find({$and:[{$or:[{username:{$regex:searchKey}},{name:{$regex:searchKey}},
                                                 {email:{$regex:searchKey.toLowerCase()}}]}, {role:"student"}]})
    if(searchResult){
    res.json({searchResult});
    }
    else {
        res.json({message:"notFound Students"})
    }
})
signup.get('/searchAdmin' , async (req,res)=>{
    const searchKey = req.query.username;
    console.log(searchKey);
    const searchResult = await userModel.find({$and:[{$or:[{username:{$regex:searchKey}},{name:{$regex:searchKey}},
                                                 {email:{$regex:searchKey.toLowerCase()}}]}, {role:"admin"}]})
    if(searchResult){
    res.json({searchResult});
    }
    else {
        res.json({message:"notFound admins"})
    }
})
module.exports=signup
