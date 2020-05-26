const jwt=require('jsonwebtoken')
const User=require('../models/User')

const auth=async (req,res,next)=>{
    
   try { 
    const token=req.cookies.Authorization.replace('Bearer ',"")
    // const token=req.header("Authorization").replace('Bearer ',"")
    const decoded=await jwt.verify(token,process.env.SECRET)
    const user=await User.findOne({_id: decoded._id, token: token})

    if(!user) throw new Error('Invalid User')
    
    req.token=token
    req.user=user
    next()
} catch(err) {
    res.status(401).send({'Error': 'Authentication Required'})
}
}

module.exports=auth