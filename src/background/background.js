import fetchComplaintData from "../api/fetchComplaintData.js"
import './contextMenu.js';
import {getSyncStorage, setSyncStorage} from "../utils.js"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addAddress') {
    console.log("2. start to handle address...");

    handleAddAddress(message)
      .then(successBool => {
        sendResponse({ success: successBool });
        console.log("7. HandleAddress done. response sent from onMessage listener with success:", successBool);
      })
      .catch(error => {
        console.error("Error handling addAddress:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicate you will send a response asynchronously
  }
});

const handleAddAddress = async (message) => {
  const newAddress = message.address;
  console.log("3. background received new address: ", newAddress);
  const complaints = await fetchComplaintData(newAddress); // rodentCount, noiseCount, etc
  console.log("5. complaints: ", complaints);

  if (!complaints) return false;

  try {
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;
    const addressExists = addresses.some(item => item.address === newAddress);

    if (!addressExists) {
      addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
      await setSyncStorage({ addresses: addresses, complaints: complaints});
    }
    console.log("6", data.addresses);
    return true;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return false;
  }
}
