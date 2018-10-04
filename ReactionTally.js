class ReactionTally {

    constructor(){
        this.userCounts = [];
    }
    
    countReaction(user, reactionText) {
        if(user === undefined || reactionText === undefined){
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

    leaderboard(){
        if(this.userCounts.length === 0){
            return { none: true }
        }

        this.userCounts.sort((a,b) => b.total - a.total);

        let text = this.userCounts.map((c) => {
            let reactions = Object.keys(c.reactions)
                .map(p => `:${p}:x${c.reactions[p]}`)
                .join(" ");

            return `<@${c.user}> has ${c.total} award(s): ${reactions}`;
        }).join('\n');

        return { none: false, leaderboardText: text}
    }
}

module.exports = ReactionTally;