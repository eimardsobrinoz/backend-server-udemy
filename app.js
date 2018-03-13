// Requires

var express= require('express');
var mongoose= require('mongoose');

// Inicialización de variables
var app=express();

// Conexión a la BBDD
mongoose.connection.openUri("mongodb://localhost:27017/hospitalDB",(err,resp)=>{   
    if(err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
})

// Rutas
app.get('/',(req, res, next)=>{

    res.status(200).json({
        ok:true,
        mensaje: 'Petición realizada correctamente'
    });

});

// Escuchar peticiones
app.listen(3000, ()=>{