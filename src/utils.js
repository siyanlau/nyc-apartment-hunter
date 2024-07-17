// export function sendMessagePromise(message) { // this can be in the util folder if we create one
//     return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage(message, (response) => {
//             if (chrome.runtime.lastError) {
//                 console.log("about to reject promise");
//                 reject(chrome.runtime.lastError);
//             } else {
//                 console.log("about to resolve promise");
//                 resolve(response);
//             }
//         });
//     });
// }

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