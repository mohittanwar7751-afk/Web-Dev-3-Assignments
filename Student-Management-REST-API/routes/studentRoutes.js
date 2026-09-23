const express = require("express");

const router = express.Router();

const students = require("../data/students");

// READ - Get all students
router.get("/", (req, res) => {
    res.status(200).send(students);
});

// READ - Get student by ID
router.get("/:id", (req, res) => {
    let id = req.params.id;

    let student = students.find(student => student.id == id);

    if (!student) {
        return res.status(404).send("Student not found");
    }

    res.status(200).send(student);
});

// CREATE - Add a student
router.post("/", (req, res) => {
    let name = req.body.name;
    let course = req.body.course;

    let newStudent = {
        id: students.length + 1,
        name: name,
        course: course
    };

    students.push(newStudent);

    res.status(200).send("Student added");
});

// UPDATE - Update a student
router.put("/:id", (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let course = req.body.course;

    let student = students.find(student => student.id == id);

    if (!student) {
        return res.status(404).send("Student not found");
    }

    student.name = name;
    student.course = course;

    res.status(200).send("Student updated");
});

// DELETE - Delete a student
router.delete("/:id", (req, res) => {
    let id = req.params.id;

    let index = students.findIndex(student => student.id == id);

    if (index == -1) {
        return res.status(404).send("Student not found");
    }

    students.splice(index, 1);

    res.status(200).send("Student deleted");
});

module.exports = router;