import { validationResult } from "express-validator"
import { unlink } from 'node:fs/promises'
import { Precio, Categoria, Propiedad } from "../models/index.js"

const admin = async (req, res) => {

    // Id del usuario autenticado
    const { id } = req.usuario

    const propiedades = await Propiedad.findAll({
        where: {
            id_user: id
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    res.render('propiedades/admin', {
        page: 'Mis Propiedades',
        propiedades,
        token: req.csrfToken(),
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

const editar = async (req, res) => {

    // Obtener el id de la propiedad de la ruta
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {

        return res.redirect('/propiedades/mis-propiedades')
    }

    // Quien edite la propiedad sea el que la creo
    if(propiedad.id_user.toString() !== req.usuario.id.toString()){

        return res.redirect('/propiedades/mis-propiedades')
    }
    
    // Obtener los registros de Precios y Categorias y mostrarlos en la vista
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        page: `Editar Propiedad: ${propiedad.titulo}`,
        token: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })    
}

const guardarCambios = async (req, res) => {
    
    // Validaciones del formulario
    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            page: 'Editar Propiedad',
            token: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            precios,
            datos: req.body
        }) 
    }

    // Obtener el id de la propiedad de la ruta
    const { id } = req.params
    
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {

       return res.redirect('/propiedades/mis-propiedades')
    }

    // Quien edite la propiedad sea el que la creo
    if(propiedad.id_user.toString() !== req.usuario.id.toString()){

        return res.redirect('/propiedades/mis-propiedades')
    }

    // Actualizar el registro
    try {
        
        const { titulo, descripcion, categoria: id_categoria, precio: id_precio, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body

        propiedad.set({
            titulo, 
            descripcion, 
            id_categoria, 
            id_precio, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng
        })

        await propiedad.save()

        res.redirect('/propiedades/mis-propiedades')

    } catch (error) {
        console.log(error)
    }
}

const eliminar = async (req, res) => {
    
    // Obtener el id de la propiedad de la ruta
    const { id } = req.params
    
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {

       return res.redirect('/propiedades/mis-propiedades')
    }

    // Quien edite la propiedad sea el que la creo
    if(propiedad.id_user.toString() !== req.usuario.id.toString()){

        return res.redirect('/propiedades/mis-propiedades')
    }

    try {

        // Eliminar la imagen
        await unlink(`public/uploads/${propiedad.imagen}`)

        // Eliminar la propiedad
        await propiedad.destroy()

        res.redirect('/propiedades/mis-propiedades')
        
    } catch (error) {
        console.log(error)
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImg,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar
}