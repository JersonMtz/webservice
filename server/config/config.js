/* PUERTO GLOBAL */
PORT = process.env.PORT || 3000;
/* PUERTO GLOBAL */


/* Producción || Desarrollo */
ENV = process.env.NODE_ENV || 'DEV';
/* Producción || Desarrollo */


/* URL Base Datos */
if(ENV === 'DEV'){
    URL_DB = 'mongodb://localhost:27017/cafe'
} else {
    URL_DB = process.env.MONGO_DB;
}
/* URL Base Datos */


/* TOKEN & Expiración */
JWT_TOKEN = process.env.JWT_TOKEN || 'abcd1234';
EXPIRE = 60 * 60 * 24 * 30;
/* TOKEN & Expiración */


/* Cliente Google */
CLIENT = process.env.CLIENT_ID_GOOGLE || '524543287867-4kln6cqps2aqof5pc198mnmj7d6vc9sn.apps.googleusercontent.com';
/* Cliente Google */
