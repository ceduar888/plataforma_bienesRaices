

const admin = (req, res) => {
    res.render('propiedades/admin', {
        page: 'Mis Propiedades',
        nav: true
    })
}

const crear = (req, res) => {
    res.render('propiedades/crear', {
        page: 'Publicar Propiedad',
        nav: true,
        token: req.csrfToken()
    })
}

export {
    admin,
    crear
}