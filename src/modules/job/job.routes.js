import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import * as JV from "./job.validation.js";
import * as JC from "./job.controller.js";
import { customFiles, multerLocal } from "../../services/multerLocal.js";

const router = Router()

// ================================1.Add Job ==============================
router.post("/",auth(),validation(JV.addJobValid),JC.addJob)

// ==============================2.update job==============================
router.patch("/:id",auth(),validation(JV.updateJobValid),JC.updateJob)

// ==============================3.delete job==============================
router.delete("/:id",auth(),JC.deleteJob)

// ===================4.Get all Jobs with their company’s information.============
router.get("/",auth(),JC.getJobsWithComp)


//=========================== 5.Get all Jobs for a specific company.==============================
router.get("/getAllJobsForCompany",auth(),JC.getAllJobsForCompany)


// ========================6.Get all Jobs that match the following filters ==========================
router.post("/jobsFilter",auth(),validation(JV.GetAllJobsFilterValid),JC.GetAllJobsFilter),

// ============================7    =========================================================
router.post("/application/:jobId",auth(),multerLocal(customFiles.pdf,"Applications").single("userResume"),validation(JV.addApplicationValid),JC.applyToJob)









export default router