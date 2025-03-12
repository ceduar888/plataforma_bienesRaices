import e from "express";
import { propiedades } from "../controllers/apiController.js";

const router = e.Router()

router.get('/propiedades', propiedades)

export default router