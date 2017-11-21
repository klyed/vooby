//--------------------------------------------------------------------------
//----- Vooby STEEM Bot  v0.0.2
//----- Developed by @KLYE || Free to Use for All! || Free to Modify -------
//----- Rekuirements to run: Node.js + steem.js
//----- npm install steem --save
//--------------------------------------------------------------------------
//----- PLEASE DO NOT USE THIS CODE BELOW MALICIOUSLY / FOR EVIL DEEDS -----
//--------------------------------------------------------------------------
//----- CONFIG + Get Rekuirements
// ***IMPORTANT*** Your Posting Private Key Below
var wifkey = ' ';

// ***IMPORTANT*** Enter Voting account below (no @)
var votey = "klye";

// ***IMPORTANT*** Enter the Tag you want to upvote new posts in
var targettag = "art";

// ***IMPORTANT*** May want to modify this (10000 = 100% vote)
var weight = 2;

// No need to modify these variables
var steem = require('steem');
var totalvote = 0;
var metadatascan;
var json_metadata;
var op;

//----- Script Started + Show Time
console.log("===================================================================");
console.log("-------------------------------------------------------------------");
console.log("- Vooby Bot v0.0.2 ONLINE - By @KLYE - Listening to STEEM Network -");
console.log("-------------------------------------------------------------------");
console.log("===================================================================");

//----- Grab Current STEEM Block
steem.api.streamBlockNumber(function (err1, newestblock) {
    console.log("Scanning Block #" + newestblock + " For New #" + targettag + " Posts - Posts Voted: " + totalvote);
});

//NOTE: Sometimes the Script Fails to Hook Into STEEM. Try Running Script Again if it Fails!

//----- See if Post is our Target Asshat ----
var process_post = function (op) {
    if (op["author"] != "") {
        console.log(targettag + " Post Has Been Detected! Upvoting!");
        steem.broadcast.vote(
            wifkey,
            votey,
            op["author"],
            op["permlink"],
            weight,
            function (downerr, result) {
                if (downerr) {
                    var error = JSON.stringify(downerr);
                    if (error.toLowerCase().indexOf("You have already voted in a similar way.\n") >= 0) {
                        console.log("Oops! Vooby tried to vote for a post it already voted on!");
                    }
                }
                if (result) {
                    totalvote++;
                    console.log("Successfully voted #" + targettag + " post!");
                }
            }
        );
    }
};
//----- Streeming Latest Block Operations
steem.api.streamOperations(function (err2, blockops) {
    // get 1st item in blockops an apply to operationType variable to check type later
    var opType = blockops[0];
    // get 2nd item in blockops and store it later to be parsed if it's our specified type of operation
    var op = blockops[1];
    if (op["json_metadata"] != undefined) {

        metadatascan = op["json_metadata"];
        if (metadatascan != '') {
            var tags = JSON.parse(metadatascan);
            var actualtags = tags["tags"];
            if (actualtags != undefined) {
                var tagtag = String(actualtags);

                if (op["parent_author"] === '') {
                    if (tagtag.toLowerCase().indexOf(targettag) >= 0) {
                        process_post(op);
                    }
                }
            }

        }
    }
});
