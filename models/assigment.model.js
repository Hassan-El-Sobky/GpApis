const mongoose = require('mongoose')
const assigmentSchema = mongoose.Schema({
    title:{type:String},
    uploadDate:{type:String},
    deadLine:{type:String},
    description:{type:String},
    assigmentCode:{type:String},
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:'course'},
    fileUrl:{type:String}
})
module.exports=mongoose.model('assigment',assigmentSchema);