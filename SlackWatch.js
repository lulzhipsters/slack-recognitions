const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const WebClient = require('@slack/client').WebClient;
const config = require('./config');

class SlackWatch {
    constructor(){
        this.rtm = new RtmClient(config.slackToken);
        this.web = new WebClient(config.slackToken);

        let results = this.rtm.connect('https://q-mmittest.slack.com');
    }

    onReaction(f){
        this.rtm.on(RTM_EVENTS.REACTION_ADDED, f);
    }

    onReactionRemoved(f){
        this.rtm.on(RTM_EVENTS.REACTION_REMOVED, f);
    }

    //bot tagged and message incl. 'leaderboard' or 'stats'
    onLeaderboardRequest(f){
        this.rtm.on(RTM_EVENTS.MESSAGE, (message) => {
            if(message.text.includes(this.rtm.activeUserId) 
                && (message.text.includes('leaderboard') || message.text.includes('stats'))){
                f(message);
            }
        });
    }
}

module.exports = SlackWatch;