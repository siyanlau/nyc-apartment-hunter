// Note this function get *block group* level racial data. Needs modification if intended for block level data

export async function getDecennial(blockGroupGEOID, apiKey) {
    const baseUrl = "https://api.census.gov/data/2020/dec/pl";

    // Extract state, county, and tract from the blockGroupGEOID
    const stateCode = blockGroupGEOID.slice(0, 2);
    const countyCode = blockGroupGEOID.slice(2, 5);
    const tractCode = blockGroupGEOID.slice(5, 11);
    const blockGroupCode = blockGroupGEOID.slice(11);

    // 001 total, 003 white, 004 black, 006 asian, 002 hispanic
    const params = new URLSearchParams({
        get: "P1_001N,P1_003N,P1_004N,P1_006N,P2_002N",
        for: `block group:${blockGroupCode}`,
        in: `state:${stateCode} county:${countyCode} tract:${tractCode}`,
        key: apiKey
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log('Constructed URL:', url);

    try {
        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Read the response body as text and log it for debugging
        const responseBody = await response.text();
        console.log('Response Body:', responseBody);

        // Parse the JSON
        const data = JSON.parse(responseBody);
        const ethnicityComp = ethnicityComposition(data);
        return ethnicityComp;
    } catch (error) {
        console.error('Error fetching the racial composition from Decennial Census:', error);
        throw error;
    }
}

const ethnicityComposition = (data) => {
    const total = parseInt(data[1][0]);

    // Convert each count to a percentage and format it
    const whitePercentage = ((parseInt(data[1][1]) / total) * 100).toFixed(1);
    const blackPercentage = ((parseInt(data[1][2]) / total) * 100).toFixed(1);
    const asianPercentage = ((parseInt(data[1][3]) / total) * 100).toFixed(1);
    const hispanicPercentage = ((parseInt(data[1][4]) / total) * 100).toFixed(1);

    return {
        whitePercentage: `${whitePercentage}%`, 
        blackPercentage: `${blackPercentage}%`, 
        asianPercentage: `${asianPercentage}%`, 
        hispanicPercentage: `${hispanicPercentage}%`
    };
}