var User = require("../models/user");

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

middlewareObj.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect(`/schools/${req.user.school}/classes/${req.user.clas}/homework`);
};

module.exports = middlewareObj;