import joi from "joi";

export const addCompanyValid = {
    body:joi.object({
        companyName :joi.string().min(3).max(100).required().messages({
            "string.min":"company name must be at least 3 characters long",
            "string.max":"company name must be at most 100 characters long",
            "any.required":"company name is required",

        }),
        description :joi.string().min(30).max(600).required().messages({
            "string.min":"description must be at least 30 characters long",
            "string.max":"description must be at most 600 characters long",
            "any.required":"description is required",
        }),
        industry :joi.string().min(15).required().messages({
            "string.min":"industry must be at least 30 characters long",
            "any.required":"industry is required",
        }),
        address:joi.string().required().messages({
            "any.required":"address is required",

        }),
        numberOfEmployees :joi.number().min(11).max(20).required().messages({
            "number.min":"number of employees must be at least 11",
            "number.max":"number of employees must be at most 20",
            "any.required":"number of employees is required",
        }),
        companyEmail :joi.string().email({tlds:{allow:["net","com","org"]},maxDomainSegments:3}).required().messages({
            "string.email":"company email must be a valid email",
            "any.required":"company email is required",

        }),
    })
}

export const updateCompanyValid = {
    body:joi.object({  
        companyName :joi.string().min(3).max(100).messages({
        "string.min":"company name must be at least 3 characters long",
        "string.max":"company name must be at most 100 characters long",
        "any.required":"company name is required",

    }),
    description :joi.string().min(30).max(600).messages({
        "string.min":"description must be at least 30 characters long",
        "string.max":"description must be at most 600 characters long",
        "any.required":"description is required",
    }),
    industry :joi.string().min(30).messages({
        "string.min":"industry must be at least 30 characters long",
        "any.required":"industry is required",
    }),
    address:joi.string().messages({
        "any.required":"address is required",

    }),
    numberOfEmployees :joi.number().min(11).max(20).messages({
        "number.min":"number of employees must be at least 11",
        "number.max":"number of employees must be at most 20",
        "any.required":"number of employees is required",
    }),
    companyEmail :joi.string().email({tlds:{allow:["net","com","org"]},maxDomainSegments:3}).messages({
        "string.email":"company email must be a valid email",
        "any.required":"company email is required",

    })
}),
params:joi.object({
    id:joi.string().required().messages({
        "any.required":"company id is required",
        })
})
}