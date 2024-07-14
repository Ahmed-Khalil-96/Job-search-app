import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import * as CV from "./company.validation.js";
import * as CC from "./company.controller.js";

const router = Router()


// ==============================1.Add company ==========================================
router.post("/",auth(),validation(CV.addCompanyValid),CC.addCompany)

// =========================confirm company email=======================================
router.get("/confirmEmail/:token",CC.confirmEmail)

// =============================2.Update company data==============================================
router.patch("/:id",auth(),validation(CV.updateCompanyValid),CC.updateCompany)

// ===========================3.Delete company data=====================================================
router.delete("/:id",auth(),CC.deleteCompany)

// ================================4.Get company data =================================================
router.get("/GetCompanyData/:id",auth(),CC.GetCompanyData)

// ==========================================5.Search for a company with a name. ============================
router.post("/findByName",auth(),CC.findCompByName)

// ===========================6.Get all applications for specific Job===========================================
router.get("/getAppsForJob/:jobId",auth(),CC.getAppsForJob)


export default router