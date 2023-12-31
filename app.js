window.addEventListener('load', () => {
    let long;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat}, ${long}`;

            fetch (api)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log('Error fetching weather data:', error);
                });
            error => {
                console.log('Error retrieving geolocation:', error);
            }
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
});