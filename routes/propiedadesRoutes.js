import e from "express";
import { body } from "express-validator";
import { admin, crear, guardar, agregarImg, almacenarImagen, editar, guardarCambios, eliminar,
         mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstado 
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRutas.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = e.Router();

router.get('/mis-propiedades', 
    protegerRuta, 
    admin
)

router.get('/crear', 
    protegerRuta, 
    crear
)

router.post('/crear',
    protegerRuta,
    body('titulo').notEmpty().withMessage('Digita el Titulo del anuncio'),
    body('descripcion')
        .notEmpty().withMessage('Digita la Descripcion del anuncio')
        .isLength({max: 100}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
)

router.get('/agregar-imagen/:id', 
    protegerRuta, 
    agregarImg
)

router.post('/agregar-imagen/:id', 
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/editar/:id', 
    protegerRuta,
    editar
)

router.post('/editar/:id',
    protegerRuta,
    body('titulo').notEmpty().withMessage('Digita el Titulo del anuncio'),
    body('descripcion')
        .notEmpty().withMessage('Digita la Descripcion del anuncio')
        .isLength({max: 100}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona el numero de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
)

router.post('/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id', 
    protegerRuta,
    cambiarEstado
)

// Leer mensajes recibidos
router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)

// Rutas publicas
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

// Mensajes al vendedor
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

export default router