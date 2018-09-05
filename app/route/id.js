const helpers = require("../helpers/index.js");

let getMealDataAsObject = async (ctx, id) => {
    const dom = await ctx.JSDOM.fromURL("http://sshs.hs.kr/75054/subMenu.do/dggb/module/mlsv/selectMlsvDetailPopup.do?mlsvId=" + id);
    const data = dom.serialize();

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

module.exports = {
    route: async ctx => {
        ctx.message = getMealDataAsObject(ctx, ctx.params.id);
    },
    getMealDataAsObject: getMealDataAsObject
};
