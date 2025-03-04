import e from "express";
import { admin, crear } from "../controllers/propiedadController.js";

const router = e.Router();

router.get('/mis-propiedades', admin)
router.get('/crear', crear)

export default router