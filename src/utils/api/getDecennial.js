async function getRacialCompositionDecennial(blockGEOID, apiKey) {
    const baseUrl = "https://api.census.gov/data/2020/dec/pl";
    const params = new URLSearchParams({
        get: "P1_001N,P1_003N,P1_004N,P1_005N,P1_006N,P1_007N,P1_008N",
        for: `block:${blockGEOID.slice(-4)}`,
        in: `state:${blockGEOID.slice(0, 2)} county:${blockGEOID.slice(2, 5)} tract:${blockGEOID.slice(5, 11)}`,
        key: apiKey
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the racial composition from Decennial Census:', error);
    }
}

// Example usage
const blockGEOID = '110010062021012'; // Example GEOID for a block
const apiKey = 'YOUR_API_KEY';

getRacialCompositionDecennial(blockGEOID, apiKey).then(data => console.log(data));
