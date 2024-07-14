import multer from "multer"
import { nanoid } from "nanoid"
import fs from "fs"
import path from"path"
import { AppError } from "../utils/classError.js"




export const customFiles={
    image:["image/png","image/jpg","image/jpeg"],
    pdf:["application/pdf"],
}

export const multerLocal = (customValidation,customPath)=>{


    const absolutePath = path.resolve(`uploads/${customPath}`)


    if(!fs.existsSync(absolutePath)){
        fs.mkdirSync(absolutePath,{recursive:true})
    }

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,absolutePath)
    },
    filename:function(req, file, cb){
        cb(null,nanoid(5)+"-"+file.originalname)
    }
})

const fileFilter=function(req,file,cb){
    if(!customValidation.includes(file.mimetype)){
        return cb(new AppError("file is not supported"),false)
    }
    return cb (null,true)
}


    const upload = multer({storage,fileFilter})
    return upload
}

