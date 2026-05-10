import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//Security for protected routes using jwt

const protect= async (req,res,next)=>{

    // Extract the token from the header
    let token=req.headers.authorization?.startsWith('Bearer')? req.headers.authorization.split(' ')[1] :null

    if(!token){
        return res.status(401).json({message: 'Not authorizes, no token'})

    }
    try {
        //Decode the token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return  res.status(401).json({message:"Token is invalid . Ref->authMiddleware.js"})
        }
        //Find the User with the id and inject to req object exclude password
        req.user= await User.findById(decoded.id).select('-password')

    if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' })
    }

    next()


    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' })
    }
}



// Verification of role access 
//Validating the roles ie customer, provider and admin

// This will be done only if the above jwt verifiction is competed

const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
        return res.status(403).json({
    message: `Access denied. "${req.user.role}" cannot access this route.`,
    })   
        }

        next();
    }
}


export {protect , authorizeRoles}



