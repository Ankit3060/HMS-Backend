import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    password :{
        type : String,
        required : true,
        minLength : [6,"Password should be atleast 6 characters long"],
        maxLength : [12,"Password should be atmost 12 characters long"],
        select : false  //this will not show password in response
    },
    role : {
        type : String,
        default : "user",
        enum : ["Patient","Admin", "Doctor"]
    },
    doctorDepartment : {
        type : String
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
    // message : {
    //     type : String,
    //     required : true,
    //     minLength : [10,"Message should be atleast 10 characters long"],
        
    // }
}, { timestamps: true })


//Hashing password before saving user
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//Compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generate JWT token
userSchema.methods.geneateJsonWebToken = function(){
    return jwt.sign({id : this._id},process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRE
    })

}

export const User = mongoose.model("User",userSchema);