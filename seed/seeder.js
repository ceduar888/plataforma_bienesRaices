import categorias from "./categoria.js";
import precios from "./precios.js";
import usuario from "./usuarios.js";
import db from "../config/database.js";

import { Precio, Categoria, User } from '../models/index.js'

const importarDatos = async () => {
    try {
        // Autenticarse
        await db.authenticate()

        // Generar las columnas
        await db.sync()

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            User.bulkCreate(usuario)
        ])

        console.log('Datos insertados')
        process.exit()
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try {

        await db.sync({force: true})
    
        console.log('Datos eliminados')
        process.exit()
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}