

document.getElementById('addressForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const addressInput = document.getElementById('addressInput').value;
  // chrome.runtime.sendMessage({ action: 'addAddress', address: addressInput }, (response) => {
  //   if (response.success) {
  //     document.getElementById('addressInput').value = ''; // clear the input field
  //     loadAddresses();
  //   }
  //   else {
  //     console.log("sent address input to background but did not receive response??");
  //   }
  // });
  console.log("front end received address ", addressInput);
  chrome.runtime.sendMessage({ action: 'addAddress', address: addressInput });
});


function loadAddresses() {
  chrome.runtime.sendMessage({ action: 'getAddresses' }, (addresses) => { // don't want to load addresses every time, needs refactor
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      alert('Failed to load addresses.');
      return;
    }

    const addressList = document.getElementById('addressList');
    addressList.innerHTML = '';
    addresses.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.address;
      const complaintsDiv = document.createElement('div');
      complaintsDiv.classList.add('complaints');
      complaintsDiv.innerHTML = `<h3>Complaints for ${item.address}</h3>`;
      item.complaints.forEach(complaint => {
        const complaintItem = document.createElement('p');
        complaintItem.textContent = complaint.descriptor;
        complaintsDiv.appendChild(complaintItem);
      });
      li.appendChild(complaintsDiv);
      addressList.appendChild(li);
    });
  });
}

loadAddresses();
  