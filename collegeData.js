require('dotenv').config(); // Load environment variables from .env file
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with database credentials
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    course: DataTypes.INTEGER,
    TA: DataTypes.BOOLEAN,
    status: DataTypes.STRING
}, {
    timestamps: false
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: DataTypes.STRING,
    courseDescription: DataTypes.STRING
}, {
    timestamps: false
});

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.authenticate()
            .then(() => {
                console.log('Connection to the database has been established successfully.');
                resolve();
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
                reject('Unable to connect to the database');
            });
    });
};

// Get all students
module.exports.getAllStudents = function () {
    return Student.findAll()
        .then(data => {
            if (data.length === 0) throw new Error("No students found");
            return data;
        });
};

// Get all TAs
module.exports.getTAs = function () {
    return Student.findAll({ where: { TA: true } })
        .then(data => {
            if (data.length === 0) throw new Error("No TAs found");
            return data;
        });
};

// Get all courses
module.exports.getCourses = function () {
    return Course.findAll()
        .then(data => {
            if (data.length === 0) throw new Error("No courses found");
            return data;
        });
};

// Get student by student number
module.exports.getStudentByNum = function (num) {
    return Student.findOne({ where: { studentNum: num } })
        .then(data => {
            if (!data) throw new Error("Student not found");
            return data;
        });
};

// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return Student.findAll({ where: { course: course } })
        .then(data => {
            if (data.length === 0) throw new Error("No students found for the course");
            return data;
        });
};

// Add a new student
module.exports.addStudent = function (studentData) {
    return Student.create(studentData)
        .then(data => data)
        .catch(err => {
            console.error("Error adding student:", err);
            throw new Error("Unable to add student");
        });
};
