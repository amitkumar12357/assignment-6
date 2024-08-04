/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Amit Kumar, Student ID: 160904231, Date: 1 Aug, 2024
* online link : https://github.com/amitkumar12357/assignment-6
********************************************************************************/

require('dotenv').config(); // Load environment variables from .env file
const express = require("express"); // Import Express.js library
const path = require("path"); // Import path module for file path operations
const exphbs = require('express-handlebars'); // Import express-handlebars module
const Sequelize = require('sequelize'); // Import Sequelize for PostgreSQL ORM

const app = express(); // Initialize the Express application
const PORT = process.env.PORT || 8080; // Define the port to use, default to 8080 if not specified

// Database setup
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Set up Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

// Middleware setup
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies

// Define routes

// Home page
app.get("/", (req, res) => {
    res.render("home", { title: "Home" }); // Render the home.hbs view
});

// About page
app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" }); // Render the about.hbs view
});

// HTML Demo page
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo", { title: "HTML Demo" }); // Render the htmlDemo.hbs view
});

// Route to retrieve students based on course query
app.get("/students", async (req, res) => {
    try {
        const students = req.query.course 
            ? await collegeData.getStudentsByCourse(req.query.course) 
            : await collegeData.getAllStudents();
        res.json(students); // Respond with JSON data of students
    } catch (err) {
        res.status(500).json({ message: "Error retrieving students" }); // Handle errors with a message
    }
});

// Route to retrieve teaching assistants
app.get("/tas", async (req, res) => {
    try {
        const tas = await collegeData.getTAs();
        res.json(tas); // Respond with JSON data of TAs
    } catch (err) {
        res.status(500).json({ message: "Error retrieving teaching assistants" }); // Handle errors with a message
    }
});

// Route to retrieve courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await collegeData.getCourses();
        res.json(courses); // Respond with JSON data of courses
    } catch (err) {
        res.status(500).json({ message: "Error retrieving courses" }); // Handle errors with a message
    }
});

// Route to retrieve a specific student by student number
app.get("/student/:num", async (req, res) => {
    try {
        const student = await collegeData.getStudentByNum(req.params.num);
        res.json(student); // Respond with JSON data of the student
    } catch (err) {
        res.status(500).json({ message: "Error retrieving student" }); // Handle errors with a message
    }
});

// Route to serve the Add Student page
app.get("/addStudent", (req, res) => {
    res.render("addStudent", { title: "Add Student" }); // Render the addStudent.hbs view
});

// Route to handle form submission for adding a new student
app.post("/students/add", async (req, res) => {
    try {
        await collegeData.addStudent(req.body); // Assume you have an addStudent function in collegeData.js
        res.redirect("/students"); // Redirect to the students page after adding a student
    } catch (err) {
        res.status(500).json({ message: "Error adding student" }); // Handle errors with a message
    }
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).send("404 Not Found"); // Send a 404 error message
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log server startup message
});
