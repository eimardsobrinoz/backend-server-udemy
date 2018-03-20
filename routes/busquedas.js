var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

// Rutas
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda,
        regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
        .then((respuestas) => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});


// ===============================================
// Búsqueda por coleccion
// ===============================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda,
        tabla = req.params.tabla,
        regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarUsuarios(regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;

        case 'usuarios':
            promesa = buscarMedicos(regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Las posibles búsquedas son médicos, usuarios y hospitales',
                error: { message: 'Tipo de tabla no válida' }
            });
    }
    promesa.then(datos => {
        res.status(200).json({
            ok: true,
            [tabla]: datos
        });
    });
});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('No se encontraron hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('No se encontraron medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('No se encontraron usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;