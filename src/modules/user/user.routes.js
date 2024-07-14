import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import * as UV from "./user.validation.js"
import * as UC from "./user.controller.js"
import { auth } from "../../middlewares/auth.js"



const router = Router()

// =====================1.sign up =================================
router.post("/",validation(UV.signUpValidation),UC.addUser)

// ==========================confirmEmail=======================
router.get("/confirmEmail/:token", UC.confirmEmail)


// ==========================2.login=======================
router.post("/login",validation(UV.loginValid), UC.login)


// ==========================3.update account=======================
router.patch("/update/:id",auth(),validation(UV.updateValid),UC.updateUser)


// ==========================4.delete account=======================
router.delete("/:id", auth(),UC.deleteUser)


// ===========================5.Get user account data============================================
router.get("/:id",auth(),UC.getUserData)


//=============================6.Get profile data for another user ==================================
router.get("/profile/:id",auth(),UC.getProfileData)


// =============================7.Update password ======================================================
router.post("/updatePassword",validation(UV.updatePasswordValid),UC.updatePassword)


// =============================8.forgot password========================================
router.post("/forgotPassword", UC.forgetPassword)


//====================== 9.Get all accounts associated to a specific recovery Email =============
router.post("/getAcc",auth(),UC.getUsersWithRecovEmail)

export default router 