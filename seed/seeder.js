import categorias from "./categoria.js";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import precios from "./precios.js";
import db from "../config/database.js";

const importarDatos = async () => {
    try {
        // Autenticarse
        await db.authenticate()

        // Generar las columnas
        await db.sync()

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos insertados')
        process.exit()
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}