const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./pdf')
    },
    filename:(req,file,cb)=>{
        cb(null,`resume-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'application/pdf' ){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error("Accept only pdf files"))
    }
}

const pdfMulterConfig = multer({
    storage,
    fileFilter
})

module.exports = pdfMulterConfig