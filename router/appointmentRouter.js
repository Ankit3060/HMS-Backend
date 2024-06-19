import express from 'express';
import {deleteAppointment, getAllAppointments, postAppointment, updateAppointment} from "../controller/appointment.controller.js"
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/post",isPatientAuthenticated,postAppointment);
router.get("/get",isAdminAuthenticated,getAllAppointments);
router.put("/update/:id",isAdminAuthenticated,updateAppointment);
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment)

export default router;