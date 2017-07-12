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
                total: 1
            };
            userCount[reactionText] = 1;

            this.userCounts.push(userCount);
        } else {
            if(userCount[reactionText] > 0){
                userCount[reactionText]++;
            } else {
                userCount[reactionText] = 1;
            }
        }
    }

    toString(){
        let outCount = this.userCounts.slice();
        outCount.sort((a,b) => b.total - a.total);

        let userStrings = outCount.map((c) => {
            return `<@${c.user}> has a total of ${c.total} awards`;
        });

        return userStrings.join('\n')
    }
}

module.exports = ReactionTally;