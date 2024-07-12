chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addAddress",
      title: "Add Address",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addAddress") {
      chrome.storage.sync.get({addresses: []}, (data) => {
        let addresses = data.addresses;
        addresses.push(info.selectionText);
        chrome.storage.sync.set({addresses: addresses});
      });
    }
  });