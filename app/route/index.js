const Router = require("koa-router");
const router = new Router();

router.get("/", require("./monthly.js")).get("/:id", require("./id.js"));

module.exports = router;
