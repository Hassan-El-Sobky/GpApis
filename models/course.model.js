const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({

    courseName: { type: String, required: true },
    courseCode: {
        type: String,
        required: 'Please Enter Course Code'
    },
    courseDepartment: { type: String, default: 'General', enum: ['General', 'Information Systems', 'Computer Science', 'Internet Technology']
    , required: true },
    prerequisite: { type: String, required: true},
    state: { type: String, default: 'pending', enum: ["pending", "available","unavailable"] },
    instructorId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    imageUrl:{type:String},
        grades: [{
       name: { type: String },
        grade: { type: Number }
    }],
    materials: [{
        name: { type: String },
        filepath: { type: String }
    }],
    video: [{
        title:{type:String},
        filepath: { type: String },
    }],
    tasks: [{
        name: { type: String },
        deadLine: { type: String },

    }],

})

module.exports=mongoose.model('course',CourseSchema);           



