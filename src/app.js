const express = require("express");

const Student = require("./models/Student");

 

const app = express();

 

// middleware

app.use(express.json());

 

// Routes

 

// Get all the students

app.get("/students", async (req, res) => {

 // write your codes here

 const students = await Student.find({ isDeleted: false });

 if (!students.length) return res.sendStatus(404);

 res.send(students);

});

 

// Add student to database

app.post("/students", async (req, res) => {

 // write your codes here

 

 const student = new Student({

   name: req.body.name,

   sex: req.body.sex,

   age: req.body.age,

   class: req.body.class,

   grade_point: req.body.grade_point,

 });

 

 await student.save();

 res.send(student);

});

 

// Get specific student

app.get("/students/:id", async (req, res) => {

 // write your codes here

 const student = await Student.findById(req.params.id);

 if (student.isDeleted) return res.sendStatus(404);

 res.send(student);

});

 

// delete specific student

app.delete("/student/:id", async (req, res) => {

 // write your codes here

 if (req.query.type === "soft") {

   const student = await Student.findById(req.params.id);

   if (student.isDeleted) return res.sendStatus(404);

   student.isDeleted = true;

   await student.save();

   res.sendStatus(200);

 }

 if (req.query.type === "hard") {

   await Student.findByIdAndDelete(req.params.id, function (err, docs) {

   if (err){

       res.sendStatus(404)

   }

   else{

       res.sendStatus(200)

   }

});

 }

});

 

app.delete("/students/:id", async (req, res) => {

 if (req.query.type == "soft") {

   const student = await Student.findById(req.params.id);

   if (student.isDeleted) return res.sendStatus(404);

   student.isDeleted = true;

   await student.save();

   res.sendStatus(200);

 }

 if (req.query.type == "hard") {

   await Student.findByIdAndDelete(req.params.id, function (err, docs) {

   if (err){

       res.sendStatus(404)

   }

   else{

       res.sendStatus(200)

   }

});

 }

});

 

module.exports = app;
