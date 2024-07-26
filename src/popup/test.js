import { walkingDurantion } from "../utils/api/commuteDuration.js";

const dest_id = "ChIJq7z38-FEwokReJgESNhW2T8", start_id = "EioxNTU5IFcgNnRoIFN0ICMyZCwgQnJvb2tseW4sIE5ZIDExMjA0LCBVU0EiHhocChYKFAoSCav7OK7jRMKJEeFpQNyCViQrEgIyZA";
const walk_to_subway_data = await walkingDurantion(start_id, dest_id);
console.log("walking duration to subway: ", walk_to_subway_data);