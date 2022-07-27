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
        document.title = "Gmail"
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
    // First 10 min at the start of the hour no blocking and last 45 minutes are blocked. 
    // This will make it predictable for the using email and prevent you from constantly
    // disabling the extension and forgetting to renable it.

    // Midnight to 11 am is completely blocked. Hopefully in 9 am to 11 am block you will
    // start your imortant work and make progress to be relaxed throughout the day. 

    // It has been observed that when you check email the first thing in the morning the 
    // the rest of the day is spent in being reactive to topics from the email. E.g. 
    // questions from team members, announcements, reviewing documents shared with you, etc. 
    // rather than  making progress on your specific important work you end up dividing
    // energy on multiple topics that exhausts your energy.
    // 
    // Note: time should be represented in XX:XX format else comparison logic breaks.
    return [
        ["00:00", "11:00"],
        // ["07:10", "08:00"],
        // ["08:10", "09:00"],
        // ["09:10", "10:00"],
        // ["10:10", "11:00"],
        ["11:10", "12:00"],
        ["12:10", "13:00"],
        ["13:10", "14:00"],
        ["14:10", "15:00"],
        ["15:10", "16:00"],
        ["16:10", "17:00"],
        ["17:10", "18:00"],
        ["18:10", "19:00"],
        ["19:10", "20:00"],
        ["20:10", "21:00"],
        ["21:10", "22:00"],
        ["22:10", "23:00"],
        ["23:10", "23:59"],
    ]
}

function doesCurrentTimeOverlapWithBlockingWindow() {
    currentTime = getTime();
    console.log("current time:"+ currentTime);
    blockingWindowTimeRanges = getBlockWindowTimeRanges();
    for (t of blockingWindowTimeRanges) {
        console.log("block time:"+ t[0] + " - " + t[1]);
        if (t[0] <= currentTime && currentTime <= t[1]) {
            console.log("Overlap");
            return true;
        } else {
            console.log("No overlap");
        }          
    }
    return false;
}