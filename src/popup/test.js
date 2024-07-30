import { getGEOID } from "../utils/api/getGEOID.js";
import CONFIG from "../config.js"
import { getDecennial } from "../utils/api/getDecennial.js";

// const res = await getGEOID("1559 W 6th St #2d, Brooklyn, NY 11204, USA");
// console.log(res);

const blockGroupGEOID = '360470432001'; // Example GEOID for a block GROUP!! Note this is GROUP level GEOID
const apiKey = CONFIG.CENSUS_KEY;

getDecennial(blockGroupGEOID, apiKey).then(data => console.log(data));