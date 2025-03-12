
(function() {

    const lat = 13.7012918;
    const lng = -89.2243792;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    // Filtrado de la pagina principal
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriaSelect = document.querySelector('#categorias')
    const precioSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Eventos para el filtrado de categorias y precios
    categoriaSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    precioSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })

    const obtenerPropiedades = async () => {
        try {

            const url = '/api/propiedades'

            const response = await fetch(url)
            propiedades = await response.json()

            mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        // Limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            // Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <h1 class="text-xl font-extrabold uppercase my-5">${propiedad?.titulo}</h1> 
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p> 
                <a href="propiedades/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white">Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })
    }
    
    const filtrarPropiedades = () => {

        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )

        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => {
        
        return filtros.categoria ? propiedad.id_categoria === filtros.categoria : propiedad
    }

    const filtrarPrecio = propiedad => {

        return filtros.precio ? propiedad.id_precio === filtros.precio : propiedad
    }

    obtenerPropiedades()

})()