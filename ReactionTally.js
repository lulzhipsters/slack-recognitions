class ReactionTally {

    constructor(){
        this.userCounts = [];
    }
    
    countReaction(user, reactionText) {
        if(user === undefined){
            return;
        }

        let userCount = this.userCounts.find((v) => v.user === user);

        if(userCount === undefined){
            userCount = { 
                user: user,
                total: 1,
                reactions: {}
            };
            userCount.reactions[reactionText] = 1;

            this.userCounts.push(userCount);
        } else {
            if(userCount.reactions[reactionText] > 0){
                userCount.reactions[reactionText]++;
                userCount.total++;
            } else {
                userCount.reactions[reactionText] = 1;
                userCount.total++;
            }
        }
    }

    toString(){
        this.userCounts.sort((a,b) => b.total - a.total);

        // let cn = this.userCounts[0];
        // let rx = Object.keys(cn.reactions).filter((k) => cn.hasOwnProperty);
        // let str = `:${rx}:x${cn.reactions[rx[0]]}`;

        let userStrings = this.userCounts.map((c) => {
            let reactions = Object.keys(c.reactions)
                .map(p => `:${p}:x${c.reactions[p]}`)
                .join(" ");

            return `<@${c.user}> has ${c.total} award(s): ${reactions}`;
        });

        return userStrings.join('\n')
    }
}

module.exports = ReactionTally;