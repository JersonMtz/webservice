const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* EMUN DE ROLES VALIDOS */
let roleValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol de usuario permitido.'
}

let Schema = mongoose.Schema;

let UsuarioShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido.']          
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido.']          
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.']          
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidator
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* Se agrega la validación de email unico y mensaje personalizado */
UsuarioShema.plugin(uniqueValidator, { message: '{PATH} ya registrado, por favor use otro.'});


/* Eliminar campos de impresion en un JSON de respuesta 
se usa este metodo del modelo para modificar la respuesta */
UsuarioShema.methods.toJSON = function() {
    let obj = this;
    let UsuarioTemp = obj.toObject();

    delete UsuarioTemp.password;
    return UsuarioTemp;
}

/* Se exporta el esquema con el nombre que tendra y el esquema que se creo  */
module.exports = mongoose.model('Usuario', UsuarioShema);