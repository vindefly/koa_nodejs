const Koa = require('koa');
const app = new Koa();
const koaStatic = require("koa-static");
const render = require('koa-swig');
const co = require('co');
const path = require('path');
const controller = require("./controller/router");
const port = 3019;

app.use(koaStatic(path.join(__dirname, "static"), {
    extensions: ['html', 'js']
}));

app.context.render = co.wrap(render(app, {
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: 'memory',
    writeBody: false,
    ext: 'html'
}));

controller(app);

// app.use(async (ctx) => {
//     if(ctx.response.status == 404){
//         ctx.headers.statusCode = 404;
//         ctx.body = 'hello world'
//     } else {
//         console.log("error")
//     }
//     console.log(ctx);
// });

app.listen((process && process.env && process.env.PORT) || port, () => {
    console.log('服务已启动，port:' + ((process && process.env && process.env.PORT) || port));
});