// import { sendMessagePromise } from '../utils.js';

const addressForm = document.getElementById('addressForm')

addressForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const addressInput = document.getElementById('addressInput').value;

  try {
    console.log("Starting to send message (new address)...");
    const successBool = await chrome.runtime.sendMessage({ action: 'addAddress', address: addressInput });
    if (successBool) {
      document.getElementById('addressInput').value = ''; // clear the input field
      console.log("Message sent successfully and response received: ", successBool);
    } else {
      console.log("No response received");
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
});


function loadAddresses() {
  chrome.storage.sync.get({ addresses: [] }, (data) => {
    console.log("addresses stored in background: ", data.addresses);
  })
}


//   chrome.runtime.sendMessage({ action: 'getAddresses' }, (addresses) => { // don't want to load addresses every time, needs refactor
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//       alert('Failed to load addresses.');
//       return;
//     }

//     const addressList = document.getElementById('addressList');
//     addressList.innerHTML = '';
//     addresses.forEach((item) => {
//       const li = document.createElement('li');
//       li.textContent = item.address;
//       const complaintsDiv = document.createElement('div');
//       complaintsDiv.classList.add('complaints');
//       complaintsDiv.innerHTML = `<h3>Complaints for ${item.address}</h3>`;
//       item.complaints.forEach(complaint => {
//         const complaintItem = document.createElement('p');
//         complaintItem.textContent = complaint.descriptor;
//         complaintsDiv.appendChild(complaintItem);
//       });
//       li.appendChild(complaintsDiv);
//       addressList.appendChild(li);
//     });
//   });
// }

// loadAddresses();
