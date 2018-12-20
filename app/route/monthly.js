const { instanceMethods } = require("p-iteration");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

Object.assign(Array.prototype, instanceMethods);

const getMealDataAsObject = async id => {
    const data = await (await fetch("http://sshs.hs.kr/75054/subMenu.do/dggb/module/mlsv/selectMlsvDetailPopup.do?mlsvId=" + id)).text();
    const $ = cheerio.load(data);
    const dataFromHTMLAsArray = $("table > tbody > tr > td.ta_l").contents().toArray().filter(node => node.type === "text").map(node => node.data.trim()).filter(str => str);

    return {
        type: dataFromHTMLAsArray[2],
        menu: dataFromHTMLAsArray[3].split(","),
        calories: dataFromHTMLAsArray[4]
    };
};

module.exports = async ctx => {
    const html = await (await fetch("http://sshs.hs.kr/75054/subMenu.do")).text();
    const $ = cheerio.load(html);

    ctx.message = await $("table > tbody > tr > td > ul").toArray().asyncMap(async node => ({
        date: /\d+/.exec($(node)[0].prev.data)[0],
        menu: await $(node).find("li > a").toArray().asyncMap(async el => await getMealDataAsObject(/\d+/.exec(el.attribs.onclick)[0]))
    }));
};
