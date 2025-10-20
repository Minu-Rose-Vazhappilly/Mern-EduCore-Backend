const course = require('../models/courseModel')

exports.addCourseController = async (req,res)=>{
    console.log("Inside addCourseController");
    
    // console.log(req.body);
    // console.log(req.files);

    const {courseType,courseTitle,courseDescription,price} = req.body
    const modules = JSON.parse(req.body.modules);
     const userMail = req.payload
    const thumbnail = req.files['thumbnail']?.[0]?.path;
    const videoFiles = req.files['videoUrl'] || [];
    const pdfFiles = req.files['fileUrl'] || [];
    // console.log(courseTitle,courseDescription,price,thumbnail,modules,videoFiles,pdfFiles);

     modules.forEach((mod, i) => {
      mod.videos = [{ videotitle: mod.videos[0].videotitle, videoUrl: videoFiles[i]?.path }];
      mod.pdfs = [{ pdftitle: mod.pdfs[0].pdftitle, fileUrl: pdfFiles[i]?.path }];
    });

    console.log(courseType,courseTitle,courseDescription,price,thumbnail,modules,userMail);
    
    
     console.log(JSON.stringify(modules, null, 2));

     try{

        const existingCourse = await course.findOne({courseTitle,userMail})
        if(existingCourse){
            res.status(401).json("You have already added the Course")
        }else{
            const newCourse = new course({
                courseType,courseTitle,courseDescription,price,thumbnail,modules,userMail
            })
            await newCourse.save()
            res.status(200).json(newCourse)
        }


     }
     catch(err){
        res.status(500).json(err)
     }
    
    
    

 
}