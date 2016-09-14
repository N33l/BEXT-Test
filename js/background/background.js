chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
});


chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
    if(message.text == "getStuff"){
        console.log(message.url);
        sendResponse({type:"test","value":"hmara response valid hai"});
    }

    chrome.storage.sync.set({'valueStored': message.url}, function() {
        // Notify that we saved.
        console.log('Settings saved',message.url);
    });


});