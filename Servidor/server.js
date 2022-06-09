const express = require("express");
const bodyParser = require("body-parser")
const expat = require("node-expat");
var mysql = require('mysql');
var datos_usuario = []

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

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

  let xmlSrc = req.body.data,
    parser = new expat.Parser();

  /*let xmlSrc = '<?xml version="1.0"?> <!DOCTYPE lolz [ <!ENTITY lol "lol"> <!ELEMENT lolz (#PCDATA)> <!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"> <!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;"> <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;"> <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;"> <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;"> <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;"> <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;"> <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;"> <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;"> ]> <lolz>&lol9;</lolz>',
    parser = new expat.Parser();*/

  parser.on('text', function (text) {
    //console.log(text)
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
      if(result.length){
        console.log('User exists');
      }else{
        console.log('User not exists');
        //res.send("Hello world!");
      }
    }

  });

});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
})