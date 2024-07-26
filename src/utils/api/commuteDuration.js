import CONFIG from "../../config.js"

const apiKey = CONFIG.API_KEY;

export const walkingDurantion = (start_id, dest_id) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_id}&origin=place_id:${start_id}&key=${apiKey}&mode=walking`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status !== 'OK') {
                throw new Error('Error fetching walking directions: ' + data.status);
            }
            const leg = data.routes[0].legs[0];
            return leg.duration;
        })
        .catch(error => {
            console.error('Error fetching walking distance:', error);
            throw error;
        });
}

export const transitDuration = (start_id, dest_id) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json
      ?destination=place_id%${dest_id}
      &origin=place_id%${start_id}
      &key=${apiKey}
      &mode=transit`

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("transit duration response: ", response);
            return response.json();
        })
        .then(data => data.result)
        .catch(error => {
            console.error('Error fetching walking distance:', error);
            throw error;
        })
}