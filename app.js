//jshint esversion:6

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose")
const md5 = require("md5");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email:username}, function(err, foundUser){
        if(err) {console.log(err);}
        else if(!foundUser) {res.send("Invalid Username");}
        else if(foundUser.password!==password) {res.send("Wrong Password. Try Again")}
        else {res.render("secrets");}
    });
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newUser.save(function(err){
        if(err) {console.log(err);}
        else {res.render("secrets");}
    });
});


app.listen(PORT, function(){
    console.log("Successfully started the server.");
});