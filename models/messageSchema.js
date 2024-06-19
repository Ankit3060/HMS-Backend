import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
    message : {
        type : String,
        required : true,
        minLength : [10,"Message should be atleast 10 characters long"],
    }
}, { timestamps: true })

export const Message = mongoose.model("Message",messageSchema);