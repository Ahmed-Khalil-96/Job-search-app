import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import userModel from "../../../DB/Models/user.model.js"
import sendEmail from "../../services/sendEmail.js"
import { nanoid } from "nanoid"
import companyModel from "../../../DB/Models/company.model.js"
import jobModel from "../../../DB/Models/job.model.js"
import appModel from "../../../DB/Models/application.model.js"
import { asyncHandler } from "../../utils/errorHandling.js"
import { AppError } from "../../utils/classError.js"









// =======================================1.Sign Up==============================================
/*
 * Sign up a new user.
 * 1. Extract user details from the request body.
 * 2. Check if the user already exists.
 * 3. Generate a confirmation token and send a confirmation email.
 * 4. Hash the user's password.
 * 5. Create a new user with the provided details.
 * 6. Return a success response.
 */
export const addUser =asyncHandler(async(req, res, next)=>{
  
    const {firstName,lastName,email,password,recoveryEmail,DOB,mobileNumber}= req.body
    
    const userExist = await userModel.findOne({email})
    // if(userExist){
    //     return res.status(400).json({message:"User already exists"})
    // }
    const token = jwt.sign({email},process.env.confirmToken)
    const link = `${process.env.confirmLink}/${token}`
    const data = sendEmail(email,"confirm Email",`<a href = ${link}>click here to confirm your email</a>`)
    if(!data){
        return res.status(500).json({message:"Something went wrong please try again later"})
    }

    const hash = bcrypt.hashSync(password,Number(process.env.saltRounds))

    const user = await userModel.create({firstName, lastName ,email, password:hash, recoveryEmail, DOB, mobileNumber})

    if(!user){
        return res.status(500).json({message:"Something went wrong, user is not created"})
    }
    return res.status(200).json({message:"User created successfully",user:user.email})
 
})

// =====================================confirmEmail==============================================
/*
 * Confirm user's email.
 * 1. Extract the token from the request parameters.
 * 2. Verify the token.
 * 3. Find the user using the email from the token.
 * 4. Check if the user exists and if the email is already confirmed.
 * 5. Update the user's email confirmation status.
 * 6. Return a success response.
 */
export const confirmEmail = asyncHandler(async(req, res, next)=>{
    const {token} = req.params
    if(!token){
        return res.status(400).json({message:"token is not found"})
    }
    const decoded = jwt.verify(token,process.env.confirmToken)
    if(!decoded?.email){
        return res.status(400).json({message:"token is not valid"})
    }
    const user = await userModel.findOne({email:decoded.email})
    if(!user){
        return res.status(400).json({message:"user is not found"})
    }
    if(user.isConfirmed){
        return res.status(400).json({message:"user is already confirmed"})
    }
    const confirm = await userModel.updateOne({email:decoded.email},{isConfirmed:true})
    if(!confirm){
        return res.status(500).json({message:"Something went wrong, user is not confirmed"})
        }
        return res.status(200).json({message:"user is confirmed successfully"})
}
)


// ===================================2.Sign in========================================================
/*
 * Sign in a user.
 * 1. Extract login details from the request body.
 * 2. Find the user by email, recovery email, or mobile number.
 * 3. Verify the user's password.
 * 4. Check if the user is confirmed.
 * 5. Generate an authentication token.
 * 6. Update the user's status to online.
 * 7. Return a success response with the token.
 */
export const login = asyncHandler( async(req, res,next)=>{

    const {email ,recoveryEmail, mobileNumber, password}= req.body
    const user = await userModel.findOne({$or:[{email}, {recoveryEmail},{ mobileNumber}]})
    if(!user){
         return res.status(400).json({message:"wrong email or password"})
    }

    const hash = bcrypt.compareSync(password, user.password)
    if(!hash){
        return res.status(400).json({message:"wrong email or password"})
    }

    if(!user.isConfirmed){
         return res.status(400).json({message:"user is not confirmed"})
    }
     

      const token = jwt.sign({email:user.email, id:user._id},process.env.auth,{expiresIn:"5h"})
      await userModel.updateOne({email},{status:"online"})
      return res.status(200).json({message:"login successfully", token})
}
)


// ========================================3. update account.=================================================
/*
 * Update user account details.
 * 1. Extract user details from the request body and user ID from the request parameters.
 * 2. Find the user by ID.
 * 3. Check if the user exists and if the user is authorized to update the account.
 * 4. Update the user with the new details.
 * 5. Return a success response.
 */

export const updateUser =asyncHandler( async(req, res, next)=>{

    const { email , mobileNumber , recoveryEmail , DOB , lastName , firstName}= req.body
    const{id}= req.params

    const userExist = await userModel.findOne({_id:id})
    if(!userExist){
        return next(new AppError("user does not exist",404))
        }

    if(userExist._id!=req.user.id){
        return next(new AppError("you are not allowed to update this user",403))
    }
    const user = await userModel.findOne({$or:[{email},{mobileNumber}]})
    if(user){
       
        return next(new AppError("email or mobile number already exist",409))
    }
    const updateUser = await userModel.updateOne({_id:req.user._id},{email,recoveryEmail, DOB,lastName, firstName, mobileNumber})
    if(!updateUser){
        return next(new AppError("user not updated",500))
            }
            return res.status(200).json({message:"user is updated successfully"})
})


// ====================================================4.Delete account================================================
/*
 * Delete a user account.
 * 1. Extract user ID from the request parameters.
 * 2. Find the user by ID.
 * 3. Check if the user exists and if the user is authorized to delete the account.
 * 4. Delete associated companies, jobs, and applications.
 * 5. Delete the user account.
 * 6. Return a success response.
 */

 export const deleteUser = asyncHandler( async(req,res, next)=>{
    const{id}= req.params
    const user = await userModel.findOne({_id:id})
    if(!user){

        return next(new AppError("user does not exist",404))
    }
        if(user._id!=req.user.id){
           
            return next(new AppError("you are not allowed to delete this user",403))
        }


        
        const deleteCompanyIds = await companyModel.find({companyHR:id}).select("_id")
        const companyIds = deleteCompanyIds.map(company => company._id.toString())
      

        const deleteCompany = await companyModel.deleteMany({companyHR:id})

        if(deleteCompany.deletedCount = 0){

            return next(new AppError("user not deleted",500))
        }
        const deleteJobsId = await jobModel.find({ companyId: { $in: companyIds } }).select('_id');
        const jobsIds =deleteJobsId.map(job => job._id.toString())

        const deleteJobs = await jobModel.deleteMany({ companyId: { $in:companyIds } });
        if(deleteJobs.deletedCount = 0){
            
            return next(new AppError("user not deleted",500))
                }

                const deleteApps = await appModel.deleteMany({jobId:{$in:jobsIds}})
                if(deleteApps.deletedCount = 0){
                    
                    return next(new AppError("user not deleted",500))
                        }

        const deleteUser = await userModel.deleteOne({_id:req.user._id})
        if(!deleteUser){
           
            return next(new AppError("user not deleted",500))
                }
            return res.status(200).json({message:"user is deleted successfully"})
        
        })



// ===========================5.Get user account data============================================
/*
 * Get user account data.
 * 1. Extract user ID from the request parameters.
 * 2. Find the user by ID.
 * 3. Check if the user exists and if the user is authorized to access the data.
 * 4. Return a success response with the user data.
 */
export const getUserData = asyncHandler(async(req, res, next)=>{
    const{id}= req.params
    const user = await userModel.findOne({_id:id})
        if(!user){
         
            return next(new AppError("user not found",404))
                 }
        if(req.user.id!=user._id){
             
            return next(new AppError("you are not allowed to access this page",403))
                    }
        return res.status(200).json({user})
     })




//=============================6.Get profile data for another user ==================================
/*
 * Get profile data for another user.
 * 1. Extract user ID from the request parameters.
 * 2. Find the user by ID.
 * 3. Check if the user exists.
 * 4. Return a success response with the user's public profile data.
 */
    export const getProfileData = asyncHandler(async(req, res, next)=>{
        const{id}= req.params
        const user = await userModel.findOne({_id:id})
        if(!user){
            return next(new AppError("user not found",404))
            }
        
            return res.status(200).json({userName:user.username,email:user.email})
    })






// =============================7.Update password ======================================================
/*
 * Update user password.
 * 1. Extract email, OTP, and new password from the request body.
 * 2. Find the user by email.
 * 3. Check if the user exists and if the OTP is correct.
 * 4. Hash the new password.
 * 5. Update the user's password and unset the OTP.
 * 6. Return a success response.
 */
export const updatePassword = asyncHandler(async(req, res, next)=>{
    const{email,otp,newPassword}= req.body
    const user = await userModel.findOne({email:email})
    if(!user){
      
        return next(new AppError("user not found",404))
        }
        if(user.otp!=otp){
          
            return next(new AppError("otp is not correct",400))
        }
        const hash = bcrypt.hashSync(newPassword,Number(process.env.saltRounds))

        const updatedPassword = await userModel.updateOne({email},{password:hash,$unset:{otp:""}})
        if(!updatedPassword){
        
            return next(new AppError("something went wrong, please try again later",400))
            }
            return res.status(200).json({message:"password is updated successfully"})
}
)

// =============================8.forgot password========================================
/*
 * Forgot password.
 * 1. Extract email from the request body.
 * 2. Find the user by email.
 * 3. Check if the user exists.
 * 4. Generate an OTP and send a reset password email.
 * 5. Update the user with the OTP.
 * 6. Return a success response.
 */
export const forgetPassword = asyncHandler(async(req, res, next)=>{

    const{email}= req.body
    const user = await userModel.findOne({email:email})
    if(!user){

        return next(new AppError("user not found",404))
    }
        const otp = nanoid(6)
        const data = sendEmail(email,"reset your password ",`<p>please use this otp to reset your password ${otp}</p>`)
        if(!data){
            
            return next(new AppError("email not sent",500))
            }

            const update = await userModel.updateOne({email},{otp})
            if(!update){
                
                return next(new AppError("user not found",404))
            }
                    return res.status(200).json({message:"otp is sent to your email"})
})


//====================== 9.Get all accounts associated to a specific recovery Email =============
/*
 * Get all accounts associated with a specific recovery email.
 * 1. Extract recovery email from the request body.
 * 2. Find users by recovery email.
 * 3. Check if any users exist.
 * 4. Return a success response with the users.
 */

export const getUsersWithRecovEmail= asyncHandler(async(req, res, next)=>{
    const {recoveryEmail}=req.body
    const users = await userModel.find({recoveryEmail})
    if(!users.length){
      
        return next(new AppError("no users linked to this email",404))
        }
        return res.status(200).json({users})

})