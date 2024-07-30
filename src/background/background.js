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
    
    // Clear all addresses data in sync storage
    await setSyncStorage({ addresses: [] });
    console.log("Cleared all addresses data");

    return true;
  } catch (error) {
    console.error("Error adding destination:", error);
    return false;
  }
}

const handleAddAddress = async (message) => {
  const newAddress = message.address;
  const [complaints, url] = await fetchComplaints(message);
  const ethnicity= await fetchDemographics(message);
  const commuteDuration = await fetchCommuteDuration(message);
  if (!complaints || !ethnicity || !commuteDuration) {
    console.log("either getting complaints, ethnicity, or commute duration failed. handleAddAddress about to return false.")
    console.log("all three fields: ", complaints, ethnicity, commuteDuration);
    return false;
  }

  try {
    const data = await getSyncStorage({ addresses: [] });
    let addresses = data.addresses;
    const addressIndex = addresses.findIndex(item => item.address === newAddress);
    console.log("address index?? ", addressIndex);

    if (addressIndex === -1) {
      addresses.push({ address: newAddress, complaints: complaints, ethnicity: ethnicity, commuteDuration: commuteDuration, url: url }); // Append the new address and its complaints to the existing list
    }
    else {
      // replace the old record with the new one
      addresses[addressIndex] = { address: newAddress, complaints: complaints, ethnicity: ethnicity, commuteDuration: commuteDuration, url: url };
    }
    await setSyncStorage({ addresses: addresses });

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
  const [complaints, url] = await fetchComplaintData(newAddress, zipcode); // rodentCount, noiseCount, etc
  console.log("5. complaints: ", complaints);
  return [complaints, url];
}

const fetchDemographics = async (message) => {
  // message contains address data. first find the block group id. then feed the id into `getDecennial`
  const formattedAddress = message.formattedAddress;
  const { blockGEOID, blockGroupGEOID } = await getGEOID(formattedAddress);
  const ethnicityComp = await getDecennial(blockGroupGEOID);
  return ethnicityComp;
}

const fetchCommuteDuration = async (message) => {
  const placeId = message.placeId;
  
  const commuteDuration = await getSyncStorage({ destination: {destinationAddress: "6 Metrotech Center", destinationId: "ChIJ85aDTUpawokR95FkWT0xm9o"} }) // default value
    .then((data) => {
      const destinationId = data.destination.destinationId;
      console.log("destination id set to: ", destinationId);
      return destinationId;
    })
    .then(destinationId => {
      const commuteDuration = getCommuteDuration(placeId, destinationId, "transit");
      return commuteDuration;
    })
    .catch(error => {
      console.log("fetching commute duration failed: ", error);
    })

  return commuteDuration;
}