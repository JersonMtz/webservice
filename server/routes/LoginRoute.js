const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT);

const Usuario = require('../models/UsuarioModel');
const app = express();

app.post('/login', (request, resp) => {
    
    let body = request.body;
    
    Usuario.findOne({ email: body.email, estado: true }, (err, usuarioBD) => {
        if (err){
            return resp.status(500).json({
                ok: false,
                message: err
            });
        }

        if (!usuarioBD){
            return resp.status(400).json({
                ok: false,
                message: '(Email) o contraseña incorrecta'
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            return resp.status(400).json({
                ok: false,
                message: 'Email o (contraseña) incorrecta'
            });
        }

        let token = jwt.sign({
            data: usuarioBD
        }, JWT_TOKEN, { expiresIn: EXPIRE });

        resp.json({
            ok: true,
            token,
            results: usuarioBD
        });
    });
});

/* Funcion Google */
const verify = async (value) => {
    const ticket = await client.verifyIdToken({
        idToken: value,
        audience: CLIENT,
    });
    let payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
/* Funcion Google */

app.post('/google', async (request, resp) => {
    let token = request.body.idToken;
    let gooleUser = await verify(token).catch(err => {
        return resp.status(403).json({ 
            ok: false, 
            err 
        });
    });

    Usuario.findOne({ email: gooleUser.email }, (err, usuarioBD)=>{
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            });
        }

        if (usuarioBD) {
            if (!usuarioBD.google) {
                return resp.status(400).json({
                    ok: false,
                    err: {
                        message: 'Email ya registrado, inicie sesión con usuario y contraseña.'
                    }
                });
            } else {
                let token = jwt.sign({
                    data: usuarioBD
                }, JWT_TOKEN, { expiresIn: EXPIRE });
        
                resp.json({
                    ok: true,
                    token,
                    results: usuarioBD
                }); 
            }
        } else {
            let usuario = new Usuario({
                nombre: gooleUser.nombre,
                email: gooleUser.email,
                password: 'G00GL3',
                img: gooleUser.img,
                google: true
            });

            usuario.save((err, respBD) =>{
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    data: respBD
                }, JWT_TOKEN, { expiresIn: EXPIRE });
        
                resp.json({
                    ok: true,
                    token,
                    results: respBD
                }); 
            });
        }
    })
});

module.exports = app;