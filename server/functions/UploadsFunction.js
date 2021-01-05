const Usuario = require('../models/UsuarioModel');
const Producto = require('../models/ProductoModel');
const fs = require('fs');
const path = require('path');


const validType = (array, fileName) => {
    let ext = fileName.split('.');
    return array.indexOf(ext[ext.length - 1].toLowerCase()) > -1 ? true : false;
}

const changeName = fileName => {
    let file = fileName.split('.');
    return `${file[0]}-${new Date().getMilliseconds()}.${file[file.length - 1]}`;
}

const deletePhoto = (img, dirPhoto) => {
    let urlPhoto = path.resolve(__dirname,`../../uploads/${ dirPhoto }/${ img }`);
    if (fs.existsSync(urlPhoto)) fs.unlinkSync(urlPhoto);
}

const userImgDb = (res, name, id) => {
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            deletePhoto(name, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuario) {
            deletePhoto(name, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        deletePhoto(usuario.img, 'usuarios');
        usuario.img = name;
        usuario.save((err, resbd) => {
            if (err) {
                deletePhoto(name, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!resbd) {
                deletePhoto(name, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Imágen no actualizada'
                    }
                })
            }

            res.json({
                ok: true,
                message: 'Imágen actualizada con éxito.',
                usuario: resbd
            })
        })
    });
}

const productImgDb = (res, name, id) => {
    Producto.findById(id, (err, producto) => {
        if (err) {
            deletePhoto(name, 'productos');
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!producto) {
            deletePhoto(name, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        deletePhoto(producto.img, 'productos');
        producto.img = name;

        producto.save((err, resbd) => {
            if (err) {
                deletePhoto(name, 'productos');
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!resbd) {
                deletePhoto(name, 'productos');
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Imágen NO actualizada'
                    }
                })
            }

            res.json({
                ok: true,
                message: 'Imágen actualizada con éxito.',
                producto: resbd
            })
        })
    });
}

module.exports = {
    validType,
    changeName,
    userImgDb,
    productImgDb
}