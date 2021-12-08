//Express
const express = require("express");
const app = express();

//Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Server starten
app.listen(3000, function(){
    console.log("Loud and clear");
});

//EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//SQL
const DATABASE = "web.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

//File Upload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// "images" Ordner frei lassen
app.use(express.static(__dirname + "/images"));

//GET request
app.get("/upload", function(req, res){
    res.sendFile(__dirname + "/views/upload.html");
})

app.get("/galerie", function(req, res){
    q = 'SELECT * FROM album'
    db.all(q,(err,rows)=>{
        if(err) throw err;
        console.log(rows);
        if(rows.length > 0){
            res.render("galerie", {"photos":rows});
        }
        else {
            res.redirect("/upload");
        }
    });
});

//POST
app.post("/uploadDB", function(req, res){
    const file = req.files.upload;
    const name = req.body.title;
    const descript = req.body.descript
    const now = new Date();
    let newFilename = now.valueOf() + file.name;
    file.mv(__dirname + "/images/" + newFilename);
    q = 'INSERT INTO album VALUES(NULL,?,?,?)'
    db.all(q,[name,descript,newFilename], (err,rows)=>{
        if(err) throw err;
        res.redirect("/galerie");
    });
});