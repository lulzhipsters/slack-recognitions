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
    return config.trackedReactions.indexOf(reaction.reaction) >= 0 //is in tracked list
    && reaction.item_user != undefined //item was posted by user, not by slack
    && (reaction.user != reaction.item_user || config.devMode); //is not a reaction on own item
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
                tally.countReaction(r.item_user, r.reaction)
            }, this);
    
            slack.writeToChannel(tally.toString(), requestMessage.channel)
        });
    }

    let displaySummary = function(sinceDateTime) {
        store.forAllReactionsSince((reactions) => {
            let tally = new ReactionTally();
    
            reactions.forEach(function(r) {
                tally.countReaction(r.item_user, r.reaction)
            }, this);
            
            if(tally.toString()){
                slack.writeToChannel(config.summaryIntroText, config.summaryOutputChannel);
                slack.writeToChannel(tally.toString(), config.summaryOutputChannel);
            } else {
                slack.writeToChannel(config.summaryNoAwardsText, config.summaryOutputChannel);
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
    scheduler.onScheduledSummary(displaySummary)

    wait();
}

app();