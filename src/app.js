const express = require("express");
const Student = require("./models/Student");

const app = express();

// middleware
app.use(express.json());

// Routes

// Get all the students
app.get("/students", async (req, res) => {
	// write your codes here
	res.send(await Student.find());
});

// Add student to database
app.post("/students", async (req, res) => {
	const newStudent = new Student({
		name: req.body.name,
		sex: req.body.sex,
		class: req.body.class,
		age: req.body.age,
		grade_point: req.body.grade,
	});
	await newStudent.save();
	res.send(newStudent);
});

// Get specific student
app.get("/students/:id", async (req, res) => {
	try {
		const doc = await Student.findOne({ _id: req.params.id });
		if (doc == null) {
			res.sendStatus(404);
		} else {
			res.send(doc);
		}
	} catch (err) {
		res.sendStatus(404);
	}
});

// delete specific student
app.delete("/students/:id", async (req, res) => {
	if (req.query.type === "hard") {
		try {
			await Student.deleteOne({ _id: req.params.id });
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(404);
		}
	} else if (req.query.type === "soft") {
		try {
			const doc = await Student.findOne({ _id: req.params.id });
			if (doc == null) {
				res.sendStatus(404);
			} else {
				doc.isDeleted = true;
				await doc.save();
				res.sendStatus(200);
			}
		} catch (err) {
			res.sendStatus(404);
		}
	}
});

module.exports = app;
