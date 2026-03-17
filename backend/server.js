import exp from 'express'
import { connect } from 'mongoose'
import { Userapp } from './APIS/UserAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = exp()
app.use(cors({origin:['http://localhost:5173'],credentials:true}))
app.use(exp.json())
app.use(cookieParser())

async function connectDB() {
    try{
        await connect(process.env.MONGO_URL)
        console.log("connected to database")
        app.listen(3000,()=>console.log("listening on port 3000...."))
    }
    catch(err){
        console.log('error occured:',err)
    }
    
}
connectDB()
function ErrorHandler(err,req,res,next){
    res.status(400).json({message:"error occured",payload:err.message})
}

//middlewares
app.use(cookieParser())
app.use(exp.json()) //body parsing middleware
app.use('/user-api',Userapp) //middlewares for routes
app.use(ErrorHandler) //error handling middleware
