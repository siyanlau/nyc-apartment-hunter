// import { geocode} from "./geocode"
import CONFIG from "../config.js"

const apiKey = CONFIG.API_KEY;

export const getSyncStorage = (keys) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
};

export const setSyncStorage = (items) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(items, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

// `geocode` is defined in a separate file and copied here because of chrome cannot register background.js if I import it
const geocode = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.status === 'OK') {
          console.log(`Geocode successful`);
          return data;
      } else {
          console.error('Geocoding error:', data.status);
          return null;
      }
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}

export const parseAddress = async (inputAddress) => {
  const data = await geocode(inputAddress);
  console.log("printing returned data ", data)
  const addressVals = data.results[0].address_components;
  console.log("address vals: ", addressVals);
  let houseNum = null, street = null, district = null;
  if (addressVals.length <= 9) {
    houseNum = addressVals[0].long_name;
    street = addressVals[1].long_name;
    district = addressVals[3].long_name;
  }
  else if (addressVals.length === 10) {
    houseNum = addressVals[1].long_name;
    street = addressVals[2].long_name;
    district = addressVals[4].long_name;
  }
  else {
    console.log("address parsing went wrong");
  }
  const {lat, lng} = data.results[0].geometry.location;
  const placeId = data.results[0].place_id;
  console.log("latitude and longitude: ", lat, lng);
  return [houseNum, street, district, lat, lng, placeId];
}

export const addressFormatter = (houseNum, street, district) => {
  const streetName = street.replace(/(\d+)(st|nd|rd|th)\b/i, '$1').trim().toUpperCase();
  const addressPart = `${houseNum} ${streetName}`.trim();
  const districtPart = district.toUpperCase();
  return [addressPart, districtPart];
}