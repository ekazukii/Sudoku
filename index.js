var express = require('express');
var app = express();
var server = require('http').Server(app); 
var mysql = require('mysql');
var crypto = require('crypto');

server.listen(8080);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sudoku"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SHOW DATABASES LIKE 'sudoku'", function (err, result) { 
    if (err) throw err; 
    if (typeof result[0] === 'undefined') {
        con.query("CREATE DATABASE sudoku", function (err, result) {
            console.log("Database created");
        });
    }
  });

  con.query("SHOW TABLES LIKE 'users'", function(err, result) {
    if (err) throw err; 
    if (typeof result[0] === 'undefined') {
        con.query("CREATE TABLE users (pseudo VARCHAR())", function (err, result) {
            console.log(result);  
        });
    }
  })
});

/**
 * Function call for print the index
 */
app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    //res.end('Vous êtes à l\'accueil');
    res.render('index.ejs');
});

app.get('/save', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var username = req.query.username;
    var score = req.query.score;

    console.log(req.query);

    sql = "INSERT INTO score (username, score) VALUES ('"+username+"', '"+score+"')";
    con.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });
    res.send(JSON.stringify({}));
})

app.get('/bestScore', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    sql = "SELECT * FROM score ORDER BY score LIMIT 7"
    con.query(sql, function(err, results, fields) {
        if (err) throw err;
        console.log(results)
        res.send(JSON.stringify(results));
    })
})

app.get('/lib/jquery.js', function(req, res) {

    res.setHeader('Content-Type', 'text/javascript');

    //res.end('Vous êtes à l\'accueil');
    res.sendFile(__dirname + '/lib/jquery-min.js');
});

app.get('/js/Array.js', function(req, res) {
    res.setHeader('Content-Type', 'text/javascript');

    res.sendFile(__dirname + '/views/js/Arrays.js');
});

app.get('/js/Sudoku.js', function(req, res) {
    res.setHeader('Content-Type', 'text/javascript');

    res.sendFile(__dirname + '/views/js/Sudoku.js');
});

app.get('/css/style.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');

    //res.end('Vous êtes à l\'accueil');
    res.sendFile(__dirname + '/css/style.css');
});



app.use(function(req, res, next){

    res.setHeader('Content-Type', 'text/plain');

    res.status(404).send("page introuvable");

});