const mongoose = require('mongoose')
const lectureSchema = mongoose.Schema({
    title:{type:String},
    uploadDate:{type:String},
    description:{type:String},
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:'course'},
    fileUrl:{type:String}
})
module.exports=mongoose.model('lecture',lectureSchema);
