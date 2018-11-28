
const helpers = require("../helpers/index.js");
const { instanceMethods } = require("p-iteration");
const fetch = require("node-fetch");

Object.assign(Array.prototype, instanceMethods);

const getMealDataAsObject = async (ctx, id) => {
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
    const data = /<tbody>([^]+?)<\/tbody>/g.exec(html)[1];

    ctx.message = (await helpers.getRegexCaptureAsArray({
        str: data,
        regexp: /<td.*?>\s*(\d+)\s*<ul>\s*([^]*?)\s*<\/ul>\s*<\/td>/g
    }).asyncMap(async (element, index, array) => ({
        date: parseInt(element[0]),
        menu: await helpers.getRegexCaptureAsArray({
            str: element[1],
            regexp: /<li>[^]*?onclick="fnDetail\('(\d+)'\);"[^]*?<span class="ico_schFood"><\/span>([^]+?)<\/a>\s*<\/li>/g
        }).asyncMap(async (element, index, array) => await getMealDataAsObject(ctx, parseInt(element[0]))) 
    }))).filter(element => element.menu.length != 0);
};
