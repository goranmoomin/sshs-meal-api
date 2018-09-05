const idHelper = require("../helpers/id.js");

module.exports = async ctx => {
    // const dom = await ctx.JSDOM.fromURL("http://sshs.hs.kr/75054/subMenu.do/dggb/module/mlsv/selectMlsvDetailPopup.do?mlsvId=" + ctx.params.id);
    // const data = dom.serialize();

    // let dataFromHTMLAsArray = helpers.getRegexCaptureAsArray({
    //     str: data,
    //     regexp: /<td class="ta_l">\s*([^\s]+[^<>]*[^\s]+)\s*<\/td>/g
    // }).reduce((acc, val) => acc.concat(val), []);

    // ctx.message = {
    //     date: dataFromHTMLAsArray[1],
    //     type: dataFromHTMLAsArray[2],
    //     menu: dataFromHTMLAsArray[3],
    //     calories: dataFromHTMLAsArray[4]
    // };
    ctx.message = idHelper(ctx, ctx.params.id);
};
