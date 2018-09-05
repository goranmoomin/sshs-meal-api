const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.jsdomAsContext = async (ctx, next) => {
    ctx.JSDOM = JSDOM;
    await next();
};
