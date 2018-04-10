// ========================
// User Auth Routing
// ========================

// Packages
const express       = require("express");
const passport      = require("passport");
const passwordHash  = require("password-hash");
const fun           = require("../functions");
const middleware    = require("../middleware");

const router = express.Router();

router.get("/register", middleware.isNotLoggedIn, (req, res) => {
    res.render("auth/register");
});

router.post("/register", middleware.isNotLoggedIn, (req, res) => {

    req.checkBody("username", "Username field cannot be empty").notEmpty();
    req.checkBody("username", "Username must be between 4-15 characters long").len(4, 15);
    req.checkBody("password", "Password field cannot be empty").notEmpty();
    req.checkBody("password", "Password must be at least 8 characters long").len(8, 100);
    req.checkBody("reenterPassword", "Passwords do not match, please try again").equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, "/register")}

    const db = require("../db");
    
    const hash = passwordHash.generate(req.body.password);
    
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, hash], (err, results, fields) => {
        
        if(err) {return fun.error(req, res, err, "Username already taken", "/register")}

        db.query("SELECT * FROM users WHERE username = ?", [req.body.username], (err, results, fields) => {

            if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}

            req.login(results[0], (err) => {
                
                if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}

                res.redirect("/classes/0/homework");
            });
        });
    });
});

router.get("/selectSchool", middleware.isLoggedIn, (req, res) => {

    const db = require("../db");

    db.query("SELECT name FROM schools ORDER BY name", (err, results, fields) => {

        if(err) {return fun.error(req, res, err, "Error while loading schools")}
    
        res.render("auth/register2", {
            schools: results,
        });
    });
});

router.post("/selectSchool", middleware.isLoggedIn, (req, res) => {
    
    req.checkBody("school", "School field cannot be empty").notEmpty();
    req.checkBody("schoolPassword", "Password field cannot be empty").notEmpty();
    req.checkBody("schoolPassword", "Password must be at least 8 characters long").len(8, 100);

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, "/selectSchool")}

    const db = require("../db");
    
    db.query("SELECT id, password FROM schools WHERE schools.name = ?", [req.body.school], (err, results, fields) => {

        if(err) {return fun.error(req, res, err, "Couldn't find your school", "/selectSchool")}

        if(passwordHash.verify(req.body.schoolPassword, results[0].password)) {
            
            db.query("UPDATE users SET school_id = ?, class_id = 0 WHERE id = ?", [results[0].id, req.user.id], (err, results, fields) => {
               
                if(err) {return fun.error(req, res, err, "Error while adding you to the school", "/selectSchool")}
                
                db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results, fields) => {

                    if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}
        
                    req.login(results[0], (err) => {
                        
                        if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}
        
                        res.redirect("/selectClass");
                    });
                });
            });
        } else {
            fun.error(req, res, "", "Wrong school password", "/selectSchool");
        }
    });
});

router.get("/selectClass", middleware.isLoggedIn, (req, res) => {
    
    if(req.user.school_id != 0) {
        
        const db = require("../db");
        
        db.query("SELECT * FROM classes WHERE school_id = ? ORDER BY name", [req.user.school_id], (err, results, fields) => {
            
            if(err) {return fun.error(req, res, err, "Error while loading classes", "/")}
    
            res.render("auth/register3", {
                classes: results,
                school_id: req.user.school_id
            });
        });
    }
});

router.post("/selectClass", middleware.isLoggedIn, (req, res) => {

    req.checkBody("clas", "Class field cannot be empty").notEmpty();

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, "/selectClass")}

    const db = require("../db");
    
    db.query("UPDATE users SET class_id = ? WHERE id = ?", [req.body.clas, req.user.id], (err, results, fields) => {
           
        if(err) {return fun.error(req, res, err, "Error while adding you to the school", "/selectSchool")}
        
        db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results, fields) => {
    
            if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}
    
            req.login(results[0], (err) => {
                
                if(err) {return fun.error(req, res, err, "Error while signing up", "/register")}
    
                res.redirect(`/classes/${results[0].class_id}/homework`);
            });
        });
    });
});

router.get("/login", middleware.isNotLoggedIn, (req, res) => {
    res.render("auth/login");
});

router.post("/login", middleware.isNotLoggedIn, (req, res) => {

    req.checkBody("username", "Username field cannot be empty").notEmpty();
    req.checkBody("password", "Password field cannot be empty").notEmpty();

    const errors = req.validationErrors();
    if(errors) {return fun.error(req, res, "", errors[0].msg, "/login")}

    passport.authenticate("local", (err, user) => {

        if (err) {return fun.error(req, res, err, "Error while logging in", "/login")}

        // Redirect if it fails
        if (!user) {return fun.error(req, res, "", "Wrong password or username", "/login")}

        req.logIn(user, function(err) {

            if (err) {return fun.error(req, res, err, "Error while logging in", "/login")}

            // Redirect if it succeeds
            req.flash("success", `Welcome back ${user.username}`);
            res.redirect("/");

        });
    })(req, res);
});

router.get("/logout", middleware.isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
