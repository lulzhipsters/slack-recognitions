const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const config = require('./config');

class SlackWatch {
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
}

module.exports = SlackWatch;