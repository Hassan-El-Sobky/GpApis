const mongoose = require('mongoose')
const assesmentSchema = mongoose.Schema({
    openDate:{type:String ,  required:true},
    dueDate:{type:String ,  required:true},
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:'course' , require:true},
    category:{type:String , enum: ["exam", "quiz"] , required:true }, 
    fullMark:{type:String } , 
    questions:{type:[{question :String ,answer:[{option:String, correct:Boolean}]}],require:true},
    title : {type :String}
                                        
    //fileUrl:{type:String}
})
module.exports=mongoose.model('assesment',assesmentSchema);
