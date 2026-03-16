import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import axios from 'axios'
import { config} from 'dotenv'
config()

export const FetchStockInfo=exp.Router()

//get current, high, low , open of a particular companys stock

FetchStockInfo.get('/:symbol',async(req,res)=>{
    const sym=req.params.symbol.toUpperCase()
    const APIkey=process.env.FINN_APIKEY
     const [quote, profile] = await Promise.all([
    axios.get(`https://finnhub.io/api/v1/quote`,{
        params:{
            symbol:sym,
            token:APIkey
        }
    }),
    axios.get(`https://finnhub.io/api/v1/stock/profile2 `,{
        params:{
            symbol:sym,
            token:APIkey
        }
    })
        ]);
    res.status(200).json({message:"response - contains open,high,low,current(LTP) ",
        payload:{
            open:quote.data.o,
            high:quote.data.h,
            low:quote.data.l,
            currrent:quote.data.c,
            companyname:profile.data.name || 'unknown'
            }
        })

})