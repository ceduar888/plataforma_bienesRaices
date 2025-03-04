import e from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRutas.js";

const router = e.Router();

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/crear', crear)
router.post('/crear',
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

export default router