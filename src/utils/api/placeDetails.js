// Function to get details of a specific place
import CONFIG from "../../config.js"

const apiKey = CONFIG.API_KEY;

const getPlaceDetails = (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${placeId}&fields=address_component,formatted_address,geometry,name,place_id`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.result)
        .catch(error => {
            console.error('Error fetching place details:', error);
            throw error;
        });
};