import { config } from '/config';
import { SimpleDb } from 'simple-node-db';

export class reactionStore {
    constructor(){
        this.db = new SimpleDb(config.dbFile)
    }

    addReaction(reaction){
        let key = this.reactionKey(reaction);

        const callback = function(err, model) {
            console.log("Stored: " + model);
        };

        this.db.insert( key, reaction, callback)
    }

    removeReaction(reaction){
        let key = this.reactionKey(reaction);

        this.db.delete(key);
    }

    getStoreStats(){
        this.db.queryKeys({}, console.log)
        this.db.stats(console.log);
    }

    reactionKey(reaction){
        return this.db.createDomainKey('reaction', {
            user: reaction.user,
            item_user: reaction.item_user,
            reaction: reaction.reaction,
            item: reaction.item,
        });
    }
}