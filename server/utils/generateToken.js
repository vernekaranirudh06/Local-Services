import jwt from 'jsonwebtoken'


const generateToken= (id)=>{
    if(!id){
        return new Error("Id not found!!");
    }
return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN,
})
}

export default generateToken;