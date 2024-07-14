import { model, Schema } from "mongoose";

const companySchema = new Schema({
    companyName :{
        type: String,
        required: true,
        unique:true
    },
    description :{
        type: String,
        required:true
    },
    industry :{
        type: String,
        required:true

    },
    address:{
        type: String,
        required:true
    },
    numberOfEmployees :{
        type: Number,
        required:true,
        min:11,
        max:20
    },
    companyEmail :{
        type: String,
        required:true,
        unique:true
    },
    isEmailConfirmed:{
        type:Boolean,
        default:false
    },
    companyHR :{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const companyModel = model("Company", companySchema)
export default companyModel