const express = require('express')
const { accessLogin, verifyRole } = require('../middlewares/autentificacion')
const Categoria = require('../models/CategoriaModel')

const app = express()

app.get('/categoria', [accessLogin], (req, res) => {
    Categoria.find({}, 'descripcion')
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categorias){
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            categorias
        })
    })
    
})

app.get('/categoria/:id', [accessLogin], (req, res) => {
    let { id } = req.params

    Categoria.find({ _id: id }, 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categoria) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            categoria
        })
    })
})

app.post('/categoria', [accessLogin], (req, res) => {
    let { body } = req
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }) 

    categoria.save((err, respBD) => {
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
            categoria: respBD
        })
    })
})

app.delete('/categoria/:id', [accessLogin, verifyRole], (req, res) => {
    let { id } = req.params

    Categoria.findByIdAndRemove(id, (err, respBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!respBD){
            return res.status(400).json({
                ok: false,
                message: 'Registro no existe'
            })
        }
        
        res.json({
            ok: true,
            message: 'Registro eliminado'
        })
    })
})

app.put('/categoria/:id', [accessLogin], (req, res) => {
    let { id } = req.params
    let { descripcion } = req.body

    Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true, context:'query' }, (err, respBD) => {
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

module.exports = app