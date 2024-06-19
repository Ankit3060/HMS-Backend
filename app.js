import express from 'express';
import {config} from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import messageRouter from './router/messageRouter.js';
import {errorMiddleware} from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();
// Load environment variables
config({path: "./config/config.env"});

// Connecting frontend with backend middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))

//using cookie parser middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//Routes
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
// app.use("/api/v1/user",userRouter);
app.use("/api/v1/appiontment",appointmentRouter);

//Connecting to database
dbConnection();


// Error middleware
app.use(errorMiddleware);
export default app;