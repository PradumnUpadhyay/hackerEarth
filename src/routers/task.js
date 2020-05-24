const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const Task=require('../models/Task')

// Creating task
router.get('/tasks',auth,(req,res)=>{
    console.log(req.user)
    // res.header("Authorization",req.user.token)
    res.send('Render Add-task page...')
})

router.post('/tasks',auth,async (req,res)=>{
        try {
            const task=new Task({ ...req.body, owner: req.user._id })
            await task.save()
            res.status(201).send(task)
        } catch(err) {
            res.status(501).send(err)
        }
})

// Reading/Displaying Task
router.get('/tasks/display',auth,async (req,res)=>{
    const match={},sort={}
 
    if(req.query.task) {
        match.task=req.query.task==='true'
    }
    if(req.query.status) {
        match.status=req.query.status==='true'
    }
    if(req.query.label) {
        match.label=req.query.label==='true'
    }

    if(req.query.sortBy) {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1] === 'desc' ? -1 : 1
    }

        try {

            await req.user.populate({
                path: 'tasks',
                match, 
                // Options are being used for pagination to limit tasks per page to be shown
                options : {
                     limit: 3, 
                     skip: 2
                     },
                      sort
            }).execPopulate()
            res.status(200).send(req.user.tasks)

        } catch(err) {
            res.status(404).send(err)
        }
})

// Updating Task
router.patch('/tasks/:id',auth,async (req,res)=>{
    const prop=['task','label','status']
    const keys=Object.keys(req.body)

    const isValidOperation=keys.every(val=> prop.includes(val))

    if(!isValidOperation) return res.status(401).send({ "Error": "Invlaid Update Operation" })

    try {
        const task=await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if(!task) return res.status(404).send({"Error": "Task not Found!"})

        keys.forEach(val=> task[val]=req.body[val] )
        await task.save()
        res.status(200).send(task)

    } catch(err) {
        res.status(500).send(err)
    }
})


// Deleting Task
router.delete('/tasks/:id',auth,async (req,res)=>{
    try {
        const task=await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if(!task) return res.status(404).send({"Error": "Task not Found!"})

        res.status(200).send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})

module.exports=router