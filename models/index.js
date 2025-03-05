import User from './User.js'
import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'

Propiedad.belongsTo(Precio, {foreignKey: 'id_precio'})
Propiedad.belongsTo(Categoria, {foreignKey: 'id_categoria'})
Propiedad.belongsTo(User, {foreignKey: 'id_user'})

export {
    Propiedad,
    Precio,
    Categoria,
    User
}