const express = require('express');
const app = express();
const { validType, changeName, userImgDb, productImgDb } = require('../functions/UploadsFunction');
const { accessLogin } = require('../middlewares/autentificacion');

app.post('/upload/:tipo/:id', accessLogin, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ ok: false, error: { message: 'No se encontro archivo multimedia.' }});
    }

    let { tipo, id } = req.params;
    if (validType(['usuarios', 'productos'], tipo)) {
        let { photo } = req.files;
        if (validType(['png', 'jpg', 'jpeg'], photo.name)) {
            let namePhoto = changeName(photo.name);
            photo.mv(`uploads/${ tipo }/${ namePhoto }`, err => {
                if (err) return res.status(500).json({ ok: false, err })
                if (tipo === 'usuarios') userImgDb(res, namePhoto, id); else productImgDb(res, namePhoto, id);
            });
        } else {
            return res.status(400).json({ ok: false, error: { message: 'Formato de archivo multimedia no es valido. Extesiones válidas png, jpeg, jpg.' }});
        }
    } else {
        return res.status(400).json({
            ok: false,
            error: {
                message: `Path válidos usuarios/${ id } ó productos/${ id }.`
            }
        })
    }
});

module.exports = app;