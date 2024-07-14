import joi from "joi";






export const addJobValid = {
    body:joi.object({
        jobTitle :joi.string().min(20).max(100).required().messages({
            "string.min": "Job title must be at least 20 characters long",
            "string.max": "Job title must be at most 100 characters long",
            "any.required": "Job title is required"
        }),
        jobLocation :joi.string().valid("onsite","remotely","hybrid").required().messages({
            "any.only": "Job location must be onsite, remotely or hybrid",
            "any.required":"job location is required"
        }),
        workingTime:joi.string().valid("part-time","full-time").required().messages({
            "any.only": "working time must be part-time or full-time",
            "any.required":"working time is required"
        }) ,
        seniorityLevel :joi.string().valid('junior', 'mid-level','senior', 'team-lead', 'CTO').required().messages({
            "any.only": "seniority level must be Junior, Mid-Level, Senior, Team Lead or CTO",
            "any.required":"seniority level is required"
        }),
        jobDescription :joi.string().min(20).max(1000).required().messages({
            "string.min": "Job description must be at least 20 characters long",
            "string.max": "Job description must be at most 1000 characters long",
            "any.required": "Job description is required"
        }),
        technicalSkills :joi.array().items(joi.string().required()).min(1).required().messages({
            "array.min": "Technical skills must be at least 1",
            "any.required": "Technical skills is required",
            "array.base": "Technical skills must be an array",
             'string.empty': 'Technical skill cannot be empty',
             'string.base': 'Each technical skill must be a string',

        }),
        softSkills :joi.array().items(joi.string().required()).min(1).required().messages({
            "array.min": "soft skills must be at least 1",
            "any.required": "soft skills is required",
            "array.base": "soft skills must be an array",
             'string.empty': 'soft skill cannot be empty',
             'string.base': 'Each soft skill must be a string',

        }),
    })
}

export const updateJobValid= {
    body:joi.object({
        jobTitle :joi.string().min(20).max(100).messages({
            "string.min": "Job title must be at least 20 characters long",
            "string.max": "Job title must be at most 100 characters long",
            "any.required": "Job title is required"
        }),
        jobLocation :joi.string().valid("onsite","remotely","hybrid").messages({
            "any.only": "Job location must be onsite, remotely or hybrid",
            "any.required":"job location is required"
        }),
        workingTime:joi.string().valid("part-time","full-time").messages({
            "any.only": "working time must be part-time or full-time",
            "any.required":"working time is required"
        }) ,
        seniorityLevel :joi.string().valid('junior', 'mid-level', 'senior','team-lead', 'CTO').messages({
            "any.only": "seniority level must be Junior, Mid-Level, Senior, Team Lead or CTO",
            "any.required":"seniority level is required"
        }),
        jobDescription :joi.string().min(20).max(1000).messages({
            "string.min": "Job description must be at least 20 characters long",
            "string.max": "Job description must be at most 1000 characters long",
            "any.required": "Job description is required"
        }),
        technicalSkills :joi.array().items(joi.string().required()).min(1).messages({
            "array.min": "Technical skills must be at least 1",
            "any.required": "Technical skills is required",
            "array.base": "Technical skills must be an array",
             'string.empty': 'Technical skill cannot be empty',
             'string.base': 'Each technical skill must be a string',

        }),
        softSkills :joi.array().items(joi.string().required()).min(1).messages({
            "array.min": "soft skills must be at least 1",
            "any.required": "soft skills is required",
            "array.base": "soft skills must be an array",
             'string.empty': 'soft skill cannot be empty',
             'string.base': 'Each soft skill must be a string',

        }),
    }),

    params:joi.object({
        id:joi.string().required().messages({
            "any.required": "id is required"
        })
    })
}


export const GetAllJobsFilterValid = {
    body:joi.object({
        jobLocation :joi.string().valid("onsite","remotely","hybrid").messages({
            "any.only": "Job location must be onsite, remotely or hybrid",
            "any.required":"job location is required"
        }),
        workingTime:joi.string().valid("part-time","full-time").messages({
            "any.only": "working time must be part-time or full-time",
            "any.required":"working time is required"
        }) ,
        seniorityLevel :joi.string().valid('junior', 'mid-level', 'senior','team-lead', 'CTO').messages({
            "any.only": "seniority level must be Junior, Mid-Level, Senior, Team Lead or CTO",
            "any.required":"seniority level is required"
        }),
        jobTitle :joi.string().min(20).max(100).messages({
            "string.min": "Job title must be at least 20 characters long",
            "string.max": "Job title must be at most 100 characters long",
            "any.required": "Job title is required"
        }),
        technicalSkills :joi.array().items(joi.string().required()).min(1).messages({
            "array.min": "Technical skills must be at least 1",
            "any.required": "Technical skills is required",
            "array.base": "Technical skills must be an array",
             'string.empty': 'Technical skill cannot be empty',
             'string.base': 'Each technical skill must be a string',

        }),
    })
}


export const addApplicationValid = {
    body:joi.object({
        userTechSkills:joi.array().items(joi.string().required()).required().min(1).messages({
            "array.min": "Technical skills must be at least 1",
            "any.required": "Technical skills is required",
            "array.base": "Technical skills must be an array",
             'string.empty': 'Technical skill cannot be empty',
             'string.base': 'Each technical skill must be a string',

        }),
        userSoftSkills:joi.array().items(joi.string().required()).required().min(1).messages({
            "array.min": "soft skills must be at least 1",
            "any.required": "soft skills is required",
            "array.base": "soft skills must be an array",
             'string.empty': 'soft skill cannot be empty',
             'string.base': 'Each soft skill must be a string',

        }),
    })
}