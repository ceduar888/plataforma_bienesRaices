import bcrypt from 'bcrypt'

const usuario = [
    {
        nombre: 'Cesar Alas',
        email: 'cesar@cesar.com',
        password: bcrypt.hashSync('pelamela', 10),
        confirmado: 1
    }
]

export default usuario