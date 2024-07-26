import CONFIG from "../config.js"

const apiKey = CONFIG.API_KEY;

export const geocode = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data.status === 'OK') {
            console.log(`Geocode successful`);
            return data;
        } else {
            console.error('Geocoding error:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
