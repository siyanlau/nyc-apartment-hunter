import { getGEOID } from "../utils/api/getGEOID.js";

const res = await getGEOID("1559 W 6th St #2d, Brooklyn, NY 11204, USA");
console.log(res);
