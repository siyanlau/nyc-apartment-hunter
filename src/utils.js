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

export const addressFormatter = (houseNum, street, district) => {
  const streetName = street.replace(/(\d+)(st|nd|rd|th)\b/i, '$1').trim().toUpperCase();
  const addressPart = `${houseNum} ${streetName}`.trim();
  const districtPart = district.toUpperCase();
  return [addressPart, districtPart];
}