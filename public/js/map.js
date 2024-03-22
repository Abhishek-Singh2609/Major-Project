    // console.log(mapToken);
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates , // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
    
    // console.log(typeof coordinatesArray[0]) ;
    // console.log(typeof coordinatesArray[1]);
    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h1>${listing.title}</h1><p>Exact location will be provided after booking</p>`))
        .addTo(map);
