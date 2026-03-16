import exp from 'express'
import { userModel } from '../models/usermodel.js'

export const Userapp= exp.Router()

Userapp.get('/users',async(req,res)=>{
    let users= await userModel.find()
    res.status(200).json({message:"users list",payload:users})

})

Userapp.post('/user',async(req,res)=>{
    let newuser=req.body
    let userdoc= await userModel(newuser)
    await userdoc.save()
    res.status(201).json({message:"user created",payload:newuser})
})