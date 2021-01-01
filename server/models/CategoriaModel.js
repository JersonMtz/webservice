const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoriaShema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerido.']          
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: [true, 'La descripción es requerido.']          
    }
    
});

/* Se exporta el esquema con el nombre que tendra y el esquema que se creo  */
module.exports = mongoose.model('Categoria', CategoriaShema);