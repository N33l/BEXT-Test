/**
 * Created by neel on 9/12/16.
 */

function getCurrentTabUrl(callback)
{
    const queryInfo={
        active : true,
        currentWindow : true
    };

    chrome.tabs.query(queryInfo,function(tabs){

        const tab=tabs[0];
        const tabUrl=tab.url;
        console.assert(typeof tabUrl == 'string', 'tab.url should be a string');
        callback(tabUrl);

    });


    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell: "goodbye"});
        });
}