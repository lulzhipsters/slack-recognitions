class ReactionTally {

    constructor(){
        this.userCounts = [];
    }
    
    countReaction(user, reactionText) {
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
}

module.exports = ReactionTally;