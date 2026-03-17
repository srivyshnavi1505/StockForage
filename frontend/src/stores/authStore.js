import axios from "axios"
import {create} from "zustand"


export const useAuth=create((set)=>({
    currentUser:null,
    isAuthenticate:false,
    loading:false,
    error:null,
    login:async(userCredObj)=>{
        
        try{
            //set loading true
            set({loading:true,error:null})
            //make api call
            let res= await axios.post("http://localhost:3000/user-api/login",userCredObj,{withCredentials:true})
            console.log(res)
            //update state
            set({
                loading:false,
                isAuthenticate:true,
                currentUser:res.data.payload
            })
            
        }catch(err){
            console.log(err)
            set({
                loading:false,
                isAuthenticate:false,
                currentUser:null,
                error:err
            })
        }
    },
    logout:async()=>{
        try{
            //set loading state
            set({loading:true,error:null})
            //make logout
            let res=await axios.get("",{withCredentials:true})
            //update state
            set({
                loading:false,
                isAuthenticate:false,
                currentUser:null,
            })
        }
        catch(err){
            set({
                loading:false,
                isAuthenticate:false,
                currentUser:null,
                error:err.response?.data?.error || "LOGOUT Failed"
            })
        }
    }
}))