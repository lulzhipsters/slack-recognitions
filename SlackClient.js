const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const config = require('./config');

class SlackClient {
    constructor(){
        this.rtm = new RtmClient(config.slackToken);

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

    writeToChannel(message, channel) {
        if(this.rtm.connected){
            this.rtm.sendMessage(message, channel);
        }
        else {
            this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
                this.rtm.sendMessage(message, channel);
            });
        }
    }
}

module.exports = SlackClient;