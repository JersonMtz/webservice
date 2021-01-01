const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/UsuarioModel');
const {accessLogin, verifyRole } = require('../middlewares/autentificacion');
const app = express();

/* Agregar usuario */
app.post('/usuario', (request, resp) => {
    let usuario = new Usuario({
        nombre: request.body.nombre,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10),
        role: request.body.role
    });

    usuario.save((err, respBD) => {
        if(err){
            return resp.status(400).json({
                ok: false,
                message: err
            });
        }

        // respBD.password = NULL; Siempre aparecera en el JSON, hay que modificar el modelo.

        resp.json({
            ok: true,
            result: respBD
        })
    });
});

/* Actualizar usuario */
app.put('/usuario/:id', [accessLogin, verifyRole], (request, resp) => { 
    let id = request.params.id;
    let body = _.pick(request.body, ['nombre','email','img','role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context:'query' }, (err, respBD) => {
        if (err){
            return resp.status(400).json({
                ok: false,
                err
            });
        }

        resp.json({
            ok: true,
            result: respBD
        })
    });
});

/* Obtener usuarios */
app.get('/usuario', accessLogin, (request, resp) => {
    let inicio = Number(request.query.inicio) || 0;
    let final = Number(request.query.final) || 0;

    Usuario.find({ estado: true }, 'nombre email role img')
        .skip(inicio)
        .limit(final)
        .exec((err, usuarios) => {
            if (err){
                return resp.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Usuario.countDocuments({ estado:true },(err, cont) => {
                resp.json({
                    ok: true,
                    size: cont,
                    result: usuarios
                })
            });

            
        });
});

/* Obtener usuario _id */
app.get('/usuario/:id', verifyRole, (request, resp) => {

    let id = request.params.id;

    Usuario.find({_id: id, estado: true }, 'nombre email role estado')
    .exec((err, usuarioBD) => {
        
        if (err){
            return resp.status(400).json({
                ok: false,
                message: err
            });
        }

        if (usuarioBD.length == 0){
            return resp.status(400).json({
                ok: false,
                message: "No existe usuario"
            });
        }

        resp.json({
            ok: true,
            result: usuarioBD
        })
    });
});

/* Eliminar usuario de forma lógica */
app.delete('/usuario/:id', [accessLogin, verifyRole], (request, resp) => { 
    Usuario.findByIdAndUpdate(request.params.id, { estado: false }, { new: true }, (err, respBD) => {
        if (err){
            return resp.status(400).json({
                ok: false,
                message: err
            });
        }

        resp.json({
            ok: true,
            result: respBD
        })
    });
});


module.exports = app;