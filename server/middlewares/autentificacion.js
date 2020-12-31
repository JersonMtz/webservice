const JWT = require('jsonwebtoken');


const accessLogin = (request, resp, next) => {
    let token = request.get('token');

    JWT.verify(token, JWT_TOKEN, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                message: err
            });
        }

        request.usuario = decoded.data;
        next();
    });

}

const verifyRole = (request, resp, next) => {
    let usuario = request.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return resp.status(401).json({
            ok: false,
            message: 'Acción no permitida, no es un usuario administrador'
        });
    }

}

module.exports = {
    accessLogin,
    verifyRole
};