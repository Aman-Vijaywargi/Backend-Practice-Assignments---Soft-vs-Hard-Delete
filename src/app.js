const express = require('express');
const Student = require('./models/Student');


const app = express();

// middleware 
app.use(express.json());

// Routes

// Get all the students
app.get('/students', async (req, res) => {
    // write your codes here
    const students = await Student.find();
    res.send(students)
})

// Add student to database
app.post('/students', async (req, res) =>{
    // write your codes here
    if(!req.body.name || !req.body.sex || !req.body.age || 
        !req.body.class || !req.body.grade_point ){
            res.status(400).send({message: 'Please send appropriate data'})
    }
    let student = new Student({
        name : req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        class: req.body.class,
        grade_point: req.body.grade_point
    })
    let s  = await student.save();
    res.send(s)
})

// Get specific student
app.get('/students/:id', async (req, res) =>{
    // write your codes here
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            res.status(404).send({message: "no longer exist/record not found"})
        }
        res.send(student)
    }catch(e){
        res.status(404).send({message:e.message})
    }
})

// delete specific student
app.delete('/student/:id', async (req, res) =>{
    // write your codes here
    try{
        
        if(req.query.type=="soft"){

            const s = await Student.findById(req.params.id);
            if(!s || s.isDeleted){
                res.status(404).send(s)
            }
            const student = await Student.update({_id: req.params.id},{
                $set:{
                    isDeleted: true
                }
            }, {new: true}
            )
            res.send(student);
            
        }
        if(req.query.type == "hard"){
            const s = await Student.findById(req.params.id);
            if(!s || s.isDeleted){
                res.status(404).send(s)
            }
            const result = await Student.findByIdAndDelete(req.params.id);
            res.send(result)
        }

    }catch(e){
        res.send({message: e.message})
    }
}) 


module.exports = app;
