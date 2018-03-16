const express = require("express"),
    middleware = require("../middleware");

const router  = express.Router();

// Index Route
router.get("/", middleware.isNotLoggedIn, (req, res) => {
    res.render("index");
});

router.get("/download", (req, res) => {
    res.download("app/Homework.apk");

});

module.exports = router;
