import fetchComplaintData from "../utils/api/fetchComplaintData.js"
import './contextMenu.js';
import { getSyncStorage, setSyncStorage, parseAddress } from "../utils/utils.js"
import { geocode } from "../utils/api/geocode.js";
import { getGEOID } from "../utils/api/getGEOID.js";
import { getDecennial } from "../utils/api/getDecennial.js";
import { getCommuteDuration } from "../utils/api/getCommuteDuration.js";


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
      })
      .catch(error => {
        console.error("Error handling addDestination:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

const handleAddDestination = async (message) => {
  const newDestination = message.destination;
  console.log("new destination passed in: ", newDestination);

  try {
    const res = await geocode(newDestination);
    console.log(res);
    const formattedAddress = res.results[0].formatted_address;
    const destinationId = res.results[0].place_id;

    // Store the new destination in sync storage, overwriting the old one
    await setSyncStorage({ destination: { destinationAddress: formattedAddress, destinationId: destinationId } });

    console.log("Destination added successfully:", { destinationAddress: formattedAddress, destinationId: destinationId });

    return true;
  } catch (error) {
    console.error("Error adding destination:", error);
    return false;
  }
}

const handleAddAddress = async (message) => {
  const newAddress = message.address;
  const complaints = await fetchComplaints(message);
  const ethnicity= await fetchDemographics(message);
  const commuteDuration = await fetchCommuteDuration(message);
  if (!complaints || !ethnicity || !commuteDuration) return false;

  try {
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;
    const addressExists = addresses.some(item => item.address === newAddress);

    if (!addressExists) {
      addresses.push({ address: newAddress, complaints: complaints, ethnicity: ethnicity, commuteDuration: commuteDuration }); // Append the new address and its complaints to the existing list
      await setSyncStorage({ addresses: addresses });
    }
    console.log("6", data.addresses);
    return true;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return false;
  }
}

const fetchComplaints = async (message) => {
  const newAddress = message.address;
  const zipcode = message.zipcode;
  const formattedAddress = message.formattedAddress;
  console.log("3. background received new address: ", newAddress);
  const complaints = await fetchComplaintData(newAddress, zipcode); // rodentCount, noiseCount, etc
  console.log("5. complaints: ", complaints);
  return complaints;

  // if (!complaints) return false;

  // try {
  //   const data = await getSyncStorage({ addresses: [] });
  //   let addresses = data.addresses;
  //   const addressExists = addresses.some(item => item.address === newAddress);

  //   if (!addressExists) {
  //     addresses.push({ address: newAddress, complaints: complaints }); // Append the new address and its complaints to the existing list
  //     await setSyncStorage({ addresses: addresses, complaints: complaints });
  //   }
  //   console.log("6", data.addresses);
  //   return true;
  // } catch (error) {
  //   console.error("Error accessing storage:", error);
  //   return false;
  // }
}

const fetchDemographics = async (message) => {
  // message contains address data. first find the block group id. then feed the id into `getDecennial`
  const address = message.address;
  const formattedAddress = message.formattedAddress;
  const { blockGEOID, blockGroupGEOID } = await getGEOID(formattedAddress);
  // console.log("blockGEOID", blockGEOID);
  const ethnicityComp = await getDecennial(blockGroupGEOID);
  return ethnicityComp;

  // try {
  //   // Retrieve existing addresses from sync storage
  //   const data = await getSyncStorage({ addresses: [] });
  //   let addresses = data.addresses;

  //   // Check if the address already exists in the storage
  //   const addressIndex = addresses.findIndex(item => item.address === address);

  //   // fetchAndSetComplaints gets executed first, so the address should already exist. 
  //   if (addressIndex === -1) {
  //     // If the address does not exist, add it
  //     addresses.push({
  //       address: address,
  //       ethnicity: ethnicityComp
  //     });
  //   } else {
  //     // If the address exists, update its ethnicity composition data
  //     addresses[addressIndex].ethnicity = ethnicityComp;
  //   }

  //   // Save the updated addresses back to sync storage
  //   await setSyncStorage({ addresses: addresses });
  //   console.log("Updated addresses in storage:", addresses);

  //   return true;
  // } catch (error) {
  //   console.error("Error accessing storage:", error);
  //   return false;
  // }
}

const fetchCommuteDuration = async (message) => {
  const placeId = message.placeId;
  const destinationId = "ChIJ85aDTUpawokR95FkWT0xm9o"; // this is Tandon, or 6 MetroTech. Default value.
  const commuteDuration = await getCommuteDuration(placeId, destinationId, "transit");
  return commuteDuration;
}