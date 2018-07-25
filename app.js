const Koa = require('koa');
const app = new Koa();
const serve = require("koa-static");
const routerController = require("./controller/router");
const port = 3019
routerController.getUrl(app);
//__dirname + "/static"
app.use(serve(__dirname, {extensions: ['html']}));
console.log("http://127.0.0.1:" + port)

app.listen(port);