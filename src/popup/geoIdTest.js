document.getElementById('fetchGeoID').addEventListener('click', async () => {
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;

    if (!street || !city || !state || !zip) {
        document.getElementById('result').textContent = 'Please fill in all fields.';
        return;
    }

    const baseUrl = "https://geocoding.geo.census.gov/geocoder/geographies/address";
    const params = new URLSearchParams({
        street: street,
        city: city,
        state: state,
        zip: zip,
        benchmark: "Public_AR_Current",
        vintage: "Current_Current",
        format: "json"
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result.addressMatches.length > 0) {
            const geographies = data.result.addressMatches[0].geographies;

            // Get GEOID for Census Block
            const blockGEOID = geographies['2020 Census Blocks'][0].GEOID;

            // You can similarly retrieve the GEOID for Census Tract if it's available in the response
            // const tractGEOID = geographies['Census Tracts'] ? geographies['Census Tracts'][0].GEOID : 'N/A';

            document.getElementById('result').textContent = `Block GEOID: ${blockGEOID}`;
            // Display tract GEOID if available
            // document.getElementById('result').textContent += `\nTract GEOID: ${tractGEOID}`;
        } else {
            document.getElementById('result').textContent = 'No matching address found.';
        }
    } catch (error) {
        console.error('Error fetching geocoder data:', error);
        document.getElementById('result').textContent = 'Error fetching geocoder data.';
    }
});