// import { geocode} from "./geocode"
import CONFIG from "../config.js"

const apiKey = CONFIG.GOOGLE_KEY;

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
  const formattedAddress = data.results[0].formatted_address;
  const placeId = data.results[0].place_id;
  console.log("address vals: ", addressVals);
  console.log("formatted address: ", formattedAddress);
  let houseNum = null, street = null;

  // this parsing scheme could go wrong. but we have to do it this way because 'formatted address' uses short names
  if (addressVals.length <= 9) {
    houseNum = addressVals[0].long_name;
    street = addressVals[1].long_name;
  }
  else if (addressVals.length === 10) {
    houseNum = addressVals[1].long_name;
    street = addressVals[2].long_name;
  }
  else {
    console.log("address parsing went wrong");
  }

  const zipcode = extractZipCode(formattedAddress);
  console.log(zipcode);

  return [houseNum, street, placeId, zipcode, formattedAddress];
}

export const addressFormatter = (houseNum, street) => {
  const streetName = street.replace(/(\d+)(st|nd|rd|th)\b/i, '$1').trim().toUpperCase();
  const address = `${houseNum} ${streetName}`.trim();
  return address;
}

export const extractZipCode = (address) => {
  const parts = address.split(',');
  if (parts.length >= 3) {
      const zip = parts[2].trim().match(/\d{5}/);
      return zip ? zip[0] : null;
  } else {
      return null;
  }
}