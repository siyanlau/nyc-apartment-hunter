import fetchComplaintData from "../utils/api/fetchComplaintData.js"
import './contextMenu.js';
import { getSyncStorage, setSyncStorage, parseAddress } from "../utils/utils.js"
import { geocode } from "../utils/api/geocode.js";
import { getGEOID } from "../utils/api/getGEOID.js";
import { getDecennial } from "../utils/api/getDecennial.js";


// the message that's sent to the backend has already been geocoded (in good format)
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

  if (message.action == 'addDestination') {
    // console.log("about to add destination to chrome storage");
    handleAddDestination(message)
      .then(successBool => {
        sendResponse({ success: successBool });
        console.log("7. HandleAddress done. response sent from onMessage listener with success:", successBool);
      })
      .catch(error => {
        console.error("Error handling addAddress:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

const handleAddDestination = async (message) => {
  const newDestination = message.destination;
  console.log("new destination passed in: ", newDestination);
  const res = await geocode(newDestination);
  console.log(res);
  return true;
}

const handleAddAddress = async (message) => {
  const complaintsSuccess = await fetchAndSetComplaints(message);
  const demographicsSucess = await fetchAndSetDemographics(message);
  return complaintsSuccess && demographicsSucess;
}

const fetchAndSetComplaints = async (message) => {
  const newAddress = message.address;
  const zipcode = message.zipcode;
  const formattedAddress = message.formattedAddress;
  console.log("3. background received new address: ", newAddress);
  const complaints = await fetchComplaintData(newAddress, zipcode); // rodentCount, noiseCount, etc
  console.log("5. complaints: ", complaints);

  if (!complaints) return false;

  try {
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;
    const addressExists = addresses.some(item => item.address === newAddress);

    if (!addressExists) {
      addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
      await setSyncStorage({ addresses: addresses, complaints: complaints });
    }
    console.log("6", data.addresses);
    return true;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return false;
  }
}

const fetchAndSetDemographics = async (message) => {
  // message contains address data. first find the block group id. then feed the id into `getDecennial`
  const address = message.address;
  const formattedAddress = message.formattedAddress;
  const { blockGEOID, blockGroupGEOID } = await getGEOID(formattedAddress);
  // console.log("blockGEOID", blockGEOID);
  const ethnicityComp = await getDecennial(blockGroupGEOID);
  
  try {
    // Retrieve existing addresses from sync storage
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;

    // Check if the address already exists in the storage
    const addressIndex = addresses.findIndex(item => item.address === address);

    // fetchAndSetComplaints gets executed first, so the address should already exist. 
    if (addressIndex === -1) {
      // If the address does not exist, add it
      addresses.push({
        address: address,
        ethnicity: ethnicityComp
      });
    } else {
      // If the address exists, update its ethnicity composition data
      addresses[addressIndex].ethnicity = ethnicityComp;
    }

    // Save the updated addresses back to sync storage
    await setSyncStorage({ addresses: addresses });
    console.log("Updated addresses in storage:", addresses);

    return true;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return false;
  }
}