const config = require('./config');
const SimpleDb = require('simple-node-db');

class ReactionStore {
    constructor(){
        this.db = new SimpleDb(config.dbDir)
    }

    addReaction(reaction){
        let key = this.reactionKey(reaction);

        const callback = function(err, model) {
            console.log("Stored: " + key);
        };

        this.db.insert( key, reaction, callback)
    }

    removeReaction(reaction){
        let key = this.reactionKey(reaction);

        console.log("Deleting: " + key);
        this.db.delete(key);
    }

    getStoreStats(){
        this.db.queryKeys({}, console.log)
        this.db.stats(console.log);
    }

    reactionKey(reaction){
        let itemKeyPart;
        let item = reaction.item;

        if(item.type === 'message'){
            itemKeyPart = `{${item.type}-${item.channel}-${item.ts}}`;
        } else if(item.type === 'file'){
            itemKeyPart = `{${item.type}-${item.file}}`;
        } else if(item.type === 'file_comment'){
            itemKeyPart = `{${item.type}-${item.file_comment}-${item.file}}`;
        } else {
            throw 'unknown item type';
        }

        return this.db.createDomainKey('reaction', `${reaction.user}-${reaction.item_user}-${reaction.reaction}-${itemKeyPart}`);
    }
}

module.exports = ReactionStore;