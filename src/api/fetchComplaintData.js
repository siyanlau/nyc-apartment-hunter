const endpoint = 'https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=';

export default async function fetchComplaintData(address) {
    try {
        const response = await fetch(endpoint + encodeURIComponent(address));

        if (!response.ok) {
            console.log("NYC open data response was not ok");
            throw new Error('Network response was not ok');
        }

        console.log("NYC open data connection was ok, about to return json response");

        const data = await response.json();
        const simplifiedData = data.map(complaint => ({ descriptor: complaint.descriptor }));
        
        return simplifiedData;
    } catch (error) {
        console.error('There was a problem with fetching from NYC open data: ', error);
        return null; // or handle the error in a way appropriate for your application
    }
}
