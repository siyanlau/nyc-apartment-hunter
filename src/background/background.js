import fetchComplaintData from "../api/fetchComplaintData.js"
import './contextMenu.js';
import {getSyncStorage, setSyncStorage} from "../utils.js"

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'addAddress') {
    try {
      const successBool = await handleAddAddress(message);
      sendResponse({ success: successBool });
      console.log("response sent from onMessage listener with success:", successBool);
    } catch (error) {
      console.error("Error handling addAddress:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Indicate you will send a response asynchronously
  }
  // Handle other actions as needed
});

const handleAddAddress = async (message) => {
  const newAddress = message.address;
  console.log("background received new address: ", newAddress);
  const complaints = await fetchComplaintData(newAddress);
  console.log("complaints: ", complaints);

  if (!complaints) return false;

  try {
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;
    const addressExists = addresses.some(item => item.address === newAddress);

    if (!addressExists) {
      addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
      await setSyncStorage({ addresses: addresses });
    }
    console.log(data.addresses);
    return true;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return false;
  }
}
