const SlackClient = require('./SlackClient');
const ReactionStore = require('./ReactionStore');
const ReactionTally = require('./ReactionTally');
const Scheduler = require('./Scheduler');
const config = require('./config');

let wait = function(){
    setTimeout(wait, 10000);
    console.log('watching...');
}

let isTracked = function(reaction){
    let isTrackedReaction = config.trackedReactions.indexOf(reaction.reaction) >= 0;
    let postedByUser = reaction.item_user !== undefined; //item was posted by user, not by slack
    let userIsIgnored = config.ignoreUsers.find(i => i === reaction.item_user) !== undefined;//.indexOf(reaction.item_user) != -1; // user is not in ignore list
    let reactionIsNotToOwnPost = (reaction.user != reaction.item_user || config.devMode); //is not a reaction on own item

    return  isTrackedReaction
        && postedByUser
        && !userIsIgnored
        && reactionIsNotToOwnPost;
}

let slack = new SlackClient();

let app = function(){
    console.log('starting up');

    let store = new ReactionStore();

    let storeTrackedReaction = function(reaction) {
        if(isTracked(reaction)) {
            store.addReaction(reaction);
        }
    };

    let removeTrackedReaction = function(reaction) {
        if(isTracked(reaction)) {
            store.removeReaction(reaction);
        }
    }

    let groupReactionsByUser = function(reactions) {
        let tally = new ReactionTally();

        reactions.forEach(function(r) {
            tally.countReaction(r.item_user, r.reaction)
        }, this);

        slack.writeToChannel(tally.toString(), requestMessage.channel)
    }

    let displayLeaderboard = function(requestMessage) {
        store.forAllReactions((reactions) => {
            let tally = new ReactionTally();
    
            reactions.forEach(function(r) {
                if(isTracked(r)){
                    tally.countReaction(r.item_user, r.reaction);
                }
            }, this);

            let leaderboard = tally.leaderboard();

            let msg = leaderboard.none
                ? "No awards found"
                : leaderboard.leaderboardText;
    
            slack.writeToChannel(msg, requestMessage.channel);
        });
    }

    let displaySummary = function(sinceDateTime) {
        store.forAllReactionsSince((reactions) => {
            let tally = new ReactionTally();
    
            reactions.forEach(function(r) {
                if(isTracked(r)){
                    tally.countReaction(r.item_user, r.reaction)
                }
            }, this);

            let leaderboard = tally.leaderboard();
            
            if(leaderboard.none){
                slack.writeToChannel(config.summaryNoAwardsText, config.summaryOutputChannel);
            } else {
                slack.writeToChannel(config.summaryIntroText, config.summaryOutputChannel);
                slack.writeToChannel(tally.toString(), config.summaryOutputChannel);
            }

        }, sinceDateTime);
    }

    let displayHelp = function(requestMessage) {
        let trackedString = config.trackedReactions.map((r) => {
            return `:${r}:`;
        }).join(" ");

        let msg = `React to team members with any of the following to show your appreciation: ${trackedString}\n Tag me and type 'leaderboard' or 'stats' to see how many you've received`;

        slack.writeToChannel(msg, requestMessage.channel);
    }

    slack.onReaction(storeTrackedReaction);
    slack.onReactionRemoved(removeTrackedReaction);
    slack.onLeaderboardRequest(displayLeaderboard);
    slack.onHelp(displayHelp);

    let scheduler = new Scheduler();
    scheduler.onScheduledSummary(displaySummary);

    wait();
}

app();