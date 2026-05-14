import exp from 'express'
import { userModel } from '../models/usermodel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authenticate, register } from '../services/Authservices.js'
import { portfolioSnapshotModel } from '../models/PortfolioSnapshot.js'

export const Userapp = exp.Router()


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

Userapp.get("/users", async (req, res) => {
  try {
    const users = await portfolioSnapshotModel.aggregate([
      {
        $sort: { recordedAt: -1 }  // latest first
      },
      {
        $group: {
          _id: "$user",            // group by user (ObjectId)
          totalPnl: { $first: "$totalPnl" },
          walletBalance: { $first: "$walletBalance" },
          totalValue: { $first: "$totalValue" },
        }
      },
      {
        $lookup: {
          from: "users",           // MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          username: "$userInfo.username",
          walletBalance: 1,
          totalValue: 1,
          totalPnl: 1
        }
      },
      { $sort: { totalPnl: -1 } }
    ]);

    res.status(200).json({ message: "Users fetched successfully", payload: users });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users", payload: err.message });
  }
});
//write logout code
Userapp.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: "logged out" })
})
