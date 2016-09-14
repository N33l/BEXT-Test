/**
 * Created by neel on 9/12/16.
 */


// content.js
//alert("Hello from your Chrome extension!")


//const pathname = window.location.pathname; // Returns path only
const url      = window.location.href;
console.log(url);
//
//
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            console.log('You are visiting',url);
        }
    }
);

chrome.extension.sendMessage({text:"getStuff",url:url},function(reponse){
    //This is where the stuff you want from the background page will be
    if(reponse.type == "test")
        console.log("Test received",reponse.value);
});

chrome.storage.sync.get(['valueStored'], function(items) {
    console.log('Settings retrieved', items);
});