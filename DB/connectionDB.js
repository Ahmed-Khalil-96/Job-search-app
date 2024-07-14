import mongoose from "mongoose";

const connection = async()=>{
    return await mongoose.connect(process.env.url).then(()=>{
        console.log("Database connected");
    }).catch((err)=>{
        console.log("Database connection failed", err);
    })
}

export default connection