import jwt from 'jsonwebtoken'

export const login=(req,res,next)=>{
    try {
        const {username,password}=req.body
const envUsername = process.env.ADMIN_USERNAME.trim();
 const envPassword = process.env.ADMIN_PASSWORD.trim();
if(username!== envUsername || password!== envPassword)
res.status(403).json({message:"invalid username and password"})

    const token =jwt.sign({role:"admin"},process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie('token',token,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge:24*60*60*1000

    });

    res.status(200).json({success:true,
        message:"logged in successfully"})

} 
catch (error) {
        next(error)
    }

}


 export const logout= (req,res)=>{
    res.cookie('token',none,
        {
        expiresIn:new Date(Date.now()+10*1000),
        httpOnly:true
        })

    res.statu(200).
    json({success:true,message:"user logout successfully!"})
}