import bcrypt from 'bcrypt'

const usuario = [
    {
        nombre: 'Cesar Alas',
        email: 'cesar@cesar.com',
        password: bcrypt.hashSync('password', 10),
        confirmado: 1
    },
    {
        nombre: 'Juan Torres',
        email: 'juan@juan.com',
        password: bcrypt.hashSync('password', 10),
        confirmado: 1
    }
]

export default usuario