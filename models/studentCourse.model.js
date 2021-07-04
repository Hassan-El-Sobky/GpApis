const mongoose=require('mongoose');

 const strudenCourseSchema=mongoose.Schema({

    userID : {type : mongoose.Schema.Types.ObjectId , ref : 'user'},
    courseId:{type:mongoose.Schema.Types.ObjectId , ref:'course' , required:true},
    grades:[{assesmentId:{type:mongoose.Schema.Types.ObjectId , ref:'assesment' , required:true}  , grade : {type:String} }],
    registrationDate:{type:String}
});
module.exports = mongoose.model('student_course', strudenCourseSchema);
