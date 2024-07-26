import CONFIG from "../../config.js"

const apiKey = CONFIG.API_KEY;

export const nearbySubway = (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&rankby=distance&type=subway_station`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the data received from the API
            console.log(data.results);
            return data.results; 
        })
        .catch(error => {
            console.error('Error fetching nearby subway stations:', error);
            throw error; // Rethrow the error to handle it upstream if necessary
        });
};

