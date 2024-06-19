import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

//Book an appointment
export const postAppointment = catchAsyncError(async (req, res, next) => {
    const {firstName, lastName, email, phone, pan, dob,
        gender, appoinntment_date, department, doctor_firstName,
        doctor_lastName, hasVisited, address
    } = req.body

    if(!firstName || !lastName || !email || !phone || !pan || !dob || 
        !gender || !appoinntment_date || !department || !doctor_firstName ||
        !doctor_lastName || !address){
        return next(new ErrorHandler("Please fill all the fields", 400))
        }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName : doctor_lastName,
        role : "Doctor",
        doctorDepartment : department
    })

    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor not found", 400))
    }
    if(isConflict.length > 1){
        return next(new ErrorHandler("Doctor conflict! please contact through email or phone", 400))
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
        firstName, lastName, email, phone, pan, dob,patientId,doctorId,
        gender, appoinntment_date, department, hasVisited, address,
        doctor:{
            firstName: doctor_firstName,
            lastName: doctor_lastName}
        });
    
    res.status(200).json({
        success: true,
        message : "Appointment send successfully",
        appointment
    })
});

//Get all appointments
export const getAllAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Appointment.find()
    res.status(200).json({
        success: true,
        appointments
    })
});

//Update an appointment
export const updateAppointment = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404))
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        appointment
    })
});

//Delete an appointment
export const deleteAppointment = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404))
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully"
    })
})