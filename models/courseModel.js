const mongoose = require('mongoose')

const pdfSchema = {
    pdftitle:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    }
}

const videoSchema = {
    videotitle:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    }
}

const moduleSchema = {
    moduleTitle:{
        type:String,
        required:true
    },
    moduleDescription:{
        type:String
    },
    videos:[videoSchema],
    pdfs:[pdfSchema]

}

const courseSchema = new mongoose.Schema({
    courseType:{
        type:String,
        required:true
    },
    courseTitle:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    modules:[moduleSchema],
    userMail:{
        type:String,
        required:true
    }


})

const course = mongoose.model("course",courseSchema)
module.exports = course