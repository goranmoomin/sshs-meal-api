const helpers = require("../helpers/index.js");
const { getMealDataAsObject } = require("./id.js");
const { forEach } = require("p-iteration");

module.exports = async ctx => {
    const dom = await ctx.JSDOM.fromURL("http://sshs.hs.kr/75054/subMenu.do");
    const data = dom.window.document.querySelector("tbody").outerHTML;
    ctx.message = [];

    await forEach(helpers.getRegexCaptureAsArray({
        str: data,
        regexp: /<td.*?>\s*(\d+)\s*<ul>\s*([^]*?)\s*<\/ul><\/td>/g
    }), async (element, index, array) => {
        let tmpObject = {};

        await forEach(helpers.getRegexCaptureAsArray({
            str: element[1],
            regexp: /<li>\s*<a href="javascript:void\(0\);" onclick="fnDetail\('(\d+)'\);"><span class="ico_schFood"><\/span>(.+?)<\/a>\s*<\/li>\s*/g
        }), async (element, index, array) => {
            tmpObject[element[1]] = await getMealDataAsObject(ctx, parseInt(element[0]));
        });

        if(Object.getOwnPropertyNames(tmpObject) != 0) {
            ctx.message.push({
                date: parseInt(element[0]),
                menu: tmpObject
            });
        }
    });
};
