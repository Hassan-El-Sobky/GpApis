const mongoose = require('mongoose')
const assigmentSolutionSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    additionPoint:{type:String},
    assigmentId:{type:mongoose.Schema.Types.ObjectId,ref:'assigment'},
    fileUrl:{type:String}
})
module.exports=mongoose.model('assigmentSolution',assigmentSolutionSchema);
