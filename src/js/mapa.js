(function() {
    const lat = document.querySelector('#lat').value || 13.7012918;
    const lng = document.querySelector('#lng').value || -89.2243792;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;

    // Provider y GeoCoder para obtener info de las calles
    const geocodeService = L.esri.Geocoding.geocodeService()


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Pin del mapa
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Leer latitud y longitud del pin
    marker.on('moveend', function(event) {
        marker = event.target
        const posicion = marker.getLatLng()
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        // Obtener la info de las calles al soltar el ping
        geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado) {
            
            marker.bindPopup(resultado.address.LongLabel)

            // Llenar los campos ocultos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })

})()