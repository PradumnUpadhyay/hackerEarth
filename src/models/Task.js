const mongoose=require('mongoose')

const taskSchema=mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        default: "New",
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
}, 
    {
        timestamps:true
    }
)

const Task=mongoose.model('tasks',taskSchema)

module.exports=Task