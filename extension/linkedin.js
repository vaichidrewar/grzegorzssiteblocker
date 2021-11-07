function removeAds() {

    // Get all 'span' elements on the page
    // let spans = document.getElementsByTagName("span");

    
    body = document.getElementsByTagName('body')[0];
    // console.log("current body style:")
    // console.log(body.getAttribute("style"))
    // console.log("doesCurrentTimeOverlapWithBlockingWindow:" + doesCurrentTimeOverlapWithBlockingWindow());
    if(doesCurrentTimeOverlapWithBlockingWindow()) {
        body.setAttribute("style", "display: none !important;");
        body.background= "#343438";
        // // iframe did not work since body has display property set to none. So need
        // // to find an alterantive way to hide everything else on the page. Seems to much investment for now.
        // var substack = document.createElement("iframe");
        // substack.id = "blocker-frame";
        // substack.src = "blocked_by_cold_turkey.html"
        // substack.top = "0";
        // substack.left = "0";
        // substack.width = "100%"; 
        // substack.height = "100%"; 
        // substack.style.border= "0";        
    } else {
        body.removeAttribute("style");
        blockerIframe = document.getElementById("blocker-frame");
        if(blockerIframe) {
            blockerIframe.remove();
        }
        // console.log("Unblocking the website.")
    }

    // for (let i = 0; i < spans.length; ++i) {
    //     // Check if they contain the text 'Promoted'
    //     if (spans[i].innerHTML === "Promoted") {
    //         // Get the div that wraps around the entire ad
    //         let card = spans[i].closest(".feed-shared-update-v2");

    //         // If the class changed and we can't find it with closest(), get the 6th parent
    //         if (card === null) {
    //             // Could also be card.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode :D
    //             let j = 0;
    //             card = spans[i];
    //             while (j < 6) {
    //                 card = card.parentNode;
    //                 ++j;
    //             }
    //         }

    //         // Make the ad disappear!
    //         card.setAttribute("style", "display: none !important;");
    //     }
    // }
}


removeAds();

// Ensures ads will be removed as the user scrolls
// Every 10 sec
setInterval(function () {
    removeAds();
}, 10000)

function getTime() {
    var now = new Date();
    var hours   = now.getHours();
    var minutes = now.getMinutes();

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+':'+minutes;
}

function getBlockWindowTimeRanges() {
    return [
        ["00:00", "10:00"],
        ["10:15", "13:00"],
        ["13:15", "15:30"],
        ["15:45", "20:30"],
        ["20:45", "23:59"]
    ]
}

function doesCurrentTimeOverlapWithBlockingWindow() {
    currentTime = getTime();
    blockingWindowTimeRanges = getBlockWindowTimeRanges();
    for (t of blockingWindowTimeRanges) {
        if (t[0] <= currentTime && currentTime <= t[1]) {
            // console.log("Overlap");
            return true;
        }
    }
    return false;
}