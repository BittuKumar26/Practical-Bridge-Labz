
/*

Question 1: Student Management API

Task:

Create Student CRUD APIs using:
● Node.js
● Express
● MongoDB
● Mongoose
Student Schema:
{
name: String,
marks: Number,
course: String
}

APIs:
● POST /students
● GET /students
● GET /students/:id
● PUT /students/:id
● DELETE /students/:id
Constraints:
● All fields required
● marks must be greater than or equal to 0
● Return proper status codes and error handling
Bonus:
Create API:
GET /students/topper

Return student having highest marks. 

*/






const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/studentDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const studentSchema=new mongoose.Schema({
    name:{type:String, require:true },
    marks:{type:Number,require:true,min:0},
    course:{type:String,require:true}
});

const Student = mongoose.model('Student', studentSchema);

// create a new student applying post method to the server
app.post('/students', async (req, res) => {
    try {
        const { name, marks, course } = req.body;
        const student = new Student({ name, marks, course });
        await student.save();
        res.status(201).json(student);   
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// get all students applying get method to the server
app.get('/students', async (req, res) => {
    try {   
        const students = await Student.find();
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }   
});


// get a student by id applying get method to the server
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
    res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update a student by id applying put method to the server
app.put('/students/:id', async (req, res) => {
    try {
        const { name, marks, course } = req.body;
        const student = await Student.findByIdAndUpdate(req.params.id, { name, marks, course }, { new: true, runValidators: true });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// delete a student by id applying delete method to the server
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get the student with highest marks applying get method to the server
app.get('/students/topper', async (req, res) => {
    try {
        const student = await Student.findOne().sort({ marks: -1 });
        if (!student) {
            return res.status(404).json({ error: 'No students found' });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

