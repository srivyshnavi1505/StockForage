import {model,Schema} from 'mongoose'

const userschema = new Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        minLength:3
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true, 'email already exists']
    },
    mobile:{
        type:Number,
        min:99999999,
        unique:[true,'account witht this mobile no already exists'],
        required:[true,'enter a mobile number']
    },
    cash:{
        type:Number,
        default:1000000
    }
},{
    timestamps:true,
})

export const userModel= model('user',userschema)