const mongoose=require('mongoose');
const { db } = require('./grade.model');

 const userSchema=mongoose.Schema({
   name: {type: String,required: true},
   username:{type: String,required: true},
   email:{type: String,required: true},
   password:{type: String,required: true},
   gender:{type: String,required: true},
   userID : {type : mongoose.Schema.Types.ObjectId , ref : 'user'},
   courses:[{
       courseId:{type:mongoose.Schema.Types.ObjectId , ref:'course' , required:false},
   }
   ],
   role: { type: String, default: 'student', enum: ["student", "instructor", "admin"] , required:true },
   imageUrl:{type:String},
   mobilePhone:{type:String},
   registrationDate:{type:String}

   //accessToken: { type: String },
   //dateOfJoin: { type: String },


});
module.exports = mongoose.model('user', userSchema);

