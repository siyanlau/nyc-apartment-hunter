import { getSyncStorage, setSyncStorage, addressFormatter, parseAddress } from "../utils/utils.js"

const addressForm = document.getElementById('addressForm')

// const [houseNum, street, district] = await parseAddress("451 51st st brooklyn");

// const [address, districtName] = addressFormatter(houseNum, street, district);
// console.log(address);
// console.log(districtName);

addressForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const addressInput = document.getElementById('addressInput').value;
  let address = null, districtName = null;

  parseAddress(addressInput)
    .then(([houseNum, street, district]) => {
      // Address formatting
      [address, districtName] = addressFormatter(houseNum, street, district);

      // Logging results
      console.log(address);
      console.log(districtName);

      // Now that we have the address, we can start sending the message
      console.log("1. Starting to send message (new address)...");
      return chrome.runtime.sendMessage({ action: 'addAddress', address: address })
    })
    .then(response => {
      if (response) {
        document.getElementById('addressInput').value = ''; // clear the input field
        console.log("8. Message sent successfully and response received: ", response);
        loadAddresses();
      } else {
        console.log("No response received", response);
      }
    })
    .catch((error) => {
      console.error('Error processing address:', error);
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