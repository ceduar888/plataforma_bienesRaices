import e from "express";
import { login, registro, olvidePassword, registrarUsuario, 
    confirmarCorreo, resetPassword, comprobarToken, nuevoPassword,
    autenticarLogin, cerrarSesion } from '../controllers/userController.js'

const router = e.Router();

router.get('/login', login)
router.post('/login', autenticarLogin)

router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', registro)
router.post('/registro', registrarUsuario)

router.get('/olvide-password', olvidePassword)
router.post('/olvide-password', resetPassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

router.get('/confirmar/:token', confirmarCorreo)

export default router;