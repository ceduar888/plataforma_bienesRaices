import e from "express";
import { inicio, noEncontrado, categoria, buscador } from '../controllers/appController.js'

const router = e.Router()

// Pagina de inicio
router.get('/', inicio)

// Categorias
router.get('/categoria/:id', categoria)

// Pagina 404
router.get('/404', noEncontrado)

// Buscador
router.post('/buscador', buscador)

export default router