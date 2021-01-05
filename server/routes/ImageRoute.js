const express = require('express');
const fs = require('fs');
const path = require('path');
const { accessIMG } = require('../middlewares/autentificacion')

const app = express();

app.get('/image/:dir/:name', accessIMG, (req, res) => {
    let { dir, name } = req.params;
    let urlPhoto = path.resolve(__dirname,`../../uploads/${ dir }/${ name }`);
    if (fs.existsSync(urlPhoto)) {
        res.sendFile(path.resolve(__dirname, urlPhoto));
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/img.gif'));
    }
})

module.exports = app;