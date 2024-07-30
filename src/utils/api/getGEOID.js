export const getGEOID = async (formattedAddress) => {
    const {street, city, state, zip} = addressComponentExtractor(formattedAddress);
    if (!street || !city || !state || !zip) {
        console.log("something went wrong with address component extraction");
        return null;
    }
    const baseUrl = "https://geocoding.geo.census.gov/geocoder/geographies/address";
    const params = new URLSearchParams({
        street: street,
        city: city,
        state: state,
        zip: zip,
        benchmark: "Public_AR_Current",
        vintage: "Current_Current",
        format: "json",
        layers: "10,12"
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("url:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result.addressMatches.length > 0) {
            const geographies = data.result.addressMatches[0].geographies;

            // Get GEOID for Census Block
            const blockGEOID = geographies['2020 Census Blocks'][0].GEOID;
            const blockGroupGEOID = geographies['Census Block Groups'][0].GEOID;

            // You can similarly retrieve the GEOID for Census Tract if it's available in the response
            // const tractGEOID = geographies['Census Tracts'] ? geographies['Census Tracts'][0].GEOID : 'N/A';
            return {blockGEOID: blockGEOID, blockGroupGEOID: blockGroupGEOID};
        }
    } catch (error) {
        console.error('Error fetching geocoder data:', error);
    }
}

const addressComponentExtractor = (formattedAddress) => {
    const parts = formattedAddress.split(',');

    if (parts.length < 3) {
        throw new Error("Invalid address format");
    }

    // Extract the street, city, and stateZip from the parts
    const street = parts[0].trim();
    const city = parts[1].trim();
    const stateZip = parts[2].trim();

    // Split the stateZip part to get the state and zip
    const stateZipParts = stateZip.split(' ');
    const zip = stateZipParts.pop();  // Get the last part which is the ZIP code
    const state = stateZipParts.join(' ');  // The remaining parts form the state

    return {
        street: street,
        city: city,
        state: state,
        zip: zip
    };
}