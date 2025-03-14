import { Precio, Categoria, Propiedad } from "../models/index.js"
import { Sequelize } from "sequelize"
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'

const inicio = async (req, res) => {
    
    // Verificar si hay token
    const { _token } = req.cookies

    if(_token) {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)
        
        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        // Almacenar el usuario en Req
        if(usuario) {
            
            req.usuario = usuario

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
        
            return res.render('inicio', {
                page: 'Inicio',
                categorias,
                precios ,
                casas,
                departamentos,
                token: req.csrfToken(),
                usuario
            })
            
        } else {

            return res.redirect('/auth/login')
        }
    }

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

    // Verificar si hay token
    const { _token } = req.cookies

    if(_token) {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)
        
        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        // Almacenar el usuario en Req
        if(usuario) {
            
            req.usuario = usuario

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

            return res.render('categoria', {
                page: `${categoria.nombre}s en Venta`,
                propiedades,
                token: req.csrfToken(),
                usuario
            })
            
        } else {

            return res.redirect('/auth/login')
        }

    }

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

    // Verificar si hay token
    const { _token } = req.cookies

    if(_token) {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)
        
        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        // Almacenar el usuario en Req
        if(usuario) {
            
            req.usuario = usuario

            return res.render('404', {
                page: '404 Not Found',
                token: req.csrfToken(),
                usuario
            })
            
        } else {

            return res.redirect('/auth/login')
        }

    }

    res.render('404', {
        page: '404 Not Found',
        token: req.csrfToken()
    })
}

const buscador = async (req, res) => {

    // Verificar si hay token
    const { _token } = req.cookies

    if(_token) {

        const decode = jwt.verify(_token, process.env.JWT_SECRET)
        
        // Identificar al usuario autenticado
        const usuario = await User.scope('eliminarPassword').findByPk(decode.id)

        // Almacenar el usuario en Req
        if(usuario) {
            
            req.usuario = usuario

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

            return res.render('busqueda', {
                page: 'Resultados de la Búsqueda',
                propiedades,
                token: req.csrfToken(),
                usuario
            })
            
        } else {

            return res.redirect('/auth/login')
        }

    }

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