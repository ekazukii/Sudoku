var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var mysql   = require('mysql');
var crypto  = require('crypto');

server.listen(8080);

var con = mysql.createConnection({
  database : "sudoku",
  password : "root",
  host     : "localhost",
  user     : "root"
});

con.connect(function(err) {
  if (err) {
    //throw(err);
  } else {
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
    });
  }
});

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.render('index.ejs');
});

app.get('/save', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var username = req.query.username;
  var score = req.query.score;
  //console.log(req.query);
  sql = "INSERT INTO score (username, score) VALUES ('"+username+"', '"+score+"')";
  con.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  res.send(JSON.stringify({}));
});

app.get('/bestScore', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  sql = "SELECT * FROM score ORDER BY score LIMIT 7";
  con.query(sql, function(err, results, fields) {
    if (err) throw err;
    console.log(results);
    res.send(JSON.stringify(results));
  });
});

// libs
app.get('/lib/Arrays.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/lib/Arrays.js');
});

app.get('/js/Sudoku.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/views/js/Sudoku.js');
});

app.get('/lib/jquery.min.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/lib/jquery-min.js');
});

app.get('/lib/underscore-min.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/lib/underscore-min.js');
});

app.get('/lib/backboon.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/lib/backboon.js');
});

// App files
app.get('/app/collection.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/app/collection.js');
});

app.get('/app/sudoku-app.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/app/sudoku-app.js');
});

app.get('/app/sudoku-cell.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/app/sudoku-cell.js');
});

app.get('/app/sudoku-view.js', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/app/sudoku-view.js');
});

// styles
app.get('/assets/styles.css', function(req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/assets/styles.css');
});

// 404
app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send("page introuvable");
});
