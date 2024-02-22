const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
// Register User
app.post("/signup", async (req, res) => {

    const data = {
        fname: req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ email: data.email});

    if (existingUser) {
        res.render('userExisted');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect("/login");
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({email:req.body.email});
        if (!check) {
            return res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
// // npm i mongose
// npm i bcript
// npm i express
// npm -g nodemon
// npm i mongodb
// npm i ejs