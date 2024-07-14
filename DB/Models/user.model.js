import { model, Schema } from "mongoose";

const userSchema= new Schema({

   
    firstName :{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true

    },
    username: {
        type: String,        
        
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    recoveryEmail :{
        type:String,
        required:true
    },
    DOB:{
        type: Date,
        required:true
    },
    mobileNumber :{
        type:Number,
        required:true,
        unique:true
    },
    role :{
        type:String,
        required:true,
        default:"User",
        enum:["User","Company_HR "]
    },
    status :{
        type:String,
        required:true,
        default:"offline",
        enum:["online","offline"]
    },
    otp:{
        type:String,
        default:""
    },
    isConfirmed:{
        type:Boolean,
        default:false
    }
},{
timestamps:true,
versionKey:false
})

userSchema.pre('save', function(next) {
    this.username = `${this.firstName} ${this.lastName}`;
    next();
});

const userModel = model("User", userSchema)

export default userModel