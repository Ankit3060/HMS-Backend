import express from 'express';
import { getAllDoctor, getUserDetails, patientRegister, 
        logoutAdmin, logoutPatient, addNewDoctor, 
        deleteDoctor} from '../controller/user.controller.js';
import { login } from '../controller/user.controller.js';
import {addAdmin} from '../controller/user.controller.js';
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addAdmin);
router.get("/doctors",getAllDoctor);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/patient/logout",isPatientAuthenticated,logoutPatient);
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);
router.delete("/doctor/delete/:id",isAdminAuthenticated,deleteDoctor);
export default router;