import {User} from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary";

//Register patient
export const patientRegister = catchAsyncError(async (req, res, next) => {
    const {firstName, lastName, email, phone, 
            pan, dob, gender, password, role} = req.body;
    
    //Checking if all fields are entered
    if(!firstName || !lastName || !email || !phone || !pan || !dob || !gender || !password || !role){
        return next(new ErrorHandler("All fields are required",400));
    }

    //Checking if email already exists
    const isEmailExist = await User.findOne({ email });
    if(isEmailExist){
        return next(new ErrorHandler("Email already registered",400));
    }

    //Here we are registring patient 
    const user = await User.create({
        firstName, lastName, email, phone, pan, dob, gender, password, role});

    //Generating token
    generateToken(user, "Patient registered" , 201, res)

    // res.status(201).json({
    //     success:true, 
    //     message : "Patient registered successfully", user});
})

//Login
export const login = catchAsyncError(async (req, res, next) => {
    const {email, password, confirmPassword, role} = req.body;

    //Checking if email and password is entered
    if(!email || !password || !role || !confirmPassword){
        return next(new ErrorHandler("Please enter all the field",400));
    }

    //Checking if password and confirm password is same
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    //Finding user in database
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    //Checking if password is correct
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    //Checking if role is same
    if(role !== user.role){
        return next(new ErrorHandler("Invalid role",401));
    }

    //Generating token
    generateToken(user, "User logged in successfully" , 201, res)

    // res.status(200).json({
    //     success:true, 
    //     message : "User logged in successfully", user});
})

//Add Admin
export const addAdmin = catchAsyncError(async (req, res, next) => {
    const {firstName, lastName, email, phone, 
            pan, dob, gender, password} = req.body;
    
    //Checking if all fields are entered
    if(!firstName || !lastName || !email || !phone || !pan || !dob || !gender || !password){
        return next(new ErrorHandler("All fields are required",400));
    }

    //Checking if email already exists
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already registered`,400));
    }

    const admin = await User.create({
        firstName, lastName, email, phone, pan, dob, gender, password, role : "Admin"});

    //Generating token
    generateToken(admin, "Admin registered" , 201, res)

    // res.status(201).json({
    //     success:true,
    //     message : "Admin registered successfully", admin});
})

//Get All doctor
export const getAllDoctor = catchAsyncError(async(req, res, next) =>{
    const doctors = await User.find({role : "Doctor"});
    res.status(200).json({
        success:true,
        message : "All doctors", doctors});
})

//Get user details
export const getUserDetails = catchAsyncError(async(req, res, next) =>{
    const user = req.user;
    res.status(200).json({
        success:true,
        message : "User details", user});
})

//logout Admin
export const logoutAdmin = catchAsyncError(async(req, res, next) =>{
    res.status(200).cookie("adminToken",null,{
        expires : new Date(Date.now()),
        httpOnly : true
    }).json({
        success:true,
        message : "Admin logged out successfully"});
})

//logout Patient
export const logoutPatient = catchAsyncError(async(req, res, next) =>{
    res.status(200).cookie("patientToken",null,{
        expires : new Date(Date.now()),
        httpOnly : true
    }).json({
        success:true,
        message : "Patient logged out successfully"});
})

//Add doctor
export const addNewDoctor = catchAsyncError(async(req, res, next) =>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar required",400));
    }
    const {docAvatar} = req.files;
    const allowedFormat = ["image/png","image/jpg","image/jpeg", "image/webp"];
    //It will check if the file is image or not if video then return error
    if(!allowedFormat.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("This format not supported",400));
    }

    const {firstName,lastName,email,phone,password,
            pan,gender,dob,doctorDepartment} = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !pan ||
        !gender || !dob || !doctorDepartment){
        return next(new ErrorHandler("All fields are required",400));
        }
    
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email `,400));
    }

    //uploading image on cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
          );
        return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary",500));
    }

    const doctor = await User.create({
        firstName,lastName,email,phone,password,pan,gender,
        dob,doctorDepartment,role:"Doctor",docAvatar:{
            public_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url
        }})
    
    res.status(201).json({
        success:true,
        message : "Doctor added successfully", doctor});
})

//Delete doctor
export const deleteDoctor = catchAsyncError(async(req, res, next) =>{
    const {id} = req.params;
    const doctor = await User.findById(id);
    if(!doctor){
        return next(new ErrorHandler("Doctor not found",404));
    }
    await doctor.deleteOne();
    res.status(200).json({
        success:true,
        message : "Doctor deleted successfully"});
})