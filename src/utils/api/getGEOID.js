export const getGEOID = (formattedAddress) => {

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