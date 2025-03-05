import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt';
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailRecuperarPassword } from '../helpers/emails.js';
import User from "../models/User.js"

// METODOS DEL LOGIN
const login = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar Sesión',
        token: req.csrfToken()
    })
}

const autenticarLogin = async (req, res) => {
    // Validar datos
    await check('email').isEmail().withMessage('Digita tu email').run(req)
    await check('password').notEmpty().withMessage('Digita tu password').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        return res.render('auth/login', {
            page: 'Iniciar Sesion',
            errores: resultado.array(),
            token: req.csrfToken()
        })
    }

    // Comprobando si el usuario existe
    const {email, password} = req.body

    const usuario = await User.findOne({ where: {email} })

    if(!usuario){
        return res.render('auth/login', {
            page: 'Iniciar Sesion',
            errores: [{msg: 'El usuario ingresado no existe'}],
            token: req.csrfToken()
        })
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        return res.render('auth/login', {
            page: 'Iniciar Sesion',
            token: req.csrfToken(),
            errores: [{msg: 'No has confirmado tu cuenta. Revisa tu email'}]
        })
    }

    // Comprobar el password
    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            page: 'Iniciar Sesion',
            token: req.csrfToken(),
            errores: [{msg: 'Password incorrecto'}],
            usuario: {
                email: email
            }
        })
    }

    // Autenticar al usuario con JWT
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

    // Guardar el JWT en un Cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true
    }).redirect('/propiedades/mis-propiedades')
}

// METODOS DEL REGISTRO
const registro = (req, res) => {
    res.render('auth/registro', {
        page: 'Crear Cuenta',
        token: req.csrfToken()
    })
}

const registrarUsuario = async (req, res) => {
    //Extraer datos de la request
    const {nombre, email, password} = req.body

    // Validacion de datos
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El email debe llevar @ y es obligatorio').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('rep_password').equals(password).withMessage('Los password no son iguales').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            page: 'Crear Cuenta',
            errores: resultado.array(),
            token: req.csrfToken(),
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }

    const existeUsuario = await User.findOne({ where: {email : email}})

    if (existeUsuario) {
        return res.render('auth/registro', {
            page: 'Crear Cuenta',
            token: req.csrfToken(),
            errores: [{msg: 'Hay un usuario registrado con ese email'}],
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }

    //Almacenar el usuario
    const usuario = await User.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Enviar email de confirmacion 
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de exito y de confirmacion de la cuenta
    res.render('templates/mensaje', {
        page: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona para confirmar'
    })
}

const confirmarCorreo = async (req, res) => {

    const { token } = req.params;

    //Buscar el usuario con el mismo token recibido
    const usuario = await User.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            page: 'Error al confirmar tu cuenta',
            mensaje: 'Ocurrio un error al confirmar tu correo electronico, intenta nuevamente',
            error: true
        })
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        page: 'Cuenta confirmada',
        mensaje: 'Tu cuenta ha sido confirmada, ¡Bienvenido!'
    })
}

const olvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        page: 'Recuperar Password',
        token: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    
    const {email} = req.body

    // Validacion de datos
    await check('email').isEmail().withMessage('El email debe llevar @ y es obligatorio').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/olvide-password', {
            page: 'Recuperar Password',
            token: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Buscar al usuario
    const usuario = await User.findOne({where: {email}})

    if(!usuario) {
        return res.render('auth/olvide-password', {
            page: 'Recuperar Password',
            token: req.csrfToken(),
            errores: [{ msg: 'El email ingresado no pertenece a ningun usuario registrado' }]
        })
    }

    // Generar nuevo token temporal
    usuario.token = generarId();
    await usuario.save();

    // Enviar email al usuario con intrucciones
    emailRecuperarPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Mensaje de confirmacion
    res.render('templates/mensaje', {
        page: 'Restablecer Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {

    const {token} = req.params

    // Buscar el token
    const usuario = await User.findOne({ where: {token} })

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            page: 'Restablecer Password',
            mensaje: 'Ocurrio un error al restablecer tu password, intenta nuevamente',
            error: true
        })
    }

    // Si el usuario existe mostrar formulario
    res.render('auth/reset-password', {
        page: 'Restablecer Password',
        token: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {

    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/reset-password', {
            page: 'Restablecer Password',
            errores: resultado.array(),
            token: req.csrfToken()
        })
    }

    // Busca el usuario que restablece el password

    const {token} = req.params
    const {password} = req.body

    const usuario = await User.findOne({ where: {token} })

    // Hashear la nueva password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null

    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        page: 'Restablecer Password',
        mensaje: 'Tu nuevo password se guardo correctamente'
    })
}

export {
    login,
    registro,
    olvidePassword,
    registrarUsuario,
    confirmarCorreo,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticarLogin
}