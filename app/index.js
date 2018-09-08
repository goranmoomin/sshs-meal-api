const Koa = require("koa");
const responseTime = require("koa-response-time");
const router = require("./route/index.js");
const cors = require("koa-cors");

const app = new Koa();
const PORT = 8080;

app.use(responseTime()).use(cors()).use(async (ctx, next) => {
    await next();

    ctx.body = {
        status: "success",
        message: ctx.message
    };
}).use(router.routes()).use(router.allowedMethods());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
