import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,unique:true,lowercase:true,trim:true},
        password:{type:String,required:true,minlength:6},

        role: {
        type: String,
        enum: ['customer', 'provider', 'admin'],
        default: 'customer',
        },

        phone:{ type: String },
        city:{ type: String, trim: true },
        profileImage:{ type: String, default: '' },

        //Only for Service provider!!
        bio:         { type: String },
        skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
        experience:  { type: Number, default: 0 }, // years
        isApproved:  { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
    },

    {
        timestamps: true
    }
)


//Pre hooks -> Hash the password before saving it to database

userSchema.pre('save',async function (){
    if(!this.isModified('password')) return 
    this.password=await bcrypt.hash(this.password,12)
})

// Compare the password while login -> Schema methods
userSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    return obj
}

const User=mongoose.model('User',userSchema)

export default User


