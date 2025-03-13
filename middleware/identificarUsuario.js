import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const identificarUsuario = async (req, resizeBy, next) => {

    // Identificar si hay token
    const {_token} = req.cookies

    if(!_token) {
        req.usuario = null

        return next()
    }

    // Comprobar el token
    try {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)

        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        if(usuario) {
            req.usuario = usuario
        }

        return next();
        
    } catch (error) {
        console.log(error)
        return resizeBy.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario