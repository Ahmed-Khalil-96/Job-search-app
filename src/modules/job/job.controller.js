import appModel from "../../../DB/Models/application.model.js"
import companyModel from "../../../DB/Models/company.model.js"
import jobModel from "../../../DB/Models/job.model.js"
import { AppError } from "../../utils/classError.js"
import { asyncHandler } from "../../utils/errorHandling.js"







// ================================1.Add Job ==============================
/*
 * Add a new job.
 * 1. Extract job details from the request body.
 * 2. Check if the user has the "Company_HR" role.
 * 3. Find the company associated with the user.
 * 4. Create a new job with the provided details and the company ID.
 * 5. Return a success response with the job details.
 */

export const addJob = asyncHandler(async(req, res, next)=>{

    const {jobTitle, jobLocation ,workingTime ,seniorityLevel ,jobDescription, technicalSkills ,softSkills } = req.body

    if(req.user.role!="Company_HR"){
    return next(new AppError("You are not authorized to perform this action.", 403))
    }


    const company = await companyModel.findOne({companyHR:req.user.id})
    const job = await jobModel.create({jobTitle, jobLocation ,workingTime ,seniorityLevel ,jobDescription, technicalSkills ,softSkills,addedBy:req.user.id,companyId:company._id})
    if(!job){
        
        return next(new AppError("Something went wrong", 500))
    }
    return res.status(200).json({message:"Job added successfully.",job})
})



// ==============================2.update job=====================

/*
 * Update a job.
 * 1. Extract job ID from the request parameters.
 * 2. Find the job by ID.
 * 3. Check if the job exists.
 * 4. Check if the user is authorized to update the job.
 * 5. Update the job with the new details from the request body.
 * 6. Return a success response with the updated job details.
 */

export const updateJob =asyncHandler( async(req, res ,next)=>{
    const {id} = req.params
    const job= await jobModel.findOne({_id:id})
    if(!job){
        
        return next(new AppError("Job not found", 404))
        }

        if(req.user.role!="Company_HR"||req.user.id!=job.addedBy){
           
            return next(new AppError("You are not authorized to perform this action.", 403))
        }

        const update = await jobModel.findOneAndUpdate({_id:id},req.body,{new:true})
        if(!update){
         
            return next(new AppError("Something went wrong", 500))
            }
            return res.status(200).json({message:"Job updated successfully.",update})

}
)

// ==============================3.delete job===============================
/*
 * Delete a job.
 * 1. Extract job ID from the request parameters.
 * 2. Find the job by ID.
 * 3. Check if the job exists.
 * 4. Check if the user is authorized to delete the job.
 * 5. Delete all applications associated with the job.
 * 6. Delete the job.
 * 7. Return a success response.
 */

export const deleteJob = asyncHandler(async(req, res ,next)=>{
    const {id} = req.params
    const job= await jobModel.findOne({_id:id})
    if(!job){
        return next(new AppError("Job not found", 404))
        }

        if(req.user.role!="Company_HR"||req.user.id!=job.addedBy){
            
            return next(new AppError("You are not authorized to perform this action.", 403))
        }

        const deletedApps = await appModel.deleteMany({jobId:id})

        if(deletedApps.deletedCount=0){
           
            return next(new AppError("Something went wrong", 500))
        }

        const deleted = await jobModel.deleteOne({_id:id})
        if(!deleted){
            return next(new AppError("Something went wrong", 500))
            }
            return res.status(200).json({message:"Job deleted successfully."})

})

// ===================4.Get all Jobs with their company’s information.=======================
/*
 * Get all jobs with their associated company's information.
 * 1. Check if the user has the required roles.
 * 2. Find all jobs and populate the company information.
 * 3. Check if any jobs are found.
 * 4. Return a success response with the jobs and their company information.
 */

export  const getJobsWithComp= asyncHandler( async(req, res, next)=>{

    if(req.user.role!="User"&&req.user.role!="Company_HR"){
        
        return next(new AppError("You are not authorized to perform this action.", 403))
    }

    const jobs = await jobModel.find().populate({
        path: 'companyId',
        populate:{
            path:"companyHR"
        }
       
    })
    if(!jobs.length){
        
        return next(new AppError("No jobs found", 404))
    }

    return res.status(200).json({message:"Jobs fetched successfully.",jobs})
}
)



//=========================== 5.Get all Jobs for a specific company.==============================

/*
 * Get all jobs for a specific company.
 * 1. Check if the user has the required roles.
 * 2. Extract company name from the query parameters.
 * 3. Find the company by name.
 * 4. Check if the company exists.
 * 5. Find all jobs added by the company's HR.
 * 6. Check if any jobs are found.
 * 7. Return a success response with the company and its jobs.
 */
export const getAllJobsForCompany = asyncHandler( async(req,res, next)=>{
    
    if(req.user.role!="User"&& req.user.role!="Company_HR"){
        return next(new AppError("You are not authorized to perform this action.", 403))
    }
    const {companyName}=req.query
    const company = await companyModel.findOne({companyName})
    if(!company){
        
        return next(new AppError("Company not found", 404))
        }

        const jobs = await jobModel.find({addedBy:company.companyHR})
        if(!jobs.length){
           
            return next(new AppError("No jobs found", 404))
            }
            return res.status(200).json({message:"Jobs fetched successfully.",company,jobs})
})


// ========================6.Get all Jobs that match the following filters ==========================
/*
 * Get all jobs that match the specified filters.
 * 1. Check if the user has the required roles.
 * 2. Find jobs that match the filters specified in the request body.
 * 3. Check if any jobs are found.
 * 4. Return a success response with the jobs.
 */
export const GetAllJobsFilter = asyncHandler(async(req,res,next)=>{
    
    if(req.user.role!="User"&& req.user.role!="Company_HR"){
        
        return next(new AppError("You are not authorized to perform this action.", 403))
    }
    const jobs = await jobModel.find({$and:[req.body]})
    if(!jobs.length){
        return next(new AppError("No jobs found", 404))
        }
        return res.status(200).json({message:"Jobs fetched successfully.",jobs})
})


// ============================7.Apply to Job=========================================================
/*
 * Apply to a job.
 * 1. Check if the user has the "User" role.
 * 2. Extract job ID from the request parameters.
 * 3. Extract user's technical and soft skills from the request body.
 * 4. Find the job by ID.
 * 5. Check if the job exists.
 * 6. Check if the user uploaded a resume.
 * 7. Create a new application with the job ID, user ID, skills, and resume path.
 * 8. Return a success response with the application details.
 * 9.Add new document to the application collection
 */

export const applyToJob = asyncHandler(async(req, res,next)=>{
    if(req.user.role!="User"){
        
        return next(new AppError("You are not authorized to perform this action.", 403))
    }
    const {jobId}= req.params

const{ userTechSkills, userSoftSkills} = req.body
    const job = await jobModel.findById(jobId)
    if(!job){
        return next(new AppError("Job not found", 404))
        }
        if(!req.file){
            return next(new AppError("Please upload your resume", 400))
        }

        const application = await appModel.create({jobId,userId:req.user.id,userTechSkills,userSoftSkills,userResume:req.file.path}) 
        if(!application){
            
            return next(new AppError("Application not created", 400))
            }
            return res.status(200).json({message:"Application created successfully.",application})

})