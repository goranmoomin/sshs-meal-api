const Router = require("koa-router");
const router = new Router();

router.get("/", require("./monthly.js"));

module.exports = router;
