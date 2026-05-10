import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'


//Register User
export const register = async (req,res)=>{
    //Get Data from request body
    const {name,email,password,role,phone,city,skills}= req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({message:"Name ,email and password are required"})
    }

    if(role==='admin'){
        return res.status(400).json({ message: 'Cannot self-register as admin' })
    }

    const exists= await User.findOne({email})

    if(exists){
        return res.status(400).json({ message: 'Email already registered' })
    }
    const user=await User.create({
        name,
        email,
        password,
        role: role || 'customer',
        phone,
        city,
        skills,
        // Providers start not approved, customers are auto-approved
        isApproved: role === 'provider' ? false : true,
    })

    res.status(201).json({
        ...user.toJSON(),
        token:generateToken(user._id),
    })
}

//Login

export const login=async (req,res)=>{
    const {email,password}= req.body;
    if(!email || !password){
        res.status(404).json({message:"Email and password is required"})
    }

    const user= await User.findOne({email});

    if(!user || !(user.matchPassword(password))){
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    if(user.role==='provider' && !user.isApproved){
        return res.status(403).json({ message: 'Your account is pending admin approval' })
    
    }

    res.status(200).json({
        ...user.toJSON(),
        token:generateToken(user._id),
    })

}

// Get User
export const getMe= async (req,res)=>{
    res.json(req.user);
}