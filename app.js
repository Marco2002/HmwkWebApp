//=============================
// HMWK v0.2
//=============================

// Packages
const express       = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    
// Models
    Homework = require("./models/homework"),

// Routes
    indexRoutes     = require("./routes/index"),
    homeworkRoutes  = require("./routes/homework");

// express setup
const app = express();

// mongoose setup
mongoose.connect("mongodb://localhost/hmwk_db_v0_2");

// ejs setup
app.set("view engine", "ejs");

// setup public directory
app.use(express.static(__dirname + "/public"));

// body-parser setup
app.use(bodyParser.urlencoded({extended: true}));

// method-override setup
app.use(methodOverride("_method"));

// Routes setup
app.use(indexRoutes);
app.use("/homework", homeworkRoutes);

app.listen(process.env.PORT, process.env.IP, () =>
    console.log("server online")
);