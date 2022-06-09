const express = require("express");
var cors = require('cors');
var corsMiddleware = require('./cors/cors');
const bodyParser = require("body-parser")
const expat = require("node-expat");
var mysql = require('mysql');
var datos_usuario = []

//Variables requeridas para el HTTPS
const fs = require('fs')
const https = require('https')
const path = require('path')
const port = 3000

//Asignacion del express
var app = express();

//Definiciones para el CORS
app.use(bodyParser.urlencoded({
  extended: true
}));
app.options('*', corsMiddleware);
app.use(corsMiddleware);
app.use(cors());

// Conexion con la BD
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "miprueba"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Peticiones HTTP
app.post("/", function (req, res) {
  console.log('Checking if the user exists');

  datos_usuario = []

  /*let xmlSrc = req.body.data,
    parser = new expat.Parser();*/

  let xmlSrc = '<?xml version="1.0"?> <!DOCTYPE lolz [ <!ENTITY lol "lol"> <!ELEMENT lolz (#PCDATA)> <!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"> <!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;"> <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;"> <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;"> <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;"> <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;"> <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;"> <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;"> <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;"> ]> <lolz>&lol9;</lolz>',
    parser = new expat.Parser();

  parser.on('text', function (text) {
    console.log(text)
    datos_usuario.push(text)
  })

  parser.on('error', function (error) {
    console.error(error)
  })

  parser.write(xmlSrc);

  let sql = `SELECT * FROM users WHERE email='${datos_usuario[0]}' and password='${datos_usuario[1]}'`;

  let query = con.query(sql, (err, result) => {

    if (err) {
      throw err;
    } else {
      if (result.length) {
        console.log('User exists');
        res.send("User exists");
      } else {
        console.log('User not exists');
        res.send("User not exists");
      }
    }

  });

});

app.post("/get_course_data", function (req, res) {

  console.log('Getting course data')

  datos_usuario = []

  let xmlSrc = req.body.data,
    parser = new expat.Parser();

  parser.on('text', function (text) {
    //console.log(text)
    datos_usuario.push(text)
  })

  parser.on('error', function (error) {
    console.error(error)
  })

  parser.write(xmlSrc);

  let sql = `SELECT courses.codigo, courses.nombre, courses.creditos, courses.profesor, courses.grupo FROM courses_users INNER JOIN courses ON courses.codigo = courses_users.fk_codigo INNER JOIN users ON users.email = courses_users.fk_email WHERE email='${datos_usuario[0]}'`;

  let query = con.query(sql, (err, result) => {

    if (err) {
      throw err;
    } else {
      res.send(result);
    }

  });

});

//codigo hhtps
https.createServer({
  cert: fs.readFileSync('./ssl/server.crt'),
  key: fs.readFileSync('./ssl/server.key')
}, app).listen(port, function () {
  console.log(`Node server running on https://localhost:${port}`);
});

module.exports = app;