//@Ankit
//To show an html element by classname
function show_element(className){
    if($("."+className).hasClass("cd-ext-hide"))
       $("."+className).removeClass("cd-ext-hide");
    $("."+className).addClass("cd-ext-show");
    //$("."+className).css("display","block");     
}

//@Ankit
//To hide an html element by classname
function hide_element(className){
    if($("."+className).hasClass("cd-ext-show"))
       $("."+className).removeClass("cd-ext-show");
    $("."+className).addClass("cd-ext-hide");
    //$("."+className).css("display","none"); 
}

/* @author : Priyanka
 * This function updated the user's profile pic in the header
 *  pic_url = null : sets default icon
 *           = <url> : sets the url
 */
function update_profile_pic(pic_url){
    if(typeof pic_url == 'undefined'){
        get_cs_user_data()
        .then(function(user_data){
            if(user_data && user_data.image_url){
                update_profile_pic(user_data.image_url);
            }
        })
        .catch(log_error);
    }
    else{
        var image_icon = (pic_url ? pic_url : global.default_user_icon);
        $(".cd-ext-user-icon").attr("src",image_icon);
    }
}

//this function will update the user activita tab data (from local storage)
function show_user_activity(isLoggedIn){
    if(isLoggedIn){
        //show loader
        $("#user-activity-loader").show();

        if($("#cd-ext-user-notifications .cd-ext-product-notification").hasClass('cd-ext-hide'))
            $("#cd-ext-user-notifications .cd-ext-product-notification").removeClass('cd-ext-hide')
        $("#cd-ext-user-notifications .cd-ext-product-notification").addClass('cd-ext-show');
        
        if($(".cd-ext-cashback-notification").hasClass('cd-ext-hide'))
            $(".cd-ext-cashback-notification").removeClass('cd-ext-hide');  
        $(".cd-ext-cashback-notification").addClass('cd-ext-show');     
        
        if( $(".cd-ext-login-message").hasClass('cd-ext-show'))                              
            $(".cd-ext-login-message").removeClass('cd-ext-show');
        $(".cd-ext-login-message").addClass('cd-ext-hide'); 
          
        //display the red dot                  
        // if($(".cd-ext-ext-not").hasClass('cd-ext-hide'))
        //     $(".cd-ext-ext-not").removeClass('cd-ext-hide');
        // $(".cd-ext-ext-not").addClass('cd-ext-show');               
        
        //clear the user activity notification area
        // $('#cdext-product-notification-container').html("");
        reset_notification_count();
        get_user_specific_notifications();
        // get_price_alert_notifications();

        //set profile pic
        update_profile_pic();

        //show logged in header
        show_element("cd-ext-logged-in-header");
        hide_element("cd-ext-logged-out-header");

        
        show_element("cd-ext-btn-product-alert");
        hide_element("cd-ext-price-alert-login");
        hide_element("cd-ext-price-alert-signup");

    }else{
        //hide loader
        $("#user-activity-loader").hide();
    
        if($("#cd-ext-user-notifications .cd-ext-product-notification").hasClass('cd-ext-show'))
            $("#cd-ext-user-notifications .cd-ext-product-notification").removeClass('cd-ext-show')
        $("#cd-ext-user-notifications .cd-ext-product-notification").addClass('cd-ext-hide');
        
        if($(".cd-ext-cashback-notification").hasClass('cd-ext-show'))
            $(".cd-ext-cashback-notification").removeClass('cd-ext-show');  
        $(".cd-ext-cashback-notification").addClass('cd-ext-hide');     
        
        if( $(".cd-ext-login-message").hasClass('cd-ext-hide'))                              
            $(".cd-ext-login-message").removeClass('cd-ext-hide');
        $(".cd-ext-login-message").addClass('cd-ext-show'); 
         
         //hide the red dot                   
        // if($(".cd-ext-ext-not").hasClass('cd-ext-show'))
        //     $(".cd-ext-ext-not").removeClass('cd-ext-show');
        // $(".cd-ext-ext-not").addClass('cd-ext-hide');

        reset_notification_count(); 

        //show logged out header
        hide_element("cd-ext-logged-in-header");
        show_element("cd-ext-logged-out-header");
        
        hide_element("cd-ext-btn-product-alert");
        show_element("cd-ext-price-alert-login");
        show_element("cd-ext-price-alert-signup");              
    }
}

//@priyanka: its will enable/disable tooltip  
function refresh_settings_tooltip_behaviour(isLoggedIn){
    if(typeof isLoggedIn == 'undefined'){
        get_logged_in_status()
        .then(function(isLoggedIn){
            refresh_settings_tooltip_behaviour(isLoggedIn);
        });
    }else{
        if(isLoggedIn == true){
            //disable tooltip
            if($('.cd-ext-ext-settings').hasClass('cd-ext-btn-disabled')){
                $('.cd-ext-ext-settings').removeClass('cd-ext-btn-disabled');
                if(DEBUG) console.log("isLoggedIn "+ isLoggedIn);
            }            
            $('.cd-ext-tooltiptext').hide();
        }
        else if(isLoggedIn == false){
            //enable tooltip
            if(!$('.cd-ext-ext-settings').hasClass('cd-ext-btn-disabled')){
                $('.cd-ext-ext-settings').addClass('cd-ext-btn-disabled');
            }
            $('.cd-ext-tooltiptext').show();
        }
    }
    
}

//@priyanka : this function updates the user activity tab (from local storage).
function refresh_user_activity_tab(){

    get_logged_in_status().then(function(status){
        if(DEBUG) console.log(status);  
        show_user_activity(status);
    });
}

//@priyanka this checks all the stored preferences marked as true 
function activate_stored_pref(){
    get_user_preferences()
    .then(function(user_pref){
        for(var key in user_pref){
            if(key == 'all')
                continue;
            var elt = $("input[name = '"+key+"']");
            if(user_pref[key]){ //=true
                check_checkbox(elt);
            }
            else{ //= false  
                uncheck_checkbox(elt);
            } 
        };
    });
}

//@priyanka : function to check a settings menu item based on user preference
function check_checkbox(slide_element){
    $(slide_element).prop( "checked", true );
    $(slide_element).parent().css("background","#19e288");
}

//@priyanka : function to uncheck a settings menu item based on user preference
function uncheck_checkbox(slide_element){
    $(slide_element).prop( "checked", false );
    $(slide_element).parent().css("background","#949494");
}

//@priyanka : This function updates the state of the notification red dot based on the number of unread notifications
function update_notification_count_display(){
    if(global.unread_notification_count == 0){
        //hide dot if visible
        if($('#cdext-num-unread-notifs').hasClass('cd-ext-dot-class')){
            $('#cdext-num-unread-notifs').removeClass('cd-ext-dot-class');
            $('#cdext-num-unread-notifs').toggle();
        }
            
        // if($(".cd-ext-ext-not").hasClass('cd-ext-show'))
        //     $(".cd-ext-ext-not").removeClass('cd-ext-show');
        // $(".cd-ext-ext-not").addClass('cd-ext-hide');
    }
    else{
        //make dot visible if hidden and display count
        // if($(".cd-ext-ext-not").hasClass('cd-ext-hide'))
        //     $(".cd-ext-ext-not").removeClass('cd-ext-hide');
        // $(".cd-ext-ext-not").addClass('cd-ext-show'); 
        if(!($('#cdext-num-unread-notifs').hasClass('cd-ext-dot-class'))){
            $('#cdext-num-unread-notifs').addClass('cd-ext-dot-class');
            $('#cdext-num-unread-notifs').toggle();
        }
        
        //display the count
        $("#cdext-num-unread-notifs").text(global.unread_notification_count);
    }
}

//@priyanka : this function increments the unread_notification count by the given value and have that reflected in the sidebar
function inc_notification_count(value){
    //increment count
    if(typeof value != 'undefined'){
        global.unread_notification_count = global.unread_notification_count + value;
    }
    //display count in the red dot
    update_notification_count_display();
}

//@priyanka : This function resets the unread notification count to zero and have that reflected in the sidebar
function reset_notification_count(){
    //reset count
    global.unread_notification_count = 0;
    
    //display count in the red dot
    update_notification_count_display();

}
//@priyanka :  this function changes the display of all user notification to read after three sec
function set_notifications_display_read(){

    setTimeout(function(){
        $(".cd-ext-user-activity-tab-section .cd-ext-notification-unread").removeClass("cd-ext-notification-unread");
    }, 3000);
}

//@priyanka : this function handles tasks to do when user activity tab comes into focus whe a user is logged in
function user_activity_tab_opened(){

    get_logged_in_status()
    .then(function(isLoggedIn){
        if(isLoggedIn){
            
            //1. TODO: mark all user activity as seen/read (in the backend as well as in local storage)
            if(global.unread_notification_count > 0){
                if(DEBUG) console.log("Marking " + global.unread_notification_count+ " notifications as read");
                //1. mark notifications as read in backend
                mark_notification_read();

                //2. mark notifs as read in local storage
                mark_local_notification_read(global.unread_notification_count); //in cs util

                //3.reset unread notification counter
                reset_notification_count();

                //4. change display of all user notification as read/seen
                set_notifications_display_read();

                //5. inform this reset to bg which will announce to all CS
                inform_all_notif_seen_to_bg();
            }
            else{
                if(DEBUG) console.log("NO Unread Notifications");
            } 
        }
    });
}

/* @author : priyanka
 * This function adds bell notification logo to all the user activity notifications
 */
function add_bell_notification_logo(){
    $(".cd-ext-browser-extension-container .cd-ext-bell-container").css("background-image", "url('" + chrome.runtime.getURL("/resources/img/alert.png") + "')");
    // $(".cd-ext-browser-extension-container .cd-ext-bell-container").css("background-image","url('chrome-extension://fheikiegibdahiloljdbaapapageclga/resources/img/alert.png')");
}

//@khushbu and ankit
function show_desired_sub_tab(eventClass){    
        
    //pb :  adding active tab info to global
    global.tab_subtab_id = TAB_CLASS[eventClass];
    
    //priyanka : if subtab is user-activity :  reset notif count and mark all notifs seen
    if(eventClass == 'cd-ext-user-activity-tab'){
       user_activity_tab_opened();
    }
    if(eventClass == 'cd-ext-price-compare-tab'){
        show_price_notifications = false;
        get_logged_in_status().then(function(status){
           if(status){
                show_element("cd-ext-btn-product-alert");
                hide_element("cd-ext-price-alert-login");
                hide_element("cd-ext-price-alert-signup");
           } else{
                hide_element("cd-ext-btn-product-alert");
                show_element("cd-ext-price-alert-login");
                show_element("cd-ext-price-alert-signup");
           }
        });
    }
    //remove active tab
    $('.cd-ext-sub-tab.cd-ext-active').removeClass('cd-ext-active');

    //make current selected tab active
    $('.' + eventClass).addClass('cd-ext-active');

    //show selected tab's content
    $('.' + eventClass + '-section').removeClass('cd-ext-hide').addClass('cd-ext-show');

    //make sub tab's parent selected 
    $('.' + eventClass + '-section').parent().removeClass('cd-ext-hide').addClass('cd-ext-show');

    //hide all sibling sub tab content
    $($('.' + eventClass + '-section')).siblings('.cd-ext-show').removeClass('cd-ext-show').addClass('cd-ext-hide');
    //alert(eventClass);
    if(eventClass=="cd-ext-user-activity-tab"){
        get_logged_in_status().then(function(status){
             if(status){
                 if($("#cd-ext-user-notifications .cd-ext-product-notification").hasClass('cd-ext-hide'))                            
                    $("#cd-ext-user-notifications .cd-ext-product-notification").removeClass('cd-ext-hide').addClass('cd-ext-show');
                 if($(".cd-ext-cashback-notification").hasClass('cd-ext-hide'))
                    $(".cd-ext-cashback-notification").removeClass('cd-ext-hide').addClass('cd-ext-show');
                
            }
            else{
                if($(".cd-ext-login-message").hasClass('cd-ext-hide'))
                    $(".cd-ext-login-message").removeClass('cd-ext-hide').addClass('cd-ext-show');
            }       
        });    
    }    
}

//@khushbu
function show_desired_tab(eventClass){
    //pb :  adding active tab info to global
    global.tab_subtab_id = TAB_CLASS[eventClass];
    var active_content_tab = 0; //default

    //remove active tab
    $('.cd-ext-tab.cd-ext-active').removeClass('cd-ext-active');

    //make current selected tab active
    $('.' + eventClass).addClass('cd-ext-active');

    //hide all sub tabs section
    $($('.' + eventClass + '-section')).find('.cd-ext-show').removeClass('cd-ext-show').addClass('cd-ext-hide');

    //hide all other sibling sections
    $($('.' + eventClass + '-section')).siblings('.cd-ext-show').removeClass('cd-ext-show').addClass('cd-ext-hide');

    //Show selected tab section
    $('.' + eventClass + '-section').removeClass('cd-ext-hide').addClass('cd-ext-show');

    //removing existing active sub tabs
    $($($('.' + eventClass + '-section')).find('.cd-ext-sub-tab')).removeClass('cd-ext-active');

    // making 1st tab active
    $($($('.' + eventClass + '-section')).find('.cd-ext-sub-tab')[0]).addClass('cd-ext-active');

    if((global.is_restricted_vendor) && (eventClass == 'cd-ext-merchant-tab')){
        active_content_tab = 1;
        get_logged_in_status().then(function(status){
           if(status){
                show_element("cd-ext-btn-product-alert");
                hide_element("cd-ext-price-alert-login");
                hide_element("cd-ext-price-alert-signup");
           } else{
                hide_element("cd-ext-btn-product-alert");
                show_element("cd-ext-price-alert-login");
                show_element("cd-ext-price-alert-signup");
           }
        });
    }

    //showing 1st sub-tab content
    $($($('.' + eventClass + '-section')).find('.cd-ext-hide')[active_content_tab]).removeClass('cd-ext-hide').addClass('cd-ext-show');  
    
    //if(typeof cheapNotAvailable==='undefined') 
        //$("#cd-ext-pc").css("display","none");
        //hide_element('cd-ext-price-compare-tab'); 
    //else 
        //$("#cd-ext-pc").css("display","block");
        //show_element('cd-ext-price-compare-tab'); 
}

/* @author : priyanka 
 * This function attaches click handlers for special offers tab
 */
function click_handler_tab_special_offers(){
    //@priyanka : handle click on a offer listed in special offer tab
    $(".cd-ext-special-offer-card.cd-ext-offer-active").on('click', function(){
        //get target url and open it in a new tab
        var target_url = $(this).data('target-url');
        var tracking_required = $(this).data('tracking-required');
        var redirectIdentifier = $(this).data('seo-identifier');
        var offerId = $(this).data('offerid');
        
        chrome.runtime.sendMessage({
           "purpose" : "couponOrDealClicked",
           "source" : "sidebar",
           "data" : {
               "offerId" : offerId,
               "seo_identifier" : redirectIdentifier,
               "click_source" : "Special Offers in User Activity Tab",
               "source_page_url" : window.location.href,
               "timestamp" : new Date().getTime(),
				"offer_type" : "Special Offer"
           } 
        }); 
        
        
        if(tracking_required && redirectIdentifier){
            //send current url as a get param to redirect page
            
            // var landing_url = generate_get_url(REDIRECT_CONFIRM_URL, {
            //     "extension" : "chrome",
            //     "source_page_url" : target_url,
            //     "redirectData" : JSON.stringify({
            //         isStoreOutlink: true,
            //         redirectIdentifier: redirectIdentifier
            //     })
            // });
            var landing_url = generate_get_url(REDIRECT_CONFIRM_URL + redirectIdentifier, {
                'landing_url' : target_url
            });
            window.open(landing_url, '_blank');
        }
        else{
            window.open(target_url, '_blank');
        }
    });
}

/* @author : ankit
 * This function attaches click handlers for Buy Now Button
 * Buy Now button exists at 2 places
 * Similar Products, Compare Products
 */
function click_handler_buy_now_buttons(){
    
    $(".cd-ext-btn-buy").on('click',function(){
       
       var origin = $(this).data('origin');
       var index = $(this).data('i');
       var redirect_link;
       
       if(origin=="Compare-Products"){
           
           //redirect_link = slider_data.compareData[index].landingPage;
           
        //    redirect_link = generate_get_url(REDIRECT_CONFIRM_URL, {
        //     	"extension" : "chrome",
        //         "source_page_url" : slider_data.compareData[index].landingPage,
        //         "redirectData" : JSON.stringify({
        //             isStoreOutlink: true,
        //             redirectIdentifier: slider_data.compareData[index].seoIdentifier
        //         })
        //     });
            redirect_link = generate_get_url(REDIRECT_CONFIRM_URL + slider_data.compareData[index].seoIdentifier, {
                'landing_url' : slider_data.compareData[index].landingPage
            });
           
            chrome.runtime.sendMessage({
                "source" : "sidebar.js",
                "purpose" : "buyNowButtonClicked",
                "data" : {
                    "click_source" : origin,                    
                    "seo_identifier" : (vendorInformation ? vendorInformation.url_identifier : ""),
                    "source_page_url" : window.location.href,
                    "destination_page_url" : redirect_link, //canonical               
                    "original_product_url" : get_canonical_url(),                    
                    "destination_seo_identifier" : slider_data.compareData[index].vendorName,
                    "timestamp" : new Date().getTime()
                }
            }); 
                                    
       } else if(origin=="Similar-Products"){
           
           //redirect_link = slider_data.similarProducts[index].similarProductLandingPage;
        //    redirect_link = generate_get_url(REDIRECT_CONFIRM_URL, {
        //     	"extension" : "chrome",
        //         "source_page_url" : slider_data.similarProducts[index].landingPage,
        //         "redirectData" : JSON.stringify({
        //             isStoreOutlink: true,
        //             redirectIdentifier: slider_data.similarProducts[index].seoIdentifier
        //         })
        //     });
            
            redirect_link = generate_get_url(REDIRECT_CONFIRM_URL + slider_data.similarProducts[index].seoIdentifier, {
                'landing_url' : slider_data.similarProducts[index].landingPage
            });
           
            chrome.runtime.sendMessage({
                "source" : "sidebar.js",
                "purpose" : "buyNowButtonClicked",
                "data" : {
                    "click_source" : origin,                    
                    "seo_identifier" : vendorInformation.url_identifier,
                    "source_page_url" : window.location.href,
                    "destination_page_url" :redirect_link, //canonical               
                    "original_product_url" : get_canonical_url(),
                    "destination_seo_identifier" : slider_data.similarProducts[index].availableOn,
                    "timestamp" : new Date().getTime()
                }
            });                         
       }   
       
       window.open(redirect_link);                                
    });    
}

/*@author : ankit 
 * This function implements workflow when activate deal button is clicked in topDeals tab
 */

 function click_activate_deals_top_deals_handler(offer_data) {
     
     var success_url = offer_data.top_store_cd_url
                        +"?offerId="+offer_data.offerId
                        +"&login_required="+offer_data.login_required
                        +"&offer_type="+offer_data.offer_type
                        +"&extension=chrome&web_cashback="+offer_data.web_cashback;
                        
     var continue_without_signup_url = REDIRECT_CONFIRM_PAGE_OFFER + offer_data.offerId;
     
     chrome.runtime.sendMessage({
        "source" : source,
        "purpose" : "setRevealedTopOffers",
        "couponCode" : offer_data.offerId+"_"+offer_data.offerId
    });
             
    if(typeof offer_data.web_cashback!=='undefined'){
            //2 cases
            //logged_in and not logged_in
            get_logged_in_status()
            .then(function(logged_in){
                
                if(logged_in){
                    //Spec : In a new tab, immediately show a modal with cashback tips. At the bottom show a start shopping button
                    //Translates into : open the store page with "Start Shopping" modal opened 
                    //                  clicking on "Start Shopping" should take u to the landing page of the deal 
                                        
                    window.open(success_url,"_blank");
                    
                } else{                    
                    //make the user log in
                    //2 cases 
                    //user signs in/up successfully --> 
                        //same as if(logged_in)
                    
                    //user doesnt log in successfully -->
                        //follow behaviour of cashback not available
                        //so generate an outlink and pass it to login function for continue without signup url                     
                    sign_in_popup(LOGIN_CLICK_SOURCE.ACTIVATE_DEAL_TOP_DEALS,success_url,window.location.href,"login",continue_without_signup_url,"new");                                                            
                }
            });            
            
        } else{            
            window.open(continue_without_signup_url,"_blank");
        }
 }

/* @author : ankit -> priyanka 
 * This function attaches click handlers for topdeals tab
 */
function click_handler_tab_top_deals(topDeals){
    //Defining click action for each top deal in "Top Deals" tab based on if its a deal or a coupon
    for(var i=0;i<topDeals.length;i++){  
        
        //It might so happen that a top deal is also an offer listed in the store tab              
        $("#"+topDeals[i].offerId+"_"+topDeals[i].offerId).click(topDeals[i],function(event){
            
            var offerId = event.target.id.split("_")[0];                        
            
            chrome.runtime.sendMessage({
                "purpose" : "couponOrDealClicked",
                "source" : "sidebar",
                "data" : {
                    "offerId" : offerId,
                    "seo_identifier" : (vendorInformation!=null)? vendorInformation.url_identifier : domain,
                    "click_source" : "Activate Deal In Top Deals",
                    "source_page_url" : window.location.href,
                    "timestamp" : new Date().getTime(),
					"offer_type" : "Deal"
                } 
            }); 
            
            //alert($(event.target.id).text());
            if($("#"+event.target.id).text() == "ACTIVATE DEAL" || $("#"+event.target.id).text() == "DEAL ACTIVATED"){
                
                if(event.data.isCashback)
                    click_activate_deals_top_deals_handler({
                            "offer_type":event.data.couponType,
                            "login_required" : event.data.loginRequired,
                            "top_store_cd_url": event.data.store.cd_url ,
                            "web_cashback":JSON.stringify(event.data.cashback),
                            "offerId":offerId,
                            "seo_identifier":global.url_identifier,
                            click_source:"Activate Deal In Top Deals"
                        });
                else
                    click_activate_deals_top_deals_handler({
                        "offer_type":event.data.couponType,
                        "login_required" : event.data.loginRequired,
                        "top_store_cd_url": event.data.store.cd_url ,
                        "offerId":offerId,
                        "seo_identifier":global.url_identifier,
                        click_source:"Activate Deal In Top Deals"
                    });  
            }
            else{
                //need to store cd_url of this vendor offering best offer
                //append it with ?h=:offerid
                //then open it                
                //window.open(topDeals[offerId]+"?h="+offerId);
                top_deals_get_code_click_handler(event.data);
            }
        });         
    }
    
    var openTopOffersTab = setInterval(function(){
        if(global.hasVendorTabLoaded){
            if(withTopDealTabOpened && window.location.href.indexOf(CD_COOKIE_DOMAIN)<0){
                animate_sidebar(ANIMATE.SHOW);
                highlight_tab(TABS.TAB.TOP_OFFERS);        
                document.getElementById(last_top_deal_clicked).focus();
                $("#"+last_top_deal_clicked).removeClass('cd-ext-btn-deal').addClass('cd-ext-btn-code');        
                $("#"+last_top_deal_clicked).siblings(".cd-ext-top-span").removeClass("cd-ext-hide");    
                clearInterval(openTopOffersTab);                                  
            }
        }
    },100);        
}

/* @author : priyanka -> ankit
 * This function handles all html css and js manupulation of price comparision tab 
 */
function html_handler_price_comparision_data(tab_price_comparision_html){
    $("#cd-ext-pc").show();
    //add price comparision template
    $('#cdext-price-comparision-data-container').html(tab_price_comparision_html);
    
    get_an_alert_when_price_drops_handler_in_tab("cd-ext-btn-product-alert"); 
    
    get_logged_in_status().then(function(status){
       if(status){
           get_current_access_token()
           .then(function(access_token){
              api_get_price_alert_on_product(access_token)
                .then(function(alertData){
                    $(".cd-edit-price-alert-btn").removeClass("cd-ext-hide");
                    $(".cd-edit-price-alert-btn").on("click",function(){
                        window.open(CD_WEBSITE_URl + "/extension/pricealert?extension=chrome&editMode=true&subscriptionId="+alertData.userSubscriptions[0].subscriptionId); 
                    });
                    show_element("cd-ext-btn-product-alert");
                    $('.cd-ext-btn-product-alert').addClass('cd-ext-get-price-alert-updated');
                    $('.cd-ext-btn-product-alert').text("Price Alert set at Rs. "+alertData.userSubscriptions[0].alertPrice);                                
                }).catch(function(err){
                    show_element("cd-ext-btn-product-alert");
                    if(DEBUG)console.log(err);
                });    
           }).catch(function(err){
              if(DEBUG) console.log(err); 
           });                    
            
            show_element("cd-ext-btn-product-alert");
            hide_element("cd-ext-price-alert-login");
            hide_element("cd-ext-price-alert-signup");
       } else{
            show_element("cd-ext-price-alert-login");
            show_element("cd-ext-price-alert-signup");
            hide_element("cd-ext-btn-product-alert");
       }
    });
    
    //show price drop alert subscribe box if query param has 'show-cd-price-drop-box' as true
    //which will possibly be there when user logs in successfully from Price Comparison Tab
    if(getParameterByName('show-cd-price-drop-box')){
        //if($(".cd-ext-btn-product-alert").hasClass("cd-ext-get-price-alert-updated")) return false;

        show_price_notifications = false;
        show_price_alert_subscribe_notification();
    }            
    //else     
        //var priceSubscribeTimeout = setTimeout(show_price_alert_subscribe_notification,135000);


    //activate/deactivate tab
    if(typeof cheapNotAvailable==='undefined'){
        //$("#cd-ext-pc").css("display","none");
        //hide_element('cd-ext-price-compare-tab');
    }else{
        //show_element('cd-ext-price-compare-tab');
        if(cheapNotAvailable){
            //$("#cd-ext-pc").css("display","block"); 
            //show similar products notification
            if($('.cd-ext-product-comparison-sub-content').hasClass('cd-ext-not-valid-section'))
            {
                $('.cd-ext-product-comparison-sub-content').removeClass('cd-ext-not-valid-section');
            }
            $('.cd-ext-comparison-sub-content').addClass('cd-ext-not-valid-section');      
        }else{
            //$("#cd-ext-pc").css("display","block"); 
            //show price comparision notification
            if($('.cd-ext-comparison-sub-content').hasClass('cd-ext-not-valid-section'))
                {$('.cd-ext-comparison-sub-content').removeClass('cd-ext-not-valid-section');
            }
            $('.cd-ext-product-comparison-sub-content').addClass('cd-ext-not-valid-section');

            //Priyanka :  for restricted vendors make this tab visible
            if(global.is_restricted_vendor){
                //1. add merchant tab title
                $('#cd-ext-savings').show();
                if(!global.vendorNameTruncated){
                    $('#cd-ext-savings').text("Store Savings");
                }
                
                //2. bring top deals tab in focus
                if(!global.tab_id_to_open){
                    highlight_tab(TABS.SUB_TAB.PRICE_COMPARISION);
                }

                //3. show sticky
                global.show_sticky = true;
                get_user_preferences()
                .then(function(user_preferences){
                    if(user_preferences['show_cd_sticker']){
                        $(".cd-ext-btn-sticky").removeClass("cd-ext-hide");
                    }
                })
                .catch(log_error);
                
                //4. remove offers tab
                $(".cd-ext-merchant-offer-tab").remove();
            }
        }
    } 
    
    //attaching click handlers
    $(".cd-ext-price-alert-login, .cd-ext-price-alert-signup").on('click',function() {
        animate_sidebar(ANIMATE.HIDE);
        
        //set to_show_subscribe_div = true in background
        /*chrome.runtime.sendMessage({
        "source" : "product_notification_type1.html",
        "purpose" : "setToShowPriceDropSubscribe" 
        });*/                 
         
        //show signup/login popup        
        var success_url = window.location.href;
        if(success_url.indexOf('?')>-1){
            success_url = success_url + "&show-cd-price-drop-box=true"
        }else{
            success_url = success_url + "?show-cd-price-drop-box=true";
        }

        var active_tab = null;
        if($(this).hasClass("cd-ext-price-alert-login"))
            active_tab = 'login';
        else
            active_tab = 'signup';
        sign_in_popup(LOGIN_CLICK_SOURCE.ADD_PRICE_DROP_ALERT_NOTIFICATION,success_url,null,active_tab,null,"same");
        
    });
    
    click_handler_buy_now_buttons();
    
}

/* @author : priyanka -> ankit
 * html manupulations and click handlers for merchant offers tab
 */
function html_handler_tab_vendor_offers(tab_vendor_offers_html, slider_data){

    //1. add vendor tab html to the page
    $('#cdext-merchant_offer-data-container').html(tab_vendor_offers_html);

    //1.2 disable activate cashback section is not required
    if(!global.is_cashback){
        $("#cd-ext-vendor-info").removeClass("cd-ext-merchant-details");
        $("#cd-ext-vendor-logo").removeClass("cd-ext-merchant-logo");
        $("#cd-ext-vendor-logo").addClass("cd-ext-hide");
        $("#cd-ext-vendor-cashback").removeClass("cd-ext-merchant-info");
        $("#cd-ext-vendor-cashback").addClass("cd-ext-hide");    
        $(".cd-ext-merchant-offers").addClass("cd-ext-no-cashback");    
        $("#cdext-merchant_offer-data-container").addClass('cd-ext-no-cashback-resize'); 
    }

    //2. attach click handlers to all the buttons :  activate deals/ get code
    for(var i=0;i< slider_data.vendorOffersData.length;i++){
        //if(typeof slider_data.vendorOffersData[i].buttonClick !== 'undefined')
            slider_data.vendorOffersData[i].buttonClick();
    }  

    //3. enabling vendor tab, sticky,etc
    //add merchant tab title
    $('#cd-ext-savings').show();

    //bring top deals tab in focus
    if(!global.tab_id_to_open){
        highlight_tab(TABS.TAB.MERCHANT);
    }
        
    //show sticky
    global.show_sticky = true;
    get_user_preferences()
    .then(function(user_preferences){
        if(user_preferences['show_cd_sticker']){
            $(".cd-ext-btn-sticky").removeClass("cd-ext-hide");
        }
    })
    .catch(log_error);

     // $(".cd-ext-btn-sticky").addClass("cd-ext-hide");

    //4. bring previously clicked code in focus
    if(withSidebarOpened){
        animate_sidebar(ANIMATE.SHOW);                    
        document.getElementById(last_get_code_clicked).focus();        
        $("#"+last_get_code_clicked).siblings(".cd-ext-span").removeClass("cd-ext-hide");
    }          

    //5. When Activate Cashback is clicked in Vendor Offers tab
    $("#cd-ext-activate-cashback").click(function(){
        //window.open("https://www.goswag.com/"+source,"_self");
        
        chrome.runtime.sendMessage({
            "source" : "sidebar",
            "purpose" : "activateCashbackClicked",
            "data" : {
                "source_page_url" : window.location.href,
                "seo_identifier" : vendorInformation.url_identifier,
                "click_source" : "Vendor Offers Tab",
                "timestamp" : new Date().getTime()  
            }            
        });
        
        get_logged_in_status().then(function(status){   
          
          var current_url = window.location.href;
          current_url = current_url.replace('/#','/');
          if(current_url.indexOf('?')>-1){
              current_url = current_url + "&cd-cashback-activated=true";
          }else{
              current_url = current_url + "?cd-cashback-activated=true";
          }
          
          var success_url = slider_data.cdUrl+"?extension=chrome&source_page_url="+current_url;         
          if(status){
              //window.open("https://www.goswag.com/"+source,"_self");
              //"url" : vendorInformation_data.cd_url
              //window.open(slider_data.cdUrl+"?source_click=sidebar&reg_id="+registration_id+"&source_page_url="+window.location.href+"&source=CHROME_BEXT","_self");
              window.open(slider_data.cdUrl+"?extension=chrome&source_page_url="+encodeURIComponent(current_url),"_self");
          } else{
              /*chrome.runtime.sendMessage({
                 "source" : "browserNotification",
                 "purpose" : "setRedirectUrl",
                 "url" :  
              });*/
              
              /*chrome.runtime.sendMessage({
                 "source" : source,
                 "purpose" : "setToShowBNType4" 
              });*/
              sign_in_popup(LOGIN_CLICK_SOURCE.ACTIVATE_CASHBACK_VENDOR_TAB,success_url,null,"login",null,"same");
              
          }
       });   
    });
}

/* @author : ankit
 * This function attaches click handlers for Buy Now Button in Price Drop Alerts
 * updated by priyanka :  adding tracking
 */
function click_handler_buy_now_buttons_in_price_drop_alert(){
    
    $(".cd-ext-btn-not-buy").on('click',function(){
        
        var notification_id = $(this).data('notification-id');
        //var product_id = $(this).data('product-id');
        var buy_link = $(this).data('buy-link');
        
         chrome.runtime.sendMessage({
            "source" : "sidebar.js",
            "purpose" : "buyNowButtonClickedInPriceDropAlert",
            "data" : {
                "product_url" : get_canonical_url(),
                "notification_id" : notification_id,
                "timestamp" : new Date().getTime()                               
            }
        }); 

        //pb:  mark notification as clicked
        mark_notification_clicked(notification_id);

        //pb:tracking- through redirect url page
        //get target url and open it in a new tab
        var target_url = buy_link;
        var tracking_required = $(this).data('tracking-required');
        var redirectIdentifier = $(this).data('seo-identifier');
        if(tracking_required && redirectIdentifier){
            //send current url as a get param to redirect page
            // var landing_url = generate_get_url(REDIRECT_CONFIRM_URL + redirectIdentifier, {
            //     "extension" : "chrome",
            //     "source_page_url" : target_url,
            //     "redirectData" : JSON.stringify({
            //         isStoreOutlink: true,
            //         redirectIdentifier: redirectIdentifier
            //     })
            // });
            var landing_url = generate_get_url(REDIRECT_CONFIRM_URL + redirectIdentifier, {
                'landing_url' : target_url
            });
            window.open(landing_url, '_blank');
        }
        else{
           window.open(buy_link); 
       }
    });
}

/* @author : priyanka
 * html manupulations and click handlers for user activity tab
 */
 function html_handler_user_activity_data(userActivityhtml){
    //clear data
    $('#cdext-cashback-notification-container').html("");

    $('#cdext-cashback-notification-container').prepend(userActivityhtml);  //:prepend new notifications to the current ones

    $(".cd-ext-cashback-notification a").on('click', function(){
        mark_notification_clicked(this.id);
    });
    //priyanka:  add bell notification logo to all user activity items in the list
    add_bell_notification_logo();
 }

/* @author : ankit -> priyanka
 * This function slides out or slides in the sidebar
 */
function animate_sidebar(effect){
    
    if(!global.is_sidebar_invoked) return false;
    
    if(!effect){
        effect = ANIMATE.SHOW;
    }

    switch(effect){
        case ANIMATE.TOGGLE :            
            
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-out')))
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-out');  
                                   
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-in'))){
                //$("#cd-ext-slider").css("display","block");
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-in');                
 
            } else {                               
                setTimeout(function() {
                    $(".cd-ext-browser-extension-container").addClass('cd-ext-slide-in');
                }, 100);                
            }                               
            break;

        case ANIMATE.SHOW :
            //$("#cd-ext-slider").css("display","block");
            
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-out'))){
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-out');                  
            }
            setTimeout(function() {
                $(".cd-ext-browser-extension-container").addClass('cd-ext-slide-in');
            }, 100);
                                    
            break;

        case ANIMATE.HIDE :
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-in'))){
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-in');
            }
            break;
    }
}

/* @author : ankit -> priyanka
 * This function sets a partcular tab in focus
 */
function animate_tab(){
    
    if(!global.is_sidebar_invoked) return false;
    
    if(is_supported_vendor() && is_vendor_offers_present()){    
        show_desired_tab('cd-ext-merchant-tab');
    } else{
        show_desired_tab('cd-ext-offers-tab');
        
    }
}

//@priyanka :  wrapper function for show_desired_tab or sub_tab
function highlight_tab(tab){

    switch(tab){
        //tabs
        case TABS.TAB.MERCHANT :
            show_desired_tab('cd-ext-merchant-tab');
            break;

        case TABS.TAB.TOP_OFFERS :
            show_desired_tab('cd-ext-offers-tab');
            break;

        case TABS.TAB.NOTIFICATION :
            show_desired_tab('cd-ext-notification-tab');
            break;

        //subtabs
        case TABS.SUB_TAB.MERCHANT_OFFER :
            show_desired_tab('cd-ext-merchant-tab');
            show_desired_sub_tab('cd-ext-merchant-offer-tab');
            break;

        case TABS.SUB_TAB.PRICE_COMPARISION :
            show_desired_tab('cd-ext-merchant-tab');
            show_desired_sub_tab('cd-ext-price-compare-tab');
            break;

        case TABS.SUB_TAB.SPECIAL_OFFER :
            show_desired_tab('cd-ext-notification-tab');
            show_desired_sub_tab('cd-ext-special-offer-tab'); 
            break;

        case TABS.SUB_TAB.USER_ACTIVITY :
            show_desired_tab('cd-ext-notification-tab');
            show_desired_sub_tab('cd-ext-user-activity-tab');
            break;
    }
}

/* @author : priyanka
 * This function tells if the sidebar is currently open or not
 * return boolean
 */
function is_sidebar_open(){
    if(($('#cd-ext-slider').hasClass('cd-ext-slide-in'))){
        return true;
    }
    else{
        return false;
    }
}

//@ankit
//Click Handler for the button "Get an alert when price drops" in Price Comparison Tab
function get_an_alert_when_price_drops_handler_in_tab(className){
    $("."+className).click(function(event) {
        if($(".cd-ext-btn-product-alert").hasClass('cd-ext-get-price-alert-updated'))
            return false;        
        //slide the sidebar inside
        animate_sidebar(ANIMATE.HIDE);
        show_price_alert_subscribe_notification_unleashed();           
        
    });
}

/* @author ankit -> priyanka
 * this function attaches click handlers to individual deals
 */
function activate_deal_click_handler(){
    var thisObj = this;
    
    $("#"+thisObj.offerId).click(function(){
         
        chrome.runtime.sendMessage({
           "purpose" : "couponOrDealClicked",
           "source" : "sidebar",
           "data" : {
               "offerId" : thisObj.offerId,
               "seo_identifier" : vendorInformation.url_identifier,
               "click_source" : "Activate Deal In Vendor Offers",
               "source_page_url" : window.location.href,
               "timestamp" : new Date().getTime(),
			   "offer_type" : "Deal"
           } 
        }); 
        
        chrome.runtime.sendMessage({
            "source" : source,
            "purpose" : "setRevealedCouponCodes",
            "couponCode" : thisObj.offerId
        });
        
        var success_url = slider_data.cdUrl
                            +"?extension=chrome"
                            +"&offerId="+thisObj.offerId
                            +"&login_required="+thisObj.loginRequired
                            +"&offer_type="+thisObj.couponType
                            +"&web_cashback="+JSON.stringify(thisObj.webCashback);
                            
        var continue_without_signup_url = REDIRECT_CONFIRM_PAGE_OFFER + thisObj.offerId;
                        
        if(global.is_cashback){
            //2 cases
            //logged_in and not logged_in
            get_logged_in_status()
            .then(function(logged_in){
                
                if(logged_in){
                    //Spec : In a new tab, immediately show a modal with cashback tips. At the bottom show a start shopping button
                    //Translates into : open the store page with "Start Shopping" modal opened 
                    //                  clicking on "Start Shopping" should take u to the landing page of the deal                                         
                    
                    
                    window.open(success_url,"_blank");
                    
                } else{
                    //make the user log in
                    //2 cases 
                    //user signs in/up successfully --> 
                        //same as if(logged_in)
                    
                    //user doesnt log in successfully -->
                        //follow behaviour of cashback not available
                        //so generate an outlink and pass it to login function for continue without signup url 
                    
                    sign_in_popup(LOGIN_CLICK_SOURCE.ACTIVATE_DEAL_VENDOR_OFFERS,success_url,window.location.href,"login",continue_without_signup_url,"new");                                                                                    
                }
            });            
            
        } else{            
            window.open(continue_without_signup_url,"_blank");
        }
        
    });
}

//ankit
//function to copy coupon code to clipboard 
function copy_coupon_code(code) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
}

/* @author ankit
 * this function attaches click handlers to individual coupons
 */
function top_deals_get_code_click_handler(topdeal){
            
    chrome.runtime.sendMessage({
        "source" : source,
        "purpose" : "setRevealedTopOffers",
        "couponCode" : topdeal.offerId+"_"+topdeal.offerId
    });  
    
    var timestamp = new Date().getTime();
    chrome.runtime.sendMessage({
        "source" : "sidebar",
        "purpose" : "setGetCodeCookie",
        "timestamp" : timestamp,
        "data" : topdeal,
        "imagesUrl" :null,//topdeal.logo,
        "seoIdentifier" : topdeal.store.seo_identifier,
        "store" : topdeal.store.name
    });
    
    var current_url = window.location.href;
    current_url = current_url.replace('/#','/');                            
    
    var success_url = topdeal.store.cd_url
                        +"?extension=chrome"
                        +"&t=cd"+timestamp
                        +"&offerId="+topdeal.offerId
                        +"&login_required="+topdeal.loginRequired
                        +"&offer_type="+topdeal.couponType
                        +"&web_cashback="+JSON.stringify(topdeal.cashback)
                        +"&give_cashback=1"
                        +"&source_page_url="+ current_url;
                        
    var continue_url = topdeal.store.cd_url
                        +"?extension=chrome"
                        +"&t=cd"+timestamp
                        +"&offerId="+topdeal.offerId
                        +"&login_required="+topdeal.loginRequired
                        +"&offer_type="+topdeal.couponType
                        +"&web_cashback="+JSON.stringify(topdeal.cashback)
                        +"&give_cashback=0"
                        +"&source_page_url="+ current_url;
                    

    if(topdeal.isCashback){
        get_logged_in_status()
        .then(function(logged_in){                                
                                
            if(logged_in){       
                
                var openUrl = topdeal.store.cd_url
                                                +"?extension=chrome"
                                                +"&offerId="+topdeal.offerId
                                                +"&t=cd"+timestamp
                                                +"&login_required="+topdeal.loginRequired
                                                +"&offer_type="+topdeal.couponType
                                                +"&web_cashback="+JSON.stringify(topdeal.cashback)
                                                +"&give_cashback=1"
                                                +"&source_page_url="+ encodeURIComponent(current_url);
                
                if(topdeal.couponType=="one-time-coupon"){
                    window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId + '&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(openUrl));
                }
                else{
                    window.open(openUrl);
                }
                                                    
            } else{
                
                if(topdeal.couponType == "one-time-coupon"){
                    success_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId + '&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(success_url);
                    continue_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId +'&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(continue_url);
                } 
                    
                sign_in_popup(LOGIN_CLICK_SOURCE.GET_CODE_VENDOR_OFFERS,success_url,window.location.href,"login",continue_url,"new");                    
                
            }

        });
    } else{
        //set_tracking_parameters({"seo_identifier" : global.url_identifier,"offerId":thisObj.offerId});  
        var openUrl = topdeal.store.cd_url+"?extension=chrome"
                                        +"&t=cd"+timestamp
                                        +"&offerId="+topdeal.offerId
                                        +"&give_cashback=0"
                                        +"&offer_type="+topdeal.couponType
                                        +"&source_page_url="+ encodeURIComponent(current_url);
        if(topdeal.couponType == "one-time-coupon"){
            if(topdeal.loginRequired){
                //check for authentication
                get_logged_in_status()
                .then(function(logged_in){
                    if(logged_in){
                        window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId + '&cid=cd' + timestamp +'&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&page_url=' + encodeURIComponent(openUrl));
                    } else{
                        success_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId + '&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(success_url);
                        continue_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId +'&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(continue_url);
                        sign_in_popup(LOGIN_CLICK_SOURCE.GET_CODE_VENDOR_OFFERS,success_url,window.location.href,"login",continue_url,"new");                            
                    }
                })
                .catch(log_error);                    
            } else{
                window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + topdeal.offerId + '&cid=cd' + timestamp +'&offer_type='+ topdeal.couponType + '&login_required=' + topdeal.loginRequired + '&page_url=' + encodeURIComponent(openUrl));
            }                                                                                                   
        }                                                                   
        else {
            window.open(openUrl);
        } 
    }                                    
};


/* @author ankit -> priyanka
 * this function attaches click handlers to individual coupons
 */
function get_code_click_handler(){
    var thisObj = this;
    $("#"+thisObj.offerId).click(function(){
        //click action
        //set as revealed coupon code
        //copy to clipboard the coupon code
        chrome.runtime.sendMessage({
            "source" : source,
            "purpose" : "setRevealedCouponCodes",
            "couponCode" : thisObj.offerId
        });
        
        var timestamp = new Date().getTime();
        
        chrome.runtime.sendMessage({
           "source" : source,
           "purpose" : "setGetCodeCookie",
           "timestamp" : timestamp,
           "data" : thisObj, 
           "imagesUrl" : null,//global.vendor_logo,
           "seoIdentifier" : global.url_identifier,
           "store" : source
        });
        
        chrome.runtime.sendMessage({
           "purpose" : "couponOrDealClicked",
           "source" : "sidebar",
           "data" : {
               "offerId" : thisObj.offerId,
               "seo_identifier" : vendorInformation.url_identifier,
               "click_source" : "Get Code In Vendor Offers",
               "source_page_url" : window.location.href,
               "timestamp" : new Date().getTime(),
			   "offer_type" : "Coupon"
           } 
        }); 
       
        //copy_coupon_code(thisObj.couponCode);   
        var current_url = window.location.href;
        current_url = current_url.replace('/#','/');
                
        var success_url = slider_data.cdUrl
                            +"?extension=chrome"
                            +"&offerId="+thisObj.offerId
                            +"&t=cd"+timestamp
                            +"&login_required="+thisObj.loginRequired
                            +"&offer_type="+thisObj.couponType
                            +"&web_cashback="+JSON.stringify(thisObj.webCashback)
                            +"&give_cashback=1"
                            +"&source_page_url="+ current_url;
                            
        var continue_url = slider_data.cdUrl
                            +"?extension=chrome"
                            +"&t=cd"+timestamp
                            +"&offerId="+thisObj.offerId
                            +"&login_required="+thisObj.loginRequired
                            +"&offer_type="+thisObj.couponType
                            +"&web_cashback="+JSON.stringify(thisObj.webCashback)
                            +"&give_cashback=0"+
                            "&source_page_url="+ current_url;        

        if(global.is_cashback){
            get_logged_in_status()
            .then(function(logged_in){
                //if logged_in
                //From Spec
                //Coupon Code is copied to clipboard. In the same tab, immediately show a modal with cashback tips 
                //in the foreground of the CD website merchant page.The merchant page is out of focus. 
                //At the bottom show a start shopping button. When the user clicks on "Start Shopping", 
                //The previous url will be reloaded with tracking parameters in the url and the sidebar 
                //will be opened again with coupon code being shown and label "Copied" next to it.
                
                //if not
                //make the user login and do what you do for loggedin
                
                //if unsuccessful login or continue_without_signup_url]
                //same behavior as cashback not available                          
                                    
                if(logged_in){   
                                         
                    var openUrl = slider_data.cdUrl
                                    +"?extension=chrome"
                                    +"&t=cd"+timestamp
                                    +"&offerId="+thisObj.offerId
                                    +"&login_required="+thisObj.loginRequired
                                    +"&offer_type="+thisObj.couponType
                                    +"&web_cashback="+JSON.stringify(thisObj.webCashback)
                                    +"&give_cashback=1"
                                    +"&source_page_url="+ encodeURIComponent(current_url);
                                    
                    if(thisObj.couponType=="one-time-coupon"){
                        window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId +'&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(openUrl));
                    }
                    else{
                        window.open(openUrl);
                    }
                                                                            
                } else{
                    
                    if(thisObj.couponType=="one-time-coupon"){
                        success_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId + '&cid=cd' + timestamp +'&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&page_url=' + encodeURIComponent(success_url);
                        continue_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId + '&cid=cd' + timestamp + '&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&page_url=' + encodeURIComponent(continue_url);
                    }
                    sign_in_popup(LOGIN_CLICK_SOURCE.GET_CODE_VENDOR_OFFERS,success_url,window.location.href,"login",continue_url,"new");
                }
            });
        } else{
            //set_tracking_parameters({"seo_identifier" : global.url_identifier,"offerId":thisObj.offerId});             
            //window.open(REDIRECT_CONFIRM_PAGE_OFFER+thisObj.offerId,"_blank");
            var openUrl = slider_data.cdUrl
                                +"?extension=chrome"
                                +"&t=cd"+timestamp
                                +"&offerId="+thisObj.offerId
                                +"&login_required="+thisObj.loginRequired
                                +"&offer_type="+thisObj.couponType
                                +"&give_cashback=0"
                                +"&source_page_url="+ encodeURIComponent(current_url);
                                
            if(thisObj.couponType == "one-time-coupon"){
                if(thisObj.loginRequired){
                    //check for authentication
                    get_logged_in_status()
                    .then(function(logged_in){
                        if(logged_in){
                            window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId + '&cid=cd' + timestamp +'&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&page_url=' + encodeURIComponent(openUrl));
                        } else{
                            success_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId + '&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(success_url);
                            continue_url = CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId +'&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&cid=cd' + timestamp + '&page_url=' + encodeURIComponent(continue_url);
                            sign_in_popup(LOGIN_CLICK_SOURCE.GET_CODE_VENDOR_OFFERS,success_url,window.location.href,"login",continue_url,"new");                            
                        }
                    })
                    .catch(log_error);                    
                } else{
                    window.open(CD_WEBSITE_URl+ '/code-redirect?offer_id=' + thisObj.offerId + '&cid=cd' + timestamp +'&offer_type='+ thisObj.couponType + '&login_required=' + thisObj.loginRequired + '&page_url=' + encodeURIComponent(openUrl));
                }                                                                                                   
            }                                                                   
            else {
                window.open(openUrl);
            }              
        }                                    
    });
};

/* @author : ankit -> priyanka
 * This function appends the sidebar skeleton in the page
 */
function invoke_sidebar(){
    
    render_template_firefox(global, 'sidebar')
    .then(function(sidebar_skeleton_html){
       $('body').append(sidebar_skeleton_html);
        click_handler_sidebar();        
        
        //default behaviour : hide vendor offer tab (cuz not supported or no offers )
        if(!(is_supported_vendor() && is_vendor_offers_present())){
            //remove merchant tab title
            $('#cd-ext-savings').hide();
            //bring top deals tab in focus
            highlight_tab(TABS.TAB.TOP_OFFERS);
            //remove sticky 
            $(".cd-ext-btn-sticky").addClass("cd-ext-hide");
            global.show_sticky = false;
        }
        global.is_sidebar_invoked = true;

        //open the tab which is supposed to be open
        if(global.tab_id_to_open){
            animate_sidebar(ANIMATE.SHOW);
            highlight_tab(global.tab_id_to_open);
        }
        
    })
    .catch(function(error){
        console.log(error);
        log_error(error);
    }); 
}

/* @author : priyanka
 * This function identifies the OS on the user system
 * CHROME ONLY FUNCTION
 */
function get_system_os(){ //pb: DO NOT PORT TO FIREFOX. This function is required only in chrome. 
    var user_agent = navigator.userAgent;
    if(user_agent.indexOf("Windows") !=-1){
        return OS.WINDOWS;
    }
    if(user_agent.indexOf("Macintosh") !=-1){
        return  OS.MAC;
    }
    return OS.WINDOWS; //default
}

/* @priyanka
 * This function determines if the screen is full screen or not
 * CHROME ONLY FUNCTION
 */
function is_fullscreen(){ //pb: DO NOT PORT TO FIREFOX. This function is required only in chrome. 
    var os = get_system_os();
    switch(os){
        case OS.WINDOWS : 
            if (window.outerWidth === screen.width && window.outerHeight === screen.height)
                return true;
            else
                return false;
            
        case OS.MAC :
            if (window.outerWidth === document.documentElement.clientWidth && window.outerHeight === document.documentElement.clientHeight)
                return true;
            else
                return false;
            
        default : return false;
    }
}


/* This function handles all the sidebar events
 *
 */
function click_handler_sidebar(){

        //load data into the sidebar all tabs
        popuplate_tabs_data();

        $("#cd-ext-pc").hide();
        //update local storage data
        // refresh_local_data_from_api();
        
        //moved to html_handler_price_comparision_data()
        //get_an_alert_when_price_drops_handler_in_tab("cd-ext-btn-product-alert");                  
        
        //login on the user activity tab
        $(document).on('click',".cd-ext-user-login",function(event){
            // sign_in_popup();
           sign_in_popup(LOGIN_CLICK_SOURCE.USER_ACTIVITY_TAB, null, null, 'login');
        });

        //signup on the user activity tab
        $(document).on('click',".cd-ext-user-signup",function(event){
            // sign_in_popup();
            sign_in_popup(LOGIN_CLICK_SOURCE.USER_ACTIVITY_TAB, null, null, 'signup' );
        }); 
        
        
        //@khushbu
        $(document).on('click', '.cd-ext-tab', function(event){
            var eventClass = event.target.className.split(' ')[0];

            show_desired_tab(eventClass);
            
        });    

        $(document).on('click', '.cd-ext-sub-tab', function(event){
            var eventClass = event.target.className.split(' ')[0];
            show_desired_sub_tab(eventClass);
            
        });
        
        //function to open-close slide
        //@khusbu and @ankit
        $(".cd-ext-btn-sticky, .cd-ext-extension-close" ).on("click", function() {
            
            if(typeof global.is_sidebar_invoked==='undefined' || !global.is_sidebar_invoked) return false;
            
            global.should_sidebar_dance = false;
            
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-out'))){
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-out');                 
            }
            
            if(($('#cd-ext-slider').hasClass('cd-ext-slide-in'))){
                $(".cd-ext-browser-extension-container").removeClass('cd-ext-slide-in');                
 
            } else {

                // //updating user activity tab at slide open.
                // refresh_user_activity_tab();

                // //pb: set tooltip bahaviour at slide open.
                // refresh_settings_tooltip_behaviour();

                // //updating special offers tab at slide open
                // get_special_offers_notifications();

                // //pb: load data into top_deals_and offers_tab at slide open.
                // get_top_deals_and_offers();
                          
                    
                setTimeout(function() {
                    $(".cd-ext-browser-extension-container").addClass('cd-ext-slide-in');
                }, 100);                
            }      
            
            //collect this click data of sticky was clicked
            if($(this).hasClass("cd-ext-btn-sticky")){
                chrome.runtime.sendMessage({
                    "source" : "sidebar",
                    "purpose" : "sidebarButtonClicked",
                    "data" : {
                        "domain" : global.domain
                    }
                }); 
            }
            
            show_browser_notif = false;
                              
        });
               
        
        //function to open dropdown user & settings menu
        //updated by priyanka
        $( ".cd-ext-ext-user, .cd-ext-ext-settings").on("click", function(event) {
            
            var updatedUrl ='';
            // var eventClass = event.target.className.split(' ')[0];
            // if(!eventClass){
            //     eventClass = event.target.parentNode.className.split(' ')[0];
            // }
            var eventClass = '';
            if($(this).hasClass("cd-ext-ext-user")){
                eventClass = "cd-ext-ext-user";
            }
            else if($(this).hasClass("cd-ext-ext-settings")){
                eventClass = "cd-ext-ext-settings";
            }
            
            function icon_click_common_functionalities(){    
                if($( "."+ eventClass).hasClass(eventClass + '-active')){
                    $( "."+ eventClass).removeClass(eventClass + '-active');

                    if(eventClass == 'cd-ext-ext-user'){
                        // updatedUrl = chrome.runtime.getURL("/resources/img/user.png");
                        // $("."+ eventClass).css("background-image", "url( "+updatedUrl+")");
                    } else {
                        updatedUrl = chrome.runtime.getURL("/resources/img/settings_icon.png");
                        $("."+ eventClass + " img").attr("src", updatedUrl);
                    }
                } else {
                    $( "."+ eventClass).addClass(eventClass + '-active');
                    if(eventClass == 'cd-ext-ext-user'){
                        // updatedUrl = chrome.runtime.getURL("/resources/img/user-active.png");
                        // $("."+ eventClass).css("background-image", "url( "+updatedUrl+")");
                    }else {
                        updatedUrl = chrome.runtime.getURL("/resources/img/settings_icon_active.png");
                        $("."+ eventClass + " img").attr("src", updatedUrl);
                    }
                }
                
                $( "."+ eventClass + "-menu" ).fadeToggle( "fast" );
            }


            //@priyanka :  hide items on the list based on whether or not the user is logged in
            get_logged_in_status()
            .then(function(logged_in){
                if(logged_in){
                    icon_click_common_functionalities();
                    //user is logged in
                    //1. hide signup/login button
                    $("#cdext-menu-signup").hide();
                    $("#cdext-my-account").show();
                    $("#cdext-my-price").show();
                    $("#cdext-logout").show();

                    //setting preferences menu should be hidded/shown 
                    $("#cdext-settings-user-menu").show();

                    //Activate stored preferences
                    //@priyanka : to load check/unchecked state of user preferences 
                    activate_stored_pref();
                    
                    if($("#cd-ext-price-alert").hasClass("cd-ext-hide")){
                        $("#cd-ext-price-alert").removeClass("cd-ext-hide");
                    }                   
                    $("#cd-ext-price-alert").addClass("cd-ext-show");
                }
                else{
                    //user is logged out
                    if(eventClass == 'cd-ext-ext-user'){
                        icon_click_common_functionalities();
                        //1. hide logout n  my acc button
                        $("#cdext-menu-signup").show();
                        $("#cdext-logout").hide();
                        $("#cdext-my-account").hide();
                        $("#cdext-my-price").hide();
                    }                    
                    //Price Comparison Tab
                    //@ankit : show signup/login buttons or "Get Price Drop Alerts" button
                    if($("#cd-ext-price-signup").hasClass("cd-ext-hide")){
                        $("#cd-ext-price-signup").removeClass("cd-ext-hide");
                    }                   
                    $("#cd-ext-price-signup").addClass("cd-ext-show");
                    
                    if($("#cd-ext-price-login").hasClass("cd-ext-hide")){
                        $("#cd-ext-price-login").removeClass("cd-ext-hide");
                    }                   
                    $("#cd-ext-price-login").addClass("cd-ext-show");
                }
            });
            
        });

        //@khushbu - Click outside dropdown should close dropdowns
        //updated by priyanka
        $('body').click(function(e) {
            if ($(e.target).closest('.cd-ext-ext-user-menu').length === 0 && $(e.target).closest('.cd-ext-ext-user').length === 0) {
                $( ".cd-ext-ext-user-menu").hide();
                $( ".cd-ext-ext-user").removeClass('cd-ext-ext-user-active');
                //pb : not required anymore
                //if(!user_and_account_buttons_url_updated){
                    // var updatedUrl = chrome.runtime.getURL("/resources/img/user.png");
                    // $(".cd-ext-ext-user").css("background-image", "url( "+updatedUrl+")");
                //}
            }
            if ($(e.target).closest('.cd-ext-ext-settings-menu').length === 0 && $(e.target).closest('.cd-ext-ext-settings').length === 0) {
                $('.cd-ext-ext-settings-menu').hide();
                $('.cd-ext-ext-settings').removeClass('cd-ext-ext-settings-active');
                // if(!user_and_account_buttons_url_updated){                                    
                    var updatedUrl = chrome.runtime.getURL("/resources/img/settings_icon.png");
                    $(".cd-ext-ext-settings img").attr("src", updatedUrl);
                    user_and_account_buttons_url_updated = true;
                // }
            }            
        });

        //@khushbu - move outside extension should close dropdowns
        $(".cd-ext-browser-extension-container").on('mouseleave',function(e){
            $( ".cd-ext-ext-user-menu").hide();
            $( ".cd-ext-ext-user").removeClass('cd-ext-ext-user-active');
            $('.cd-ext-ext-settings-menu').hide();
            $('.cd-ext-ext-settings').removeClass('cd-ext-ext-settings-active');
            //pb :  not required anymore
            // var updatedUrl = chrome.runtime.getURL("/resources/img/user.png");
            // $(".cd-ext-ext-user").css("background-image", "url( "+updatedUrl+")");
            var updatedUrl = chrome.runtime.getURL("/resources/img/settings_icon.png");
            $(".cd-ext-ext-settings img").attr("src", updatedUrl);
        });

        //@priyanka: logout from the extension
        $("#cdext-logout").on('click', function(){
            
            // close menu
            $(".cd-ext-ext-user-menu").fadeToggle( "fast" );

            send_logout_backend()  //this calls the backend logout api
            .then(function(){
                save_logged_out_state();
                show_user_activity(false);
            })
            .catch(log_error);
        });

        $(".cd-ext-login-label").on("click", function(){
            sign_in_popup(LOGIN_CLICK_SOURCE.HEADER);
        });

        //@priyanka: open login/signup popup : obsolete now
        $("#cdext-menu-signup").on('click', function(){
            
            sign_in_popup(LOGIN_CLICK_SOURCE.MY_ACCOUNT_MENU);
            // close menu
            $(".cd-ext-ext-user-menu").fadeToggle( "fast" );
        });

        //@priyanka: redirect to my account page
        $("#cdext-my-account").on('click', function(){
            
            chrome.runtime.sendMessage({
               "source" : "sidebar",
               "purpose" : "myAccountButtonClicked"
            });
            
            window.open(MY_ACCOUNT_URL, '_blank');
            // close menu
            $(".cd-ext-ext-user-menu").fadeToggle( "fast" );
            // var win=window.open('MY_ACCOUNT_URL', '_blank');
            // win.focus();
        });        
        
        $("#cdext-my-price").on('click',function(){
            
            chrome.runtime.sendMessage({
               "source" : "sidebar",
               "purpose" : "myPriceAlertsButtonClicked" 
            });

            window.open(MY_PRICE_ALERTS_URL,'_blank');
            $(".cd-ext-ext-user-menu").fadeToggle( "fast" );

        });

        //function to change checkbox css
        $(document).on('click', '.cd-ext-ext-slide', function(){
            $("input.cd-ext-input:checked").parent().css("background","#19e288");
            $("input.cd-ext-input:not(:checked)").parent().css("background"," #949494");
        });

        
        //@priyanka :  function to save user preferences
        $("#cdext-save-settings").on('click', function(){
            //copy default preferences to out variable
            var user_pref = $.extend({},DEFAULT_USER_PREF);
            var list_items = $(".cd-ext-ext-slide input");
            var uc_len = list_items.length;

            //close menu
            $( ".cd-ext-ext-settings-menu" ).fadeToggle( "fast" );

            $.each(list_items, function(index, value){
                var is_checked = $($(value)).is(":checked");
                if(is_checked == true){
                    // console.log(value.name + "checked");
                    user_pref[value.name] = TRUE;
                }
                else if(is_checked == false){
                    // console.log(value.name + ":not checked");
                    user_pref[value.name] = FALSE;
                }

                //update global.show sticky immediately wjen show sticker preferences is changed
                if(value.name == 'show_cd_sticker'){
                    if(global.show_sticky && is_checked && $(".cd-ext-btn-sticky").hasClass("cd-ext-hide")){
                        $(".cd-ext-btn-sticky").removeClass("cd-ext-hide");
                    }
                    else if(global.show_sticky && !is_checked && !$(".cd-ext-btn-sticky").hasClass("cd-ext-hide"))
                    {
                        $(".cd-ext-btn-sticky").addClass("cd-ext-hide");
                    }
                }
                
                if(index == (uc_len - 1)){
                    //last index
                    
                    //send user preferences back to backend server
                    send_user_preferences(user_pref)
                    .then(function(){
                         console.log("SAVING USER PREF SUCCEEDED");
                         // console.log(user_pref);
                        // save this preference in local storage
                        save_user_preferences(user_pref);
                    })
                    .catch(log_error);

                }
            });
        });

        $("#cdext-cancel-settings").on('click', function(){
            //close menu
            $( ".cd-ext-ext-settings-menu" ).fadeToggle( "fast" );
        });

        //priyanka :  click outside the slider should close the slider
        global.is_slider_body = false;
        $(".cd-ext-browser-extension-container").on('mouseleave',function(e){
            global.is_slider_body = false;
        });
        $(".cd-ext-browser-extension-container").on('mouseenter',function(e){
            global.is_slider_body = true;
        });
        $(document).on('click',function(){
            if(!global.is_slider_body){
                animate_sidebar(ANIMATE.HIDE);
            }
        });

    

    //Priyanka: hide sticky when browser in fullscreen
    window.onresize = function(event) {
        setTimeout(function(){
            if(DEBUG){
                console.log(window.outerWidth +":"+ screen.width + ":" + document.documentElement.clientWidth);
                console.log(window.outerHeight +":"+ screen.height + ":" + document.documentElement.clientHeight);
            }

            if(is_fullscreen()){ //pb: DO NOT PORT TO FIREFOX. This line's implementation is chrome specific. 
            // if (window.outerWidth === screen.width && window.outerHeight === screen.height) {
                if(DEBUG)
                    console.log("FULL SCREEN MODE");  
                    
                //hide sticky
                if(!$(".cd-ext-btn-sticky").hasClass("cd-ext-hide")){
                    $(".cd-ext-btn-sticky").addClass("cd-ext-hide");
                }
            }
            else{
                if(DEBUG) 
                    console.log("NOT FULL SCREEN");
                //show sticky
                get_user_preferences()
                .then(function(user_preferences){
                    if(global.show_sticky && user_preferences['show_cd_sticker'] && $(".cd-ext-btn-sticky").hasClass("cd-ext-hide")){
                        $(".cd-ext-btn-sticky").removeClass("cd-ext-hide");
                    }
                })
                .catch(log_error);
            }
        },300);
    };
}
//On click of settings label toggle button function
$(document).on('click','.cd-ext-setting-list-item', function(event){
    // pb not required
    $(this).closest('div').find('.cd-ext-input').prop('checked', !($(this).closest('div').find('.cd-ext-input').prop('checked')));
    $("input.cd-ext-input:checked").parent().css("background","#19e288");
    $("input.cd-ext-input:not(:checked)").parent().css("background"," #949494");
});



