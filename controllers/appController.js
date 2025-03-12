import { Precio, Categoria, Propiedad } from "../models/index.js"

const inicio = async (req, res) => {

    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                id_categoria: 1
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                id_categoria: 2
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
        departamentos
    })
}

const categoria = async (req, res) => {

}

const noEncontrado = async (req, res) => {

}

const buscador = async (req, res) => {

}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}