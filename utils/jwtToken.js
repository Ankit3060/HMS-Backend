export const generateToken = (user, message, statusCode, res)=>{
    const token = user.geneateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly : true
    }
    res.status(statusCode).cookie(cookieName,token, options).json({
        success : true,
        message : message,
        user,
        token
    })
}