module.exports = {
    reactionDbFile: "./database/db",
    summaryLogDbFile: "./database/summaries",
    slackToken: "xoxb-210870825027-eNdCda96yEZEqFy0DVWUG8oS",
    slackUrl: "https://q-mmittest.slack.com",
    trackedReactions: ["+1","taco"],
    summarySchedule: "every 1 min",//"on friday at 3:30pm",//text expression as per https://bunkat.github.io/later/parsers.html#text
    summaryOutputChannel: "C0B0U1EE6",
    summaryIntroText: "Awards for this week",
    summaryNoAwardsText: "Couldn't find any awards for this week. Either I'm doing something wrong or you are",
    devMode: true,
    ignoreUsers: ["U6863K4GM"]
}