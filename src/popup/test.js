import { getGEOID } from "../utils/api/getGEOID.js";
import CONFIG from "../config.js"
import { getDecennial } from "../utils/api/getDecennial.js";

// const res = await getGEOID("1559 W 6th St #2d, Brooklyn, NY 11204, USA");
// console.log(res);

const blockGroupGEOID = '360470432001'; // Example GEOID for a block GROUP!! Note this is GROUP level GEOID
const apiKey = CONFIG.CENSUS_KEY;

getDecennial(blockGroupGEOID, apiKey).then(data => console.log(ethnicityComposition(data)));

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