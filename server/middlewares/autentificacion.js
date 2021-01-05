const JWT = require('jsonwebtoken');

const accessLogin = (request, resp, next) => {
    let token = request.get('token');

    JWT.verify(token, JWT_TOKEN, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
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

const accessIMG = (request, resp, next) => {
    let { token } = request.query

    JWT.verify(token, JWT_TOKEN, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }

        request.usuario = decoded.data;
        next();
    });

}

module.exports = {
    accessLogin,
    verifyRole,
    accessIMG
};