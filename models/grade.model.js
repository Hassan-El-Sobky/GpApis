const mongoose=require('mongoose');

const gradeSchema = mongoose.Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId , ref:'user' , required:true},
    courseId:{type:mongoose.Schema.Types.ObjectId , ref:'course' , required:true},
    gradeType: { type: String, required: 'Please Enter grade type' },
    score: { type: Number, required: true }

});

module.exports = mongoose.model('grade', gradeSchema);