/**
 * Created by neel on 9/14/16.
 */


document.body.style.backgroundColor="red";
console.log("running  here");
$.get(chrome.extension.getURL('../../background.html'), function(data) {
    $($.parseHTML(data)).appendTo('body');
    // Or if you're using jQuery 1.8+:
    // $($.parseHTML(data)).appendTo('body');
});