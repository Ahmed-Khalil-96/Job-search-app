
import { model, Schema } from "mongoose";

const appSchema = new Schema({
    jobId :{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    userId :{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    userTechSkills :{
        type:[""],
        required:true
    },
    userSoftSkills :{
        type:[""],
        required:true
    },
    userResume :{
        type:String,
        required:true,

    }
})

const appModel= model("Application",appSchema)
export default appModel