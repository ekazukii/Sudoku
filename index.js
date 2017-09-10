var express = require('express');
var app = express();
var server = require('http').Server(app); 
var fs = require('fs');

server.listen(8080);
/**
 * Function call for print the index
 */
app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    //res.end('Vous êtes à l\'accueil');
    res.render('index.ejs');
});

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