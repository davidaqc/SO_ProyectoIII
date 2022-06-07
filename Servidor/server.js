var express = require("express");
var cors = require('cors');
var corsMiddleware = require('./cors/cors');

//Variables requeridas para el HTTPS
const fs = require('fs')
const https = require('https')
const path = require('path')
const port = 3000

//Asignacion del express
var app = express();

//Definiciones para el CORS
app.use(express.json({ limit: "100mb" }));
app.options('*', corsMiddleware);
app.use(corsMiddleware);
app.use(cors());

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  console.log(req.body)
  res.send([{
codigo : "CE-1209",
nombre : "Algoritmos y estructuras de datos I",
creditos : "4",
profesor : "Isaac Ramirez Herrera",
grupo : "1"

},
{
codigo : "CE-5303",
nombre : "Desarrollo de emprendedores ",
creditos : "4",
profesor : "Rita Picado Arroyo",
grupo : "1"

}

])
})

//codigo hhtps
https.createServer({
    cert: fs.readFileSync('./ssl/server.crt'),
    key: fs.readFileSync('./ssl/server.key')
  }, app).listen(port, function () {
    console.log(`Node server running on https://localhost:${port}`);
});

module.exports = app;
