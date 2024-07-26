import CONFIG from "../config.js"

const apiKey = CONFIG.API_KEY;

export const geocode = (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                console.log(`Geocode successful, Latitude: ${location.lat}, Longitude: ${location.lng}`);
            } else {
                console.error('Geocoding error:', data.status);
            }
        })
        .catch(error => console.error('Error:', error));
}
