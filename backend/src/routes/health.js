//file purpose to check if backend is ready 

import express from "express"
const router=express.Router()


router.get('/health',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Aws resource manager api is running securely",
        timestamps:new Date().toISOString(),
        uptime:process.uptime()

    });
})

export default router