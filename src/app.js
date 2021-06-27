const express = require("express");
const Student = require("./models/Student");
const app = express();

app.use(express.json());

app.get("/students", async (req, res) => {
    const students = await Student.find({ isDeleted: false });
    if (!students.length) return res.sendStatus(404);
    res.send(students);
});

app.post("/students", async (req, res) => {
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

app.get("/students/:id", async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student.isDeleted)
        return res.sendStatus(404);
    res.send(student);
});

app.delete("/students/:id", async (req, res) => {
    if (req.query.type == "soft") {
        const student = await Student.findById(req.params.id);
        if (student.isDeleted) return res.sendStatus(404);
        student.isDeleted = true;
        await student.save();
        res.sendStatus(200);
    }
     if(req.query.type === "hard") {
         await Student.deleteOne({_id:req.params.id}); 
         res.sendStatus(200);
     }
});

module.exports = app;
