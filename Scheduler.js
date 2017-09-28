const config = require('./config');
const later = require('later');

class Scheduler {
    constructor(){
        later.date.localTime();
    }

    onScheduledSummary(f) {
        let schedule = later.parse.text(config.summarySchedule);

        if(schedule.error !== -1){
            console.error("Could not parse schedule at char: ", schedule.error);
        } else {
            later.setInterval(() => {
                let lastSummaryDate = later.schedule(schedule)
                    .prev(2)[1];//get last before the one that triggered this run

                f(lastSummaryDate);
            }, schedule);
        }
    }
}

module.exports = Scheduler;