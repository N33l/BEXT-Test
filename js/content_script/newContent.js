/**
 * Created by neel on 9/14/16.
 */


document.body.style.backgroundColor="red";

$.get(chrome.extension.getURL('../../background.html'), function(data) {
    $($.parseHTML(data)).appendTo('body');
    // Or if you're using jQuery 1.8+:
    // $($.parseHTML(data)).appendTo('body');
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            console.log('You are visiting from second content script');
        }
    }
);