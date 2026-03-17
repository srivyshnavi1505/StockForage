import exp from 'express'
import mongoose from "mongoose";
import { Userapp } from './APIS/UserAPI.js'
import cookieParser from 'cookie-parser'

import { FetchStockInfo } from './APIS/fetchStockInfoAPI.js'
import { startStockSnapshotCron } from './crons/SnapshotCron.js'

import cors from 'cors'
import { config } from 'dotenv';
config()

const app = exp()
app.use(cors({origin:['http://localhost:5173'],credentials:true}))
app.use(exp.json())
app.use(cookieParser())

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to database")
        startStockSnapshotCron();
        app.listen(3000,()=>console.log("listening on port 3000...."))
    }
    catch(err){
        console.log('error occured:',err)
    }
    
}

function ErrorHandler(err,req,res,next){
    res.status(err.status || 500).json({message:"error occured",payload:err.message})
}

//middlewares
app.use(cors({origin:['http://localhost:5173']}))
app.use(cookieParser())
app.use(exp.json()) //body parsing middleware
app.use('/user-api',Userapp) //middlewares for routes
app.use('/stock',FetchStockInfo)
app.use(ErrorHandler) //error handling middleware
connectDB()