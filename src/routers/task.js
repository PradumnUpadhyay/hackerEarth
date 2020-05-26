const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const Task=require('../models/Task')

// Creating task
router.get('/tasks',auth,(req,res)=>{
    console.log(req.user)
    // res.clearCookie("Authorization")
    res.render('task', { name: "Pradumn Upadhyay" })
})

router.post('/tasks',auth,async (req,res)=>{
        try {
            const task=new Task({ ...req.body, owner: req.user._id })
            await task.save()
            res.status(201).redirect('/tasks/display')
        } catch(err) {
            res.status(501).send(err)
        }
})

// Reading/Displaying Task
// router.get('/tasks/display',auth,async (req,res)=>{
//     const match={},sort={}
 
//     if(req.query.task) {
//         match.task=req.query.task==='true'
//     }
//     if(req.query.status) {
//         match.status=req.query.status==='true'
//     }
//     if(req.query.label) {
//         match.label=req.query.label==='true'
//     }

//     if(req.query.sortBy) {
//         const parts=req.query.sortBy.split(':')
//         sort[parts[0]]=parts[1] === 'desc' ? -1 : 1
//     }

//         try {

//             await req.user.populate({
//                 path: 'tasks',
//                 match, 
//                 // Options are being used for pagination to limit tasks per page to be shown
//                 options : {
//                      limit: 3, 
//                      skip: 2
//                      },
//                       sort
//             }).execPopulate()
//             console.log(req.user.tasks)
//             res.status(200).render('display', { tasks: req.user.tasks })

//         } catch(err) {
//             res.status(404).send(err)
//         }
// })

router.get('/tasks/display',auth,async (req, res)=>{
    try {
        const task=await Task.find({ owner: req.user._id })
        if(!task) throw new Error('Task not found!')

        res.status(200).render('display', {
            tasks: task
        })
    } catch(err) {
        res.status(400).send(err)
    }
})

// Updating Task
router.get('/tasks/update/:id',auth,async (req,res)=>{
    try {
        const task=await Task.find({ _id: req.params.id, owner: req.user._id })

        if(!task) throw new Error('Task not Found!')
        console.log(task)
        res.status(200).render('update', {
            id: task._id,
            task: task
        })
    } catch(err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.post('/tasks/update/:id',auth,async (req,res)=>{
    const prop=['task','status','label']
    const keys=Object.keys(req.body)
    console.log(keys)   
    const isValidOperation=keys.every(val=> prop.includes(val))

    if(!isValidOperation) return res.status(401).send({ "Error": "Invlaid Update Operation" })

    try {
        const task=await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if(!task) return res.status(404).send({"Error": "Task not Found!"})

        keys.forEach(val=> task[val]=req.body[val] )
        await task.save()
        console.log(task)
        res.status(200).redirect('/tasks/display')

    } catch(err) {
        res.status(500).send(err)
    }
})


// Deleting Task
router.get('/tasks/:id',auth,async (req,res)=>{
    try {
        
        const task=await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if(!task) return res.status(404).send({"Error": "Task not Found!"})

        // res.status(200).send(task)
        res.status(200).redirect('/tasks/display')
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports=router