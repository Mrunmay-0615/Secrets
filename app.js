//jshint esversion:6

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


//userSchema.plugin(encrypt, {secret:secret}); -> This will encrypt all the fields.
// To only encrypt certain fields use this:
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['password']});
//We don't have to do anything special in the login section
// It will encrypt when you call save() and decrypt when you call find()

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
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
    username = req.body.username;
    password = req.body.password;
    const newUser = new User({
        email:username,
        password:password
    });
    newUser.save(function(err){
        if(err) {console.log(err);}
        else {res.render("secrets");}
    });
});


app.listen(PORT, function(){
    console.log("Successfully started the server.");
});