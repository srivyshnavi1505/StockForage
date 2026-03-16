import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import { userModel } from '../models/usermodel.js';

export const authenticate=async({email,password})=>{

    const user= await userModel.findOne({email})
    if (!user){
        const err= new Error("invalid email") 
        err.status=401
        throw err //this will be caught by error handling middle ware
    }
    //comparing the pwds
    const isMatch= await bcrypt.compare(password,user.password)
    if (!isMatch){
        const err= new Error("invalid password")
        err.status=401
        throw err
    }

    const token= jwt.sign(
        {
        email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h",
        }
    )

    const userObj= user.toObject()
    delete userObj.password;

    return {token, user:userObj}

}