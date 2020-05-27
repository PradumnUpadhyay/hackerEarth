const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./Task')

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,

        validator(value) {
            if(!validator.isEmail(value)) throw new Error('Invalid Email')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,

        validator(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Password contains "password" or length is less than 6')
        }
    },
    token: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

// Creating virtual schema
userSchema.virtual('tasks',{
   ref: 'tasks',
   localField: '_id',
   foreignField: 'owner'
})

// Finding user by credentials
userSchema.statics.findByCredentials=async (email,password)=> {
        const user=await User.findOne({ email })
        if(!user) throw new Error('Unable to Login')

        const isValid=await bcrypt.compare(password, user.password)
        if(!isValid) throw new Error('Unable to Login')

        return user
}

// Generating Auth Token
userSchema.methods.generateAuthToken=async function() {
        const user=this
        const token=await jwt.sign({ _id: user._id.toString() },process.env.SECRET)
        console.log("token generator",token)
        return token
    }

// Deleting user
userSchema.pre('remove',async function(next) {
    const user=this
    await Task.deleteMany({ owner: user._id })
    next()
})

// Hashing Password
userSchema.pre('save',async function(next){
    const user=this
    
    if(user.isModified('password')) {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

const User=mongoose.model('users',userSchema)

module.exports=User