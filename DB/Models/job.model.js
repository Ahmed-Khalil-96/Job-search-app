import { model, Schema } from "mongoose";

const jobSchema = new Schema({
    jobTitle :{
        type: String,
        required: true
    },
    jobLocation :{
        type:String,
        required: true,
        enum:["onsite","remotely",'hybrid']
    },
    workingTime :{
        type:String,
        required: true,
        enum:["full-time","part-time"]
    },
    seniorityLevel :{
        type:String,
        required: true,
        enum:["junior","mid-level",'senior',"team-lead","CTO"]
    },
    jobDescription :{
        type:String,
        required: true

    },
    technicalSkills :{
        type:[""],
        required: true
    },
    softSkills :{
        type:[""],
        required: true
    },
    addedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
})

const jobModel = model("Job", jobSchema)
export default jobModel