import { body, validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from "../models/index.js"

const admin = (req, res) => {
    res.render('propiedades/admin', {
        page: 'Mis Propiedades',
        nav: true
    })
}

const crear = async (req, res) => {
    // Obtener los registros de Precios y Categorias y mostrarlos en la vista
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        page: 'Publicar Propiedad',
        nav: true,
        token: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    // Validacion
    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            page: 'Publicar Propiedad',
            nav: true,
            token: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            precios,
            datos: req.body
        })
    }

    const { titulo, descripcion, categoria: id_categoria, precio: id_precio, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body

    // Registrar la propiedad
    try {
        const propiedad = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            id_precio,
            id_categoria
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    admin,
    crear,
    guardar
}