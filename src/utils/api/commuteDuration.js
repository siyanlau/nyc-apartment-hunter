import CONFIG from "../../config.js"

const apiKey = CONFIG.API_KEY;

export const commuteDurantion = (start_id, dest_id, method) => {
    const departureTimestamp = getFutureTimestamp(10, 0);
    const url = `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_id}&origin=place_id:${start_id}&key=${apiKey}&mode=${method}&departure_time=${departureTimestamp}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status !== 'OK') {
                throw new Error(`Error fetching ${method} directions: ` + data.status);
            }
            console.log(data);
            const leg = data.routes[0].legs[0];
            return leg.duration;
        })
        .catch(error => {
            console.error(`Error fetching ${method} distance:`, error);
            throw error;
        });
}

function getFutureTimestamp(hour, minute) {
    // Get the current date and time
    const now = new Date();
  
    // Set the date to the next day at the specified hour and minute
    const futureTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute, 0);
  
    // Convert the date to a Unix timestamp (seconds since Jan 1, 1970)
    return Math.floor(futureTime.getTime() / 1000);
  }