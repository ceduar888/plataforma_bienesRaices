import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'

const protegerRuta = async(req, res, next) => {

    // Verificar si hay token
    const { _token } = req.cookies

    if(!_token) {
        
        return res.redirect('/auth/login')
    }

    // Confirmar el token
    try {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)

        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        // Almacenar el usuario en Req
        if(usuario) {
            
            req.usuario = usuario
            
        } else {
            return res.redirect('/auth/login')
        }

        return next();
        
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protegerRuta