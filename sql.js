var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'yashgupta',
  database : 'a1'
});
var port = 3703;
var express = require("express");
var app =express();

app.get("/login", function(req, res){
    console.log("viola")
    var tname= req.url.split('?')[1].split('&')[0].split('=')[1];
    console.log(tname);
    connection.query('SELECT * from '+String(tname), function(err, rows, fields) {
  if (!err)
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.send(rows);
	} 
 else
    console.log('Error while performing Query.');
	});
});
app.listen(port);
