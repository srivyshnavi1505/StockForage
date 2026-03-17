import axios from "axios"
import { create } from "zustand"

export const useAuth = create((set)=>({

    currentUser:null,
    isAuthenticated:false,
    loading:false,
    error:null,

    login:async(userCredObj)=>{

        try{

            set({loading:true,error:null})

            let res = await axios.post(
                "http://localhost:3000/user-api/login",
                userCredObj,
                {withCredentials:true}
            )

            console.log(res)

            set({
                loading:false,
                isAuthenticated:true,
                currentUser:res.data.payload
            })

        }catch(err){

            console.log(err)

            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err
            })

        }

    },

    logout:async()=>{

        try{

            set({loading:true,error:null})

            await axios.get(
                "http://localhost:3000/user-api/logout",
                {withCredentials:true}
            )

            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
            })

        }
        catch(err){

            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.error || "LOGOUT Failed"
            })

        }

    }

}))