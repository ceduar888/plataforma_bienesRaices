import { Precio, Categoria, Propiedad } from "../models/index.js"
import { Sequelize } from "sequelize"

const inicio = async (req, res) => {

    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                id_categoria: 1,
                publicado: true
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                id_categoria: 2,
                publicado: true
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [['createdAt', 'DESC']]
        })
    ])

    res.render('inicio', {
        page: 'Inicio',
        categorias,
        precios ,
        casas,
        departamentos,
        token: req.csrfToken()
    })
}

const categoria = async (req, res) => {
    const { id } = req.params

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)

    if(!categoria) {
        res.redirect('/404')
    }

    // Obtener las propiedades de esa categoria
    const propiedades = await Propiedad.findAll({
        where: {
            id_categoria: id,
            publicado: true
        },
        include: [
            {model: Precio, as: 'precio'},
        ]
    })

    res.render('categoria', {
        page: `${categoria.nombre}s en Venta`,
        propiedades,
        token: req.csrfToken()
    })

}

const noEncontrado = async (req, res) => {
    res.render('404', {
        page: '404 Not Found',
        token: req.csrfToken()
    })
}

const buscador = async (req, res) => {

    const { termino } = req.body

    // Validar que no este vacio
    if(!termino.trim()) {
        return res.redirect('back')
    }

    // Consultar la DB
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            },
            publicado: true
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        page: 'Resultados de la Búsqueda',
        propiedades,
        token: req.csrfToken()
    })
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}