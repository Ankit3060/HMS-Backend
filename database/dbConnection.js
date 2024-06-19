import mongoose from "mongoose";

export const dbConnection = async () => {
    mongoose.connect(process.env.MONGO_URL,{
        dbName : "HOSPITAL_MANAGEMENT_SYSTEM_MERN"
    }).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.log("Error in connecting to database",err);
    })
}