


$(document).ready(function(){ 
   
   //add sidebar 
   invoke_sidebar(); //in sidebar.js
   
   //add data into sidebar
   // popuplate_tabs_data();
   
   //var notificationsTimeOut = setTimeout(showBrowserNotifications, WAIT_BEORE_BROWSER_NOTIFICATIONS_SHOW);
      
   //priyanka : show price realated browser notification (price comparision and similar product)   
   //var priceNotificationsTimeout = setTimeout(show_price_browser_notification,WAIT_BEORE_BROWSER_NOTIFICATIONS_SHOW);
   
   setTimeout(function() {
       
       show_applicable_browser_notifications();
       
   }, WAIT_BEORE_BROWSER_NOTIFICATIONS_SHOW);
   
   setTimeout(function() {       
       if(is_vendor_data_to_be_refreshed){
        //    chrome.runtime.sendMessage({
        //       "source" : "global",
        //       "purpose" : "refreshVendorsLocalData" 
        //    });
            refresh_vendor_deals_and_offers();
       }
   }, 20000);
   
//    setTimeout(function(){       
//        get_vendor_deals_and_offers();        
//    },20000);
});  