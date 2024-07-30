import { getSyncStorage, setSyncStorage, addressFormatter, parseAddress } from "../utils/utils.js"
import { nearbySubway } from "../utils/api/nearbySubway.js";

const addressForm = document.getElementById('addressForm')
const destinationForm = document.getElementById('destinationForm');
const destinationId = "ChIJ85aDTUpawokR95FkWT0xm9o"; // this is Tandon, or 6 MetroTech.

addressForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const addressInput = document.getElementById('addressInput').value;
  let address = null, placeId;

  parseAddress(addressInput)
    .then(([houseNum, street, place_id, zipcode, formattedAddress]) => {
      // Address formatting
      address = addressFormatter(houseNum, street);
      placeId = place_id;

      // Now that we have the address, we can start sending the message
      console.log("1. Starting to send message (new address)...");
      return chrome.runtime.sendMessage({ action: 'addAddress', address: address, zipcode: zipcode, formattedAddress: formattedAddress, placeId: placeId })
    })
    .then(response => {
      if (response) {
        document.getElementById('addressInput').value = ''; // clear the input field
        console.log("8. Message sent successfully and response received: ", response);
        console.log("9. Now starting to calculate commute distance...");
        loadAddresses();
      } else {
        console.log("No response received", response);
      }
    })
    .catch((error) => {
      console.error('Error processing address:', error);
    });
});

destinationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const destinationInput = document.getElementById('destinationInput').value;
  console.log("destination submit clicked")
  chrome.runtime.sendMessage({ action: 'addDestination', destination: destinationInput })
    .then()
})

loadAddresses();

function loadAddresses() {
  getSyncStorage({ addresses: [] })
    .then((data) => {
      console.log("10. addresses stored in background: ", data.addresses);
      const addresses = data.addresses;
      const addressList = document.getElementById('addressList');
      addressList.innerHTML = '';
      console.log("11 starting forEach loop ");
      
      addresses.forEach((item) => {
        const li = document.createElement('li');
        
        const addressDiv = document.createElement('div');
        addressDiv.classList.add('address');
        addressDiv.innerHTML = `<h3>Data for ${item.address}</h3>`;
        
        const counts = item.complaints;
        const complaintItem = document.createElement('p');
        complaintItem.textContent = `Noise Complaints: ${counts.noiseCount} 
        \nRodent Complaints: ${counts.rodentCount} \nWater Complaints: ${counts.waterCount}
        \nOther Complaints: ${counts.othersCount}`;
        addressDiv.appendChild(complaintItem);

        const ethnicity = document.createElement('p');
        ethnicity.innerHTML = `
        White: ${item.ethnicity.whitePercentage}<br>
        Black: ${item.ethnicity.blackPercentage}<br>
        Asian: ${item.ethnicity.asianPercentage}<br>
        Hispanic: ${item.ethnicity.hispanicPercentage}`;
        
        li.appendChild(addressDiv);
        li.appendChild(ethnicity);
        addressList.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error handling loadAddresses:", error);
    });
}