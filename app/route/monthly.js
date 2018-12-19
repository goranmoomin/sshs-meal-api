const helpers = require("../helpers/index.js");
const { instanceMethods } = require("p-iteration");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

Object.assign(Array.prototype, instanceMethods);

const getMealDataAsObject = async id => {
    const data = await (await fetch("http://sshs.hs.kr/75054/subMenu.do/dggb/module/mlsv/selectMlsvDetailPopup.do?mlsvId=" + id)).text();

    let dataFromHTMLAsArray = helpers.getRegexCaptureAsArray({
        str: data,
        regexp: /<td class="ta_l">\s*([^\s]+[^<>]*[^\s]+)\s*<\/td>/g
    }).reduce((acc, val) => acc.concat(val), []);

    return {
        type: dataFromHTMLAsArray[2],
        menu: dataFromHTMLAsArray[3].replace(/&amp;/g, "&").split(","),
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
