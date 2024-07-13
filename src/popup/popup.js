document.getElementById('addressForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const address = document.getElementById('addressInput').value;
    chrome.storage.sync.get({addresses: []}, (data) => {
      let addresses = data.addresses;
      addresses.push(address);
      chrome.storage.sync.set({addresses: addresses}, () => {
        document.getElementById('addressInput').value = '';
        loadAddresses();
      });
    });
  });
  
  function loadAddresses() {
    chrome.storage.sync.get({addresses: []}, (data) => {
      const addressList = document.getElementById('addressList');
      addressList.innerHTML = '';
      data.addresses.forEach((address, index) => {
        const li = document.createElement('li');
        li.textContent = address;
        addressList.appendChild(li);
      });
    });
  }
  
  loadAddresses();
  