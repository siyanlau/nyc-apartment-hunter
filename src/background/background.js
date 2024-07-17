import fetchComplaintData from "../api/fetchComplaintData.js"
import './contextMenu.js';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'addAddress') {
    const successBool = handleAddAddress(message);
    sendResponse({ success: successBool });
    return true; // Indicate you will send a response asynchronously
  }
  // else if (message.action === 'getAddresses') {
  //   chrome.storage.sync.get({ addresses: [] }, (data) => {
  //     console.log("addresses stored in background: ", data.addresses);
  //     sendResponse(data.addresses);
  //   });
  // };
});

const handleAddAddress = async (message) => {
  const newAddress = message.address;
  console.log("background received new address: ", newAddress);
  const complaints = await fetchComplaintData(newAddress);
  console.log("complaints: ", complaints);

  if (!complaints) return false;

  chrome.storage.sync.get({ addresses: [] }, (data) => {
    let addresses = data.addresses;
    const addressExists = addresses.some(item => item.address === newAddress);

    if (!addressExists) {
      addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
      chrome.storage.sync.set({ addresses: addresses });
    }
    console.log(data.addresses);
  });

  return true;
}
