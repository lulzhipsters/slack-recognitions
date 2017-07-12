const SlackClient = require('./SlackClient');
const ReactionStore = require('./ReactionStore');
const ReactionTally = require('./ReactionTally');
const config = require('./config');

let wait = function(){
    setTimeout(wait, 10000);
    console.log('watching...');
}

let isTracked = function(reaction){
    return config.trackedReactions.indexOf(reaction.reaction) >= 0 //is in tracked list
    && reaction.item_user != undefined; //item was posted by user, not by slack
    //&& reaction.user != reaction.item_user; //is not a reaction on own item
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

    let displayLeaderboard = function(requestMessage) {
        let groupReactionsByUser = function(reactions) {
            let tally = new ReactionTally();

            reactions.forEach(function(r) {
                tally.countReaction(r.item_user, r.reaction)
            }, this);

            slack.writeToChannel(tally.toString(), requestMessage.channel)
        }

        store.forAllReactions(groupReactionsByUser);
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

    wait();
}

//look at using nssm to run this in windows, or add win service handler here.
app();