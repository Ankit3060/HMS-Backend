import {Message} from "../models/messageSchema.js";
import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

//Sending the message to hospital
export const sendMessage = catchAsyncError (async (req, res, next) => {
    const {firstName, lastName, email, phone, message} = req.body;
    if(!firstName || !lastName || !email || !phone || !message){
        // return res.status(400).json({message : "All fields are required"});
        return next(new ErrorHandler("All fields are required",400));
    }
    await Message.create({
        firstName,
        lastName,
        email,
        phone,
        message
    })
    res.status(201).json({message : "Message sent successfully"});
})

//Get all messages
export const getAllMessages = catchAsyncError(async(req, res) =>{
    const messages = await Message.find();
    res.status(200).json({
        succeess:true,
        messages
    });
})

//Delete message
export const deleteMessage = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    let message = await Message.findById(id);
    if(!message){
        return next(new ErrorHandler("Message not found",404));
    }
    await message.deleteOne();
    res.status(200).json({
        success:true,
        message: "Message deleted successfully"
    })
})