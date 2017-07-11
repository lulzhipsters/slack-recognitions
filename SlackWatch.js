import { RtmClient, RTM_EVENTS } from '@slack/client';
import { config } from '/config';

export class SlackWatch {
    constructor(){
        this.rtm = new RtmClient(config.slackToken);
    }

    onReaction(f){
        this.rtm.on(RTM_EVENTS.REACTION_ADDED, f(reaction));
    }

    onReactionRemoved(f){
        this.rtm.on(RTM_EVENTS.REACTION_REMOVED, f(reaction));
    }
}