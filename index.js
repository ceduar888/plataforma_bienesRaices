import e from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import propiedadRoutes from './routes/propiedadesRoutes.js'
import db from "./config/database.js";

const app = e()

// Habilitar lectura de datos de formulario
app.use( e.urlencoded({extended: true}) )

// Habilitar cookie parser
app.use( cookieParser() )

// Habilitar CSRF
app.use( csurf({ cookie: true }) )

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Routing
app.use('/auth', userRoutes)
app.use('/propiedades', propiedadRoutes)

// Public
app.use( e.static('public') )

// Conexion a la DB
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la base de datos')
} catch (error) {
    console.error(error)
}

// Servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})