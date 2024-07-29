import { commuteDurantion } from "../utils/api/commuteDuration.js";
import { geocode } from "../utils/api/geocode.js";

// const dest_id = "ChIJq7z38-FEwokReJgESNhW2T8", start_id = "EioxNTU5IFcgNnRoIFN0ICMyZCwgQnJvb2tseW4sIE5ZIDExMjA0LCBVU0EiHhocChYKFAoSCav7OK7jRMKJEeFpQNyCViQrEgIyZA";
// const walk_to_subway_data = await commuteDurantion(start_id, dest_id, "walking");
// console.log("walking duration to subway: ", walk_to_subway_data);

// const home_id = "ChIJj2jUHLRawokRP4W43n8R5JA";
// const transit_duration_data = await commuteDurantion(start_id, home_id, "transit");
// console.log("transit duration ", transit_duration_data);

function extractZipCode(address) {
    const parts = address.split(',');
    if (parts.length >= 3) {
        const zip = parts[2].trim().match(/\d{5}/);
        return zip ? zip[0] : null;
    } else {
        return null;
    }
}

const res = extractZipCode("1559 W 6th St #2d, Brooklyn, NY 11204, USA");
console.log(res);
