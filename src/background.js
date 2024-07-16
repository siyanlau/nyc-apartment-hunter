chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addAddress",
    title: "Add Address",
    contexts: ["selection"]
  });
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addAddress") {
    const address = info.selectionText;
    // need to do more address standardization here!
    const complaints = await fetchComplaintData(address);
    if (complaints != null) { // this is not the correct way to indicate 'data fetching failed'. needs modifying
      chrome.storage.sync.get({ addresses: [] }, (data) => {
        // add the highlighted address to address/complaints list
        let addresses = data.addresses;
        addresses.push({ address: address, complaints: complaints });
        chrome.storage.sync.set({ addresses: addresses });
      });
    }
    else {
      console.log("complaints are null");
    }
  }
});


// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//   if (message.action === 'addAddress') {
//     const address = message.address;
//     const complaints = await fetchComplaintData(address);

//     chrome.storage.sync.get({addresses: []}, (data) => {
//       let addresses = data.addresses;
//       addresses.push({ address: address, complaints: complaints }); // append the new address to existing list
//       chrome.storage.sync.set({addresses: addresses}, () => {
//         sendResponse({ success: true });
//       });
//     });

//     return true; // Keeps the message channel open for sendResponse
//   } else if (message.action === 'getAddresses') {
//     chrome.storage.sync.get({addresses: []}, (data) => {
//       sendResponse(data.addresses);
//     });
//     return true; // Keeps the message channel open for sendResponse
//   }
// });

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'addAddress') {
    const newAddress = message.address;
    console.log("background received new address: ", newAddress);
    const complaints = await fetchComplaintData(newAddress);
    console.log("complaints: ", complaints);

    chrome.storage.sync.get({ addresses: [] }, (data) => {
      let addresses = data.addresses;
      const addressExists = addresses.some(item => item.address === newAddress);

      if (!addressExists) {
        addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
        chrome.storage.sync.set({ addresses: addresses }, () => {
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false, message: 'Address already exists' });
      }
      console.log(data.addresses);
    });
  }
})



async function fetchComplaintData(address) {
  try {
    const response = await fetch(`https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      console.log("NYC open data response was not ok");
    }
    else {
      console.log("NYC open data connection was ok");
    }
    const data = await response.json();
    const simplifiedData = data.map(complaint => ({ descriptor: complaint.descriptor }));
    return simplifiedData;
    // need to do more parsing / cleaning here
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
}