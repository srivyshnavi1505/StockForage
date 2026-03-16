import exp from 'express'
import { connect } from 'mongoose'
import { Userapp } from './APIS/UserAPI.js'

const app = exp()

async function connectDB() {
    try{
        connect('mongodb://localhost:27017/stocks')
        console.log("connected to database")
        app.listen(3000,()=>console.log("listening on port 3000...."))
    }
    catch(err){
        console.log('error occured:',err)
    }
    
}
connectDB()

//middlewares
app.use(exp.json()) //body parsing middleware

//middlewares for routes
app.use('/user-api',Userapp)
