document.getElementById('addressForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const address = document.getElementById('addressInput').value;

  chrome.runtime.sendMessage({ action: 'addAddress', address: address }, (response) => {
    if (response.success) {
      document.getElementById('addressInput').value = '';
      loadAddresses();
    }
  });
});


function loadAddresses() {
  chrome.runtime.sendMessage({ action: 'getAddresses' }, (addresses) => { // don't want to load addresses every time, needs refactor
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
  