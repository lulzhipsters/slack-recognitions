import { SlackWatch } from '/SlackWatch';
import { ReactionStore } from '/ReactionStore';

console.log('starting up');

let store = new ReactionStore();

let storeTrackedReaction = function(reaction) {
    if(reaction.reaction === "thumbsup") {
        store.addReaction(r);
    }
};

let removeTrackedReaction = function(reaction) {
    if(reaction.reaction === "thumbsup") {
        store.removeReaction(reaction);
    }
}

let watcher = new SlackWatch();
watcher.onReaction(storeTrackedReaction())
watcher.onReactionRemoved(removeTrackedReaction)