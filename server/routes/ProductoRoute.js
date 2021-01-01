const express = require('express')
const { accessLogin, verifyRole} = require('../middlewares/autentificacion')
const Producto = require('../models/ProductoModel')

const app = express()

app.get('/producto/buscar/:nombre', [accessLogin], (req, res) => {
    let { nombre } = req.params
    let regx = new RegExp(nombre, 'i')

    Producto.find({ nombre: regx }, 'nombre precio descripcion disponible categoria usuario')
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, producto) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(producto.length === 0){
            return res.status(400).json({
                ok: false,
                message: `No se encuentra productos con el nombre *${nombre}* `
            })
        }

        res.json({
            ok: true,
            producto
        })
    })
})

app.get('/producto', [accessLogin], (req, res) => {
    let inicio = Number(req.query.inicio) || 0;
    let final = Number(req.query.final) || 0;

    Producto.find({ disponible: true }, 'nombre precio descripcion disponible categoria usuario')
    .skip(inicio)
    .limit(final)
    .sort('nombre')
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productos) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(productos.length === 0){
            return res.status(400).json({
                ok: false,
                message: 'No hay más'
            })
        }

        res.json({
            ok: true,
            productos
        })
    })
})

app.get('/producto/:id', [accessLogin], (req, res) => {
    let { id } = req.params

    Producto.find({ _id: id }, 'nombre precio descripcion disponible categoria usuario')
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, producto) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(producto.length === 0){
            return res.status(400).json({
                ok: false,
                message: `No existe el producto con el ID ${id}`
            })
        }

        res.json({
            ok: true,
            producto
        })
    })
})

app.post('/producto', [accessLogin], (req, res) => {
    let { body } = req
    let producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    }) 

    producto.save((err, respBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: err
            })
        }

        if(!respBD){
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            producto: respBD
        })
    })
})

app.put('/producto/:id', [accessLogin], (req, res) => {
    let { id } = req.params
    let { nombre, precio, descripcion, disponible, categoria } = req.body

    Producto.findByIdAndUpdate(id, {  nombre, precio, descripcion, disponible, categoria }, { new: true, runValidators: true, context:'query' }, (err, respBD) => {
        if (err){
            return resp.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            result: respBD
        })
    })
}) 


app.delete('/producto/:id', [accessLogin, verifyRole], (req, res) => {
    Producto.findByIdAndUpdate(req.params.id, { disponible: false }, { new: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                message: 'Registro no existe'
            })
        }
        
        res.json({
            ok: true,
            message: 'Se elimino',
            producto
        })
    })
})

module.exports = app