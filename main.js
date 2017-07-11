const SlackWatch = require('./SlackWatch');
const ReactionStore = require('./ReactionStore');
const config = require('./config');

let wait = function(){
    setTimeout(wait, 10000);
    console.log('still watching');
}

let isTracked = function(reactionName){
    return config.trackedReactions.indexOf(reactionName) >= 0;
}

let app = function(){
    console.log('starting up');

    let store = new ReactionStore();

    let storeTrackedReaction = function(reaction) {
        if(isTracked(reaction.reaction)) {
            store.addReaction(reaction);
        }
    };

    let removeTrackedReaction = function(reaction) {
        if(isTracked(reaction.reaction)) {
            store.removeReaction(reaction);
        }
    }

    let watcher = new SlackWatch();
    watcher.onReaction(storeTrackedReaction)
    watcher.onReactionRemoved(removeTrackedReaction)

    wait();
}

//look at using nssm to run this in windows, or add win service handler here.
app();