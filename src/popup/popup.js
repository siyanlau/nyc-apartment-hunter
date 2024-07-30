import { getSyncStorage, setSyncStorage, addressFormatter, parseAddress } from "../utils/utils.js"
import { nearbySubway } from "../utils/api/nearbySubway.js";

const addressForm = document.getElementById('addressForm')
const destinationForm = document.getElementById('destinationForm');
const destinationId = "ChIJ85aDTUpawokR95FkWT0xm9o"; // this is Tandon, or 6 MetroTech. Our default value.

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
    .then(response => {
      if (response) {
        document.getElementById('destinationInput').value = ''; // clear the input field
        loadDestination();
        loadAddresses();
      }
      else {
        console.log("destination adding was not successful");
      }
    })
    .catch(error => {
      console.log(error);
    })
})

loadDestination();
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
        li.classList.add('no-bullet'); // remove bullet points and indentation

        const addressDiv = document.createElement('div');
        addressDiv.classList.add('address');
        addressDiv.innerHTML = `<h3>Data for ${item.address}</h3>`;

        const commute = document.createElement('p');
        commute.textContent = `Commute time to destination is ${item.commuteDuration.text}`;
        addressDiv.appendChild(commute);

        const counts = item.complaints;
        const complaintItem = document.createElement('p');
        complaintItem.innerHTML = `Noise Complaints: ${counts.noiseCount} <br>
        Rodent Complaints: ${counts.rodentCount} <br>
        Water Complaints: ${counts.waterCount} <br>
        Hygiene Complaints: ${counts.hygieneCount} <br>
        Parking Complaints: ${counts.parkingCount} <br>
        Other Complaints: ${counts.othersCount}`; 
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

function loadDestination() {
  getSyncStorage({ destination: {destinationAddress: "6 MetroTech Center, Brooklyn, NY 11201, USA", destinationId: "ChIJ85aDTUpawokR95FkWT0xm9o"} }) // default value
  .then((data) => {
    const destinationAddress = data.destination.destinationAddress;
    console.log("10. destination stored in background: ", destinationAddress);
    
    // Select the element where the destination will be displayed
    const destinationDisplay = document.getElementById('destinationDisplay');
    
    // Clear any existing content
    destinationDisplay.innerHTML = '';

    // Create and append new content
    const destinationDiv = document.createElement('div');
    destinationDiv.innerHTML = `<h4>Your destination is set to: ${destinationAddress}</h4>`;
    destinationDisplay.appendChild(destinationDiv);
  })
  .catch(error => {
    console.error("Error loading destination:", error);
  });
}