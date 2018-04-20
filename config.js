module.exports = {
    reactionDbFile: "./database/db",
    summaryLogDbFile: "./database/summaries",
    slackToken: "",
    slackUrl: "",
    trackedReactions: ["+1","taco"],
    summarySchedule: "every 15 min",//"on friday at 3:30pm",//text expression as per https://bunkat.github.io/later/parsers.html#text
    summaryOutputChannel: "",
    summaryIntroText: "Awards for this week",
    summaryNoAwardsText: "Couldn't find any awards for this week. Either I'm doing something wrong or you are",
    devMode: true,
    ignoreUsers: []
}