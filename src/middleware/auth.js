const jwt=require('jsonwebtoken')
const User=require('../models/User')

const auth=async (req,res,next)=>{
    
   try { 
    const token=req.cookies.Authorization.replace('Bearer ',"")
    // console.log("Inside header", token)
    const decoded=await jwt.verify(token,'thisismysecret')
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