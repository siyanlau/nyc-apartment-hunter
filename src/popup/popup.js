import { getSyncStorage, setSyncStorage, addressFormatter } from "../utils.js"
import { geocode } from "../api/geocode.js"

// ----------------------------------------------------------------------

const addressForm = document.getElementById('addressForm')
geocode("451 51st st");

const houseNum = '451';
const street = 'West 51st Street';
const district = 'Manhattan';

const [address, districtName] = addressFormatter(houseNum, street, district);
console.log(address);       // Outputs: "451 WEST 51 STREET"
console.log(districtName);  // Outputs: "Manhattan"

addressForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const addressInput = document.getElementById('addressInput').value;

  console.log("1. Starting to send message (new address)...");
  chrome.runtime.sendMessage({ action: 'addAddress', address: addressInput })
    .then(response => {
      if (response) {
        document.getElementById('addressInput').value = ''; // clear the input field
        console.log("8. Message sent successfully and response received: ", response);
        loadAddresses();
      } else {
        console.log("No response received", response);
      }
    })
    .catch(error => {
      console.error("Error sending message:", error);
    });
});


function loadAddresses() {
  getSyncStorage({ addresses: [] })
    .then((data) => {
      console.log("9. addresses stored in background: ", data.addresses);
      const addresses = data.addresses;
      const addressList = document.getElementById('addressList');
      addressList.innerHTML = '';
      console.log("10 starting forEach loop ");
      addresses.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.address;
        const complaintsDiv = document.createElement('div');
        complaintsDiv.classList.add('complaints');
        complaintsDiv.innerHTML = `<h3>Complaints for ${item.address}</h3>`;
        // item.complaints.forEach(complaint => {
        const counts = item.complaints;
        const complaintItem = document.createElement('p');
        complaintItem.textContent = `Noise Complaints: ${counts.noiseCount} 
        \nRodent Complaints: ${counts.rodentCount} \nWater Complaints: ${counts.waterCount}
        \nOther Complaints: ${counts.othersCount}`;
        complaintsDiv.appendChild(complaintItem);
        // });

        li.appendChild(complaintsDiv);
        addressList.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error handling addAddress:", error);
    });
}