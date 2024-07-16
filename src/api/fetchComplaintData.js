const endpoint = 'https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=';

export default function fetchComplaintData(address) {
    return fetch(endpoint + encodeURIComponent(address))
        .then(response => {
            if (!response.ok) {
                console.log("NYC open data response was not ok");
            } else {
                console.log("NYC open data connection was ok");
            }
            return response.json();
        })
        .then(data => {
            const simplifiedData = data.map(complaint => ({ descriptor: complaint.descriptor }));
            return simplifiedData;
        })
        .catch(error => {
            console.error('There was a problem with fetching from NYC open data: ', error);
            return null;
        });
}