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
            token: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            precios,
            datos: req.body
        })
    }

    const { titulo, descripcion, categoria: id_categoria, precio: id_precio, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body

    const { id: id_user } = req.usuario

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
            id_categoria,
            id_user,
            imagen: ''
        })

        const { id } = propiedad

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImg = async (req, res) => {

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        res.redirect('/propiedades/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        res.redirect('/propiedades/mis-propiedades')
    }

    // Validar que la propiedad pertenezca al usuario autenticado
    if (req.usuario.id.toString() !== propiedad.id_user.toString()) {
        res.redirect('/propiedades/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        page: `Agregar Imagen para: ${propiedad.titulo}`,
        token: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req, res, next) => {

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        res.redirect('/propiedades/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        res.redirect('/propiedades/mis-propiedades')
    }

    // Validar que la propiedad pertenezca al usuario autenticado
    if (req.usuario.id.toString() !== propiedad.id_user.toString()) {
        res.redirect('/propiedades/mis-propiedades')
    }

    try {
        
        // Almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next();

    } catch (error) {
        console.log(error)
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImg,
    almacenarImagen
}