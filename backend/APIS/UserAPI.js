import exp from 'express'
import { userModel } from '../models/usermodel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
import { authenticate,register } from '../services/Authservices.js'

export const Userapp= exp.Router()

Userapp.get('/users',async(req,res)=>{
    let users= await userModel.find()
    res.status(200).json({message:"users list",payload:users})

})

Userapp.post('/register',async(req,res)=>{
    let newuser=req.body
    let userdoc= await register({...newuser})
    res.status(201).json({message:"user created",payload:newuser})
})


Userapp.post('/login',async(req,res)=>{
    const {email,password}= req.body
    const {token,user}=await authenticate({email,password})

    res.cookie('token',token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"login succes", payload:user})
})

//write logout code