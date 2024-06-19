import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : [3,"First name should be atleast 3 characters long"],
    },
    lastName : {
        type : String,
        required : true,
        minLength : [3,"Last name should be atleast 3 characters long"],
    },
    email : {
        type : String,
        required : true,
        validator : [validator.isEmail,"Please enter a valid email"]
    },
    phone : {
        type : String,
        required : true,
        minLength : [10,"Phone number should be atleast 10 characters long"],
    },
    pan : {
        type : String,
        required : true,
        minLength : [10,"PAN number should be atleast 10 characters"],
        maxLength : [10,"PAN number should be atleast 10 characters"]
    },
    dob : {
        type : Date,
        required : [true,"Date of birth is required"],
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male" , "Female" , "Other"]
    },
    appoinntment_date : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    doctor : {
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        }
    },
    hasVisited : {
        type : Boolean,
        default : false
    },
    doctorId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        // ref : "User"
    },
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        // ref : "User"
    },
    address : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Pending","Accepted","Rejected"],
        default : "Pending"
    }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);