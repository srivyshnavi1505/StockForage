import {model,Schema} from 'mongoose'

const userschema = new Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        unique: true,
        minLength:3,
        maxLength:10
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true, 'email already exists']
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    mobile:{
        type:Number,
        min:99999999,
        unique:[true,'account witht this mobile no already exists'],
        required:[true,'enter a mobile number']
    },
    Wallet:{
        type:Number,
        default:1000000,
        min:0
    }
},{
    timestamps:true,
})

export const userModel= model('user',userschema)