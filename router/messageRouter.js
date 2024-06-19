import express from 'express';
import { sendMessage,getAllMessages, deleteMessage } from '../controller/message.controller.js';
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/send",sendMessage);
router.get("/getall",isAdminAuthenticated,getAllMessages);
router.delete("/delete/:id",isAdminAuthenticated,deleteMessage);

export default router;