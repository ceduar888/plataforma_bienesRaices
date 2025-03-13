const esVendedor = (id_usuario, propiedadIdUsuario) => {
    return id_usuario === propiedadIdUsuario
}

const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
}

export {
    esVendedor,
    formatearFecha
}