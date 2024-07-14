import jwt from "jsonwebtoken"
import companyModel from "../../../DB/Models/company.model.js"
import sendEmail from "../../services/sendEmail.js"
import jobModel from "../../../DB/Models/job.model.js"
import appModel from "../../../DB/Models/application.model.js"
import { asyncHandler } from "../../utils/errorHandling.js"
import { AppError } from "../../utils/classError.js"






// ==============================1.Add company ==========================================
/*
 * Add a new company.
 * 1. Check if the user has the "Company_HR" role.
 * 2. Extract company details from the request body.
 * 3. Check if the company already exists.
 * 4. Generate a confirmation token and send an email to confirm the company email.
 * 5. Create a new company with the provided details.
 * 6. Return a success response.
 */

export const addCompany = asyncHandler(async(req, res, next)=>{

    if(req.user.role!="Company_HR"){
        return next(new AppError("You are not authorized to perform this action.", 401))
    }
    const {companyEmail,numberOfEmployees,address,industry,description,companyName,}=req.body

    const companyExist = await companyModel.findOne({companyEmail})
    if(companyExist){

       return next(new AppError("Company already exists",400))
        }

        const token = jwt.sign({companyEmail},process.env.confirmCompanyToken,{expiresIn:"1h"})
        const link = `${process.env.companyEmailLink}/${token}`

        const data = sendEmail(companyEmail,"confirm email",`<a href = ${link}>please click here to confirm the company email</a>`)
        if(!data){
        }
        const company = await companyModel.create({companyEmail, companyName,numberOfEmployees,address,industry,description,companyHR:req.user._id})
        if(!company){
         
            return next(new AppError("Something went wrong company isn't created ",500))
        }
        return res.status(201).json({message:"Company created successfully."})
})



// =========================confirm company email=======================================

/*
 * Confirm company email.
 * 1. Extract the token from the request parameters.
 * 2. Verify the token.
 * 3. Find the company using the email from the token.
 * 4. Check if the company exists and if the email is already confirmed.
 * 5. Update the company's email confirmation status.
 * 6. Return a success response.
 */

export const confirmEmail = asyncHandler(async(req, res, next)=>{
    const {token} = req.params
    if(!token){
        return next(new AppError("Token is not found",400))
    }
    const decoded = jwt.verify(token , process.env.confirmCompanyToken)
    if(!decoded?.companyEmail){
        return next(new AppError("Token is not valid",400))
    }
    const companyExist = await companyModel.findOne({companyEmail:decoded.companyEmail})
    if(!companyExist){
        return next(new AppError("Company doesn't exist.",400))
    }
    if(companyExist.isEmailConfirmed){
        return next(new AppError("Email is already confirmed",400))
        }
    const confirm = await companyModel.updateOne({companyEmail:decoded.companyEmail},{isEmailConfirmed:true})
    if(!confirm){
        return next(new AppError("Something went wrong",500))
            }

    return res.status(200).json({message:"Email confirmed successfully."})
        
}
)


// =============================2.Update company data==============================================
/*
 * Update company data.
 * 1. Extract company details from the request body and company ID from the request parameters.
 * 2. Find the company by ID.
 * 3. Check if the company exists and if the user is authorized to update the company.
 * 4. Update the company with the new details.
 * 5. Return a success response.
 */
export const updateCompany = asyncHandler(async(req,res, next)=>{
    const {companyEmail,numberOfEmployees,address,industry,description,companyName}=req.body
    const{id}=req.params

    const companyExist= await companyModel.findOne({_id:id})
    if(!companyExist){
    
        return next(new AppError("Company doesn't exist",400))
        }
        if(req.user.id!=companyExist.companyHR){

            return next(new AppError("You are not authorized to update this company",401))
        }
        const company = await companyModel.updateOne({_id:id},{companyEmail,numberOfEmployees,address,industry,description,companyName})
        if(!company){
        
            return next(new AppError("Something went wrong",500))
            }
            return res.status(200).json({message:"Company updated successfully."})
})


// ===========================3.Delete company data=====================================================

/*
 * Delete a company.
 * 1. Extract company ID from the request parameters.
 * 2. Find the company by ID.
 * 3. Check if the company exists and if the user is authorized to delete the company.
 * 4. Find and delete all jobs associated with the company.
 * 5. Find and delete all applications associated with the jobs.
 * 6. Delete the company.
 * 7. Return a success response.
 */
export const deleteCompany = asyncHandler(async(req,res, next)=>{
   
    const{id}=req.params

    const companyExist= await companyModel.findOne({_id:id})
    if(!companyExist){
      
        return next(new AppError("Company doesn't exist",400))  
        }
        if(req.user.id!=companyExist.companyHR){
            return next(new AppError("You are not authorized to delete this company",401))
        }
        const jobs= await jobModel.find({companyId:companyExist._id}).select("_id")
        const jobsId = jobs.map(job=>job._id.toString())

        const jobsDeleted = await jobModel.deleteMany({_id:{$in:jobsId}})

        if(jobsDeleted.deletedCount=0){

            return next(new AppError("Something went wrong",500))
        }
            const deletedApps = await appModel.deleteMany({jobId:{$in:jobsId}})
            if(deletedApps.deletedCount=0){
                
                return next(new AppError("Something went wrong",500))
                }
        
        const company = await companyModel.deleteOne({_id:id},)
        if(!company){
            return next(new AppError("Something went wrong",500))
            }
            return res.status(200).json({message:"Company deleted successfully."})
})



// ================================4.Get company data =================================================
/*
 * Get company data.
 * 1. Check if the user has the "Company_HR" role.
 * 2. Extract company ID from the request parameters.
 * 3. Find the company by ID.
 * 4. Check if the company exists.
 * 5. Find all jobs added by the company's HR.
 * 6. Return a success response with the company and its jobs.
 */
export const GetCompanyData= asyncHandler(async(req,res,next)=>{
    if(req.user.role!="Company_HR"){
        return next(new AppError("You are not authorized to view this page",401))
        }
    const {id}=req.params

    const company = await companyModel.findById(id)
    if(!company){
        return next(new AppError("Company doesn't exist",400))
        }

        const jobs = await jobModel.find({addedBy:company.companyHR})
        if(!jobs){

            return next(new AppError("No jobs found",400))
        }
        return res.status(200).json({company,jobs})
} )



// ==========================================5.Search for a company with a name. ============================
/*
 * Search for a company by name.
 * 1. Check if the user has the required roles.
 * 2. Extract company name from the request body.
 * 3. Find the company by name.
 * 4. Check if the company exists.
 * 5. Return a success response with the company details.
 */
export const findCompByName = asyncHandler(async(req,res, next)=>{

  
    if(req.user.role!="User"&& req.user.role!="Company_HR"){  

        return next(new AppError("You are not authorized to view this page",401))

    }
    const {companyName}= req.body

    const company= await companyModel.findOne({companyName})
    if(!company){
       
        return next(new AppError("Company doesn't exist",400))
        }
        return res.status(200).json({company})
})



// ===========================6.Get all applications for specific Job===========================================
/*
 * Get all applications for a specific job.
 * 1. Check if the user has the "Company_HR" role.
 * 2. Extract job ID from the request parameters.
 * 3. Find the job by ID.
 * 4. Check if the job exists.
 * 5. Find all applications for the job and populate user information.
 * 6. Check if any applications are found.
 * 7. Check if the user is authorized to view the applications.
 * 8. Return a success response with the applications.
 */
export const getAppsForJob = asyncHandler(async(req, res, next)=>{
    if(req.user.role!="Company_HR"){
      
        return next(new AppError("You are not authorized to view this page",401))
    }

    const{jobId}=req.params

    const job =await jobModel.findOne({_id:jobId})
   
    if(!job){
       
        return next(new AppError("Job doesn't exist",400))
        }
    const apps = await appModel.find({jobId}).populate({
        path:"userId",
    })

    if(!apps.length){
       
        return next(new AppError("No applications found",404))
        }


    if(req.user.id!=job.addedBy){

        return next(new AppError("You are not authorized to view this data.",401))
        

    }
    return res.status(200).json({apps})
    
})