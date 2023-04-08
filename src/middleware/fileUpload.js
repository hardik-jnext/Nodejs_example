const multer = require("multer")
const path = require("path")


const uploadsPath = path.join(__dirname,"../uploads")
const uploads  = multer({
 storage:multer.diskStorage({
    destination : uploadsPath,
    filename: function(req,file,callback){
        callback(null,file.originalname)

    }
 }),
 fileFilter : (req,file,cb)=>{
    let ext = path.extname(file.originalname)
    if (ext !== ".png" || ext !== ".jpg" || ext !== ".jpeg") {   
        return cb(null,false);
    }else{   
        cb(null, true);
}
},
}).single('upload_file')


module.exports = uploads