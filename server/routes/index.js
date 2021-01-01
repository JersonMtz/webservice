const express = require('express');
const app = express();

app.use(require('./LoginRoute'));
app.use(require('./UsuarioRoute'));
app.use(require('./CategoriaRoute'));
app.use(require('./ProductoRoute'));


module.exports = app;