let fetch = require("node-fetch");
let cheerio = require("cheerio");

module.exports = async (req, res) => {
    let senRes = await fetch("https://stu.sen.go.kr/sts_sci_md00_001.do?schulCode=B100000569&schulCrseScCode=4");
    let senHTML = await senRes.text();
    let $ = cheerio.load(senHTML);
    $("table.tbl_calendar td > div").find("br").replaceWith("\n");
    let data = {};
    for (let node of $("table.tbl_calendar td > div").toArray()) {
        let text = $(node).text().split("\n");
        let date = Number.parseInt(text[0]);
        if (!date || Number.isNaN(date)) {
            continue;
        }
        let separator = "";
        let morning = "";
        let lunch = "";
        let dinner = "";
        for (let line of text) {
            if (["[조식]", "[중식]", "[석식]"].includes(line)) {
                separator = line;
                continue;
            }
            line = /^(.*?)[\d.]*$/m.exec(line)[1];
            if (separator == "[조식]") {
                morning += line + "\n";
            } else if (separator == "[중식]") {
                lunch += line + "\n";
            } else if (separator == "[석식]") {
                dinner += line + "\n";
            }
        }
        data[date] = {};
        function cleanString(string) {
            string = string.trimEnd();
            string = string.replace(/\([^)]*\)/g, "");
            return string;
        }
        if (morning) { data[date].morning = cleanString(morning); }
        if (lunch) { data[date].lunch = cleanString(lunch); }
        if (dinner) { data[date].dinner = cleanString(dinner); }
    }
    res.json(data);
};
