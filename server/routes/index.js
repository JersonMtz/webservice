const express = require('express');
const app = express();

app.use(require('./LoginRoute'));
app.use(require('./UsuarioRoute'));



module.exports = app;