// Requires

var express= require('express');
var mongoose= require('mongoose');
var bodyParser = require('body-parser');

// Inicialización de variables
var app=express();

// Body Parser: Tomará información del post y creará un obj de js sin tener que hacer nada más nosotros.
// --- parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// --- parse application/json
app.use(bodyParser.json())

// Importar Rutas
var appRoutes= require('./routes/app');
var loginRoutes= require('./routes/login');
var usuarioRoutes= require('./routes/usuario');

// Conexión a la BBDD
mongoose.connection.openUri("mongodb://localhost:27017/hospitalDB",(err,resp)=>{   
    if(err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
})


// Rutas
app.use('/',appRoutes);
app.use('/login',loginRoutes);
app.use('/usuario',usuarioRoutes);


// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Conectado al puerto 3000: \x1b[32m%s\x1b[0m','online');
});