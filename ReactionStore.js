const config = require('./config');
const DataStore = require('nedb');

class ReactionStore {
    constructor(){
        this.db = new DataStore(config.reactionDbFile);
        this.db.persistence.setAutocompactionInterval(360000);
        this.db.loadDatabase();
    }

    addReaction(reaction){
        this.db.insert(reaction, (err, newDoc) => {
            if(err){
                console.error(JSON.stringify(err));
            } else {
                console.log("Added: " + JSON.stringify(newDoc));
            }
        });
    }

    removeReaction(reaction){
        var key = {
            "user": reaction.user,
            "reaction": reaction.reaction
        }

        if(reaction.item_user) key["item_user"] = reaction.item_user;
        if(reaction.item.type) key["item.type"] = reaction.item.type;
        if(reaction.item.channel) key["item.channel"] = reaction.item.channel;
        if(reaction.item.file) key["item.file"] = reaction.item.file;
        if(reaction.item.file_comment) key["item.file_comment"] = reaction.item.file_comment;

        this.db.remove(key, (err, number) => {
            if(err){
                console.error(JSON.stringify(err));
            } else {
                console.log(`Removed ${number} records`);
            }
        })
    }

    forAllReactions(f){
        return this.db.find({}, (err, reactions) =>{
            if(err){
                console.error(err);
            } else {
                f(reactions)
            }
        });
    }

    forAllReactionsSince(f, sinceDate){
        let sinceDateSeconds = sinceDate.valueOf() / 1000;

        return this.db.find({}, (err, reactions) => {
            if(err){
                console.error(err);
            } else {
                f(reactions.filter(r => parseInt(r.ts) > sinceDateSeconds));
            }
        })
    }
}

module.exports = ReactionStore;