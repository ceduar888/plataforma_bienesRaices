import User from './User.js'
import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Mensaje from './Mensaje.js'

Propiedad.belongsTo(Precio, {foreignKey: 'id_precio', as: 'precio'})
Propiedad.belongsTo(Categoria, {foreignKey: 'id_categoria', as: 'categoria'})
Propiedad.belongsTo(User, {foreignKey: 'id_user', as: 'usuario'})
Propiedad.hasMany(Mensaje, {foreignKey: 'id_propiedad', as: 'mensaje'})

Mensaje.belongsTo(User, {foreignKey: 'id_user', as: 'usuario'})
Mensaje.belongsTo(Propiedad, {foreignKey: 'id_propiedad', as: 'propiedad'})


export {
    Propiedad,
    Precio,
    Categoria,
    User,
    Mensaje
}