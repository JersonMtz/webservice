require('./config/config');
require('colors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname,'../public/')));

/* Ruta RAIZ */
app.use(require('./routes/index'));


mongoose.connect(URL_DB,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                (err, resp) => {
    if(err) throw err;
    console.log('BD conectada...' .bgGreen.bold);
});

app.listen(PORT, () => {
    console.log('servidor ON en puerto 3000...' .bgCyan.bold);
})