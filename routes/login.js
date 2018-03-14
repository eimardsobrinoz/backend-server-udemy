var express=require('express');
var bcrypt = require('bcryptjs');
var jwt= require('jsonwebtoken');

var SEED=require('../config/config').SEED;

var app= express();

var Usuario= require('../models/usuario'); 


app.post('/', (req,res)=>{
     var body=req.body;

     Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if ( err ){
            return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al buscar usuarios',
                    errors: err
            }); 
        }
        if(!usuarioDB){
            return res.status(400).json({
                    ok:false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
            });
        }
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                    ok:false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
            });
        }

        //Crear un token 
        // -- en el expireIn se pone el tiempo en el que expirará. En este ejemplo en 4 horas = 14400ms.
        var token=jwt.sign(
            {usuario:usuarioDB},
            SEED,
            {expiresIn:14400}
        );

        return res.status(200).json({
            ok:true,
            usuario:usuarioDB,
            token:token,
            id:usuarioDB._id
        });
     });

});



module.exports=app;