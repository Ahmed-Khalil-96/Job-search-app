import joi  from "joi";


export const signUpValidation = {
    body:joi.object({
        firstName:joi.string().min(3).max(20).required().messages({
            "string.min":"First name must be at least 3 characters long",
            "string.max":"First name must be at most 20 characters long",
            "any.required":"First name is required"
        }),
        lastName:joi.string().min(3).max(20).required().messages({
            "string.min":"Last name must be at least 3 characters long",
            "string.max":"Last name must be at most 20 characters long",
            "any.required":"Last name is required"
        }),
        email:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).required().messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        password:joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required().messages({
            "string.pattern.base":"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character",
            "any.required":"Password is required"
        }),
        repeat_password:joi.string().valid(joi.ref("password")).required().messages({
            "any.only":"Password must match",
            "any.required":"reapeat_password is required"
        }),
        recoveryEmail:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).required().messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        role:joi.string().valid("User","Company_HR").default("User").messages({
            "any.required":"role is required"

        }),
        DOB:joi.date().required().messages({
            "any.required":"Date of birth is required",
            "date.min":"Maximum age is 60",
            "date.max":"Minimum age is 18"
        }),
        mobileNumber:joi.string().pattern(new RegExp("^[0-9]{11}$")).required().messages({
            "string.pattern.base":"Mobile number must be 10 digits long",
            "any.required":"Mobile number is required"
        })

    })
}


export const loginValid = {
    body: joi.object({
        email:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        mobileNumber:joi.string().pattern(new RegExp("^[0-9]{11}$")).messages({
            "string.pattern.base":"Mobile number must be 10 digits long",
            "any.required":"Mobile number is required"
        }),
        recoveryEmail:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        password:joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required().messages({
            "string.pattern.base":"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character",
            "any.required":"Password is required"
        }),
    })
}


export const updateValid= {
    body:joi.object({
        firstName:joi.string().min(3).max(20).messages({
            "string.min":"First name must be at least 3 characters long",
            "string.max":"First name must be at most 20 characters long",
            "any.required":"First name is required"
        }),
        lastName:joi.string().min(3).max(20).messages({
            "string.min":"Last name must be at least 3 characters long",
            "string.max":"Last name must be at most 20 characters long",
            "any.required":"Last name is required"
        }),
        email:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        recoveryEmail:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        DOB:joi.date().min(1-1-1964).max(31-12-2005).messages({
            "any.required":"Date of birth is required",
            "date.min":"Maximum age is 60",
            "date.max":"Minimum age is 18"
        }),
        mobileNumber:joi.string().pattern(new RegExp("^[0-9]{11}$")).messages({
            "string.pattern.base":"Mobile number must be 10 digits long",
            "any.required":"Mobile number is required"
        }),
    })
    // headers:joi.object({
    //     alg: joi.string().valid('HS256', 'RS256').required().messages({
    //         "string.base":"Algorithm is not valid",
    //         "any.required":"Algorithm is required"
    //     }),
    //     typ: joi.string().valid('JWT').required().messages({
    //         "string.base":"Type is not valid",
    //         "any.required":"Type is required"
    //     })
    // }).options({stripUnknown:true})
}


export const deleteValid = {
    headers:joi.object({
        alg: joi.string().valid('HS256', 'RS256').required().messages({
            "string.base":"Algorithm is not valid",
            "any.required":"Algorithm is required"
        }),
        typ: joi.string().valid('JWT').required().messages({
            "string.base":"Type is not valid",
            "any.required":"Type is required"
        })
    }).options({stripUnknown:true})
}

export const updatePasswordValid= {
    body: joi.object({


        email:joi.string().email({tlds:{allow:['net','com']},maxDomainSegments:3}).required().messages({
            "string.email":"Email is not valid",
            "any.required":"Email is required"
            
        }),
        newPassword:joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required().messages({
            "string.pattern.base":"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character",
            "any.required":"Password is required"
        }),
        repeat_password:joi.string().valid(joi.ref("newPassword")).required().messages({
            "any.only":"Password must match",
            "any.required":"reapeat_password is required"
        }),
        otp: joi.string().length(6).required().messages({
            "string.length":"OTP must be 6 characters long",
            "any.required":"OTP is required"
        }),
    }),
    

}