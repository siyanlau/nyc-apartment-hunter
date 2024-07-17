// Context menu related code
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addAddress",
      title: "Add Address",
      contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addAddress") {
    const address = info.selectionText;
    // need to do more address standardization here!
    const complaints = await fetchComplaintData(address);
    if (complaints != null) { // this is not the correct way to indicate 'data fetching failed'. needs modifying
      chrome.storage.sync.get({ addresses: [] }, (data) => {
        // add the highlighted address to address/complaints list
        let addresses = data.addresses;
        addresses.push({ address: address, complaints: complaints });
        chrome.storage.sync.set({ addresses: addresses });
      });
    }
    else {
      console.log("complaints are null");
    }
  }
});