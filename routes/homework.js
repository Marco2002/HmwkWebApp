//======================
// /homework routing
//======================

// Packages
const express  = require("express"),
    moment     = require("moment"),
    middleware = require("../middleware"),
    fun        = require("../functions");

const router  = express.Router({mergeParams: true});

// Index Route
router.get("/", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("SELECT *, schools.name AS school_name, classes.name AS class_name, classes.id AS class_id FROM schools JOIN classes ON classes.school_id = schools.id LEFT JOIN homework ON homework.class_id = classes.id WHERE classes.id = ?", [req.params.class_id], (err, homework, fields) => {

        if(err) {return fun.error(req, res, err, "Error while extracting content from the DB", `/classes/${req.params.class_id}/homework`)}

        db.query("SELECT *, schools.name AS school_name, classes.name AS class_name, classes.id AS class_id FROM schools JOIN classes ON classes.school_id = schools.id LEFT JOIN exams ON exams.class_id = classes.id WHERE classes.id = ?", [req.params.class_id], (err, exams, fields) => {

            if(err) {return fun.error(req, res, err, "Error while extracting content from the DB", `/classes/${req.params.class_id}/homework`)}

            for(let i = 0; i < homework.length; i++) {
                homework[i].date = moment(homework[i].date).format("DD.MM.YYYY");
            }

            for(let i = 0; i < exams.length; i++) {
                exams[i].date = moment(exams[i].date).format("DD.MM.YYYY");
            }

            res.render("home", {
                title: "Homework",
                homework: homework,
                exams: exams
            });
        });
    });
});

// New Route
router.get("/new", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("SELECT *, schools.name AS school_name, classes.name AS class_name, classes.id AS class_id FROM schools JOIN classes ON classes.school_id = schools.id WHERE classes.id = ?", [req.params.class_id], (err, homework, fields) => {

        if(err) {return fun.error(req, res, err, "Error while extracting content from the DB", `/classes/${req.params.class_id}/homework`)}

        res.render("homework/new", {
            title: "Add Homework",
            h: homework[0],
        });
    });
});

// Create Route
router.post("/", middleware.isLoggedIn, (req, res) => {

    req.checkBody("homework[title]", "Title field cannot be empty").notEmpty();
    req.checkBody("homework[title]", "Title cannot be longer than 40 characters").len(1, 40);
    req.checkBody("homework[date]", "Date field cannot be empty").notEmpty();
    req.checkBody("homework[description]", "Description field cannot be empty").notEmpty();
    req.checkBody("homework[description]", "Description cannot be longer than 300 characters").len(1, 300);
    req.checkBody("homework[subject]", "Homework subject field cannot be empty").notEmpty();
    req.checkBody("homework[subject]", "Subject cannot be longer than 20 characters").len(1, 20);
    req.checkBody("homework[subjectName]", "Subject name field cannot be empty").notEmpty();
    req.checkBody("homework[subjectName]", "Subject name cannot be longer than 20 characters").len(1, 20);

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, `/classes/${req.params.class_id}/homework/new`)}

    const db = require("../db");
    const h = req.body.homework;

    const date = moment(h.date, "DD.MM.YYYY").format("YYYY-MM-DD");

    db.query("INSERT INTO homework (class_id, title, subject, subjectName, date, description) VALUES (?, ?, ?, ?, ?, ?)", [req.params.class_id, h.title, h.subject, h.subjectName, date, h.description], (err, results, fields) => {

        if(err) {return fun.error(req, res, err, "Error while adding your homework", `/classes/${req.params.class_id}/homework`)}

        req.flash("success", "Added homework successfully");
        res.redirect(`/classes/${req.params.class_id}/homework`);
    });
});

// Show Route
router.get("/:id", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("SELECT *, schools.name AS school_name, classes.name AS class_name, classes.id AS class_id FROM schools JOIN classes ON classes.school_id = schools.id LEFT JOIN homework ON homework.class_id = classes.id WHERE homework.id = ?", [req.params.id], (err, homework, fields) => {

        if(err) {return fun.error(req, res, err, "Couldn't find your homework", `/classes/${req.params.class_id}/homework`)}

        homework[0].date = moment(homework[0].date).format("DD.MM.YYYY");

        res.render("homework/show", {
            title: homework[0].subject,
            h: homework[0],
        });
    });
});

// Destroy Route
router.delete("/:id", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("DELETE FROM homework WHERE homework.id = ?", [req.params.id], (err, results, fields) => {

        if(err) {return fun.error(req, res, err, "Error while deleting your homework", `/classes/${req.params.class_id}/homework`)}

        req.flash("success", "Deleted homework successfully");
        res.redirect(`/classes/${req.params.class_id}/homework`);
    });
});

// Edit Route
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("SELECT *, schools.name AS school_name, classes.name AS class_name, classes.id AS class_id FROM schools JOIN classes ON classes.school_id = schools.id LEFT JOIN homework ON homework.class_id = classes.id WHERE homework.id = ?", [req.params.id], (err, homework, fields) => {

        if(err) {return fun.error(req, res, err, "Couldn't find your homework", `/classes/${req.params.class_id}/homework`)}

        homework[0].date = moment(homework[0].date).format("DD.MM.YYYY");

        res.render("homework/edit", {
            title: "Edit Homework",
            h: homework[0],
        });
    });
});

// Update Route
router.put("/:id", middleware.isLoggedIn, (req, res) => {

    req.checkBody("homework[title]", "Title field cannot be empty").notEmpty();
    req.checkBody("homework[title]", "Title cannot be longer than 40 characters").len(1, 40);
    req.checkBody("homework[date]", "Date field cannot be empty").notEmpty();
    req.checkBody("homework[description]", "Description field cannot be empty").notEmpty();
    req.checkBody("homework[description]", "Description cannot be longer than 300 characters").len(1, 300);
    req.checkBody("homework[subject]", "Homework subject field cannot be empty").notEmpty();
    req.checkBody("homework[subject]", "Subject cannot be longer than 20 characters").len(1, 20);
    req.checkBody("homework[subjectName]", "Subject name field cannot be empty").notEmpty();
    req.checkBody("homework[subjectName]", "Subject name cannot be longer than 20 characters").len(1, 20);

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, `/classes/${req.params.class_id}/homework/${req.params.id}/edit`)}

    const db = require("../db");
    const h = req.body.homework;

    const date = moment(h.date, "DD.MM.YYYY").format("YYYY-MM-DD");

    db.query("UPDATE homework SET title = ?, subject = ?, subjectName = ?, date = ?, description = ? WHERE homework.id = ?", [h.title, h.subject, h.subjectName, date, h.description, req.params.id], (err, results, fields) => {

        if(err) {return fun.error(req, res, err, "Error while updating your homework", `/classes/${req.params.class_id}/homework`)}

        req.flash("success", "Updated homework successfully");
        res.redirect(`/classes/${req.params.class_id}/homework`);
    });
});

module.exports = router;
