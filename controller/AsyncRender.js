
const path = require('path');
const fs = require('fs');
const request = require('request');
const config = require('./Config');
const getJsonData = require('./GetJsonData');
const getCdn = require('./GetCdn');
const getStaticRev = getJsonData("dist/static/resources-manifest.json");
//404错误页面
const errorPage = async (ctx, next, err) => {
    ctx.response.status = 404;
    ctx.body = await ctx.render("template/error.html", {
        title: "error page",
        error: `Error 404 Url <h5 style='width: 80%; background: #333; color: #888;font-size: 16px;line-height: 170%;padding: 20px;margin: 30px auto;'>${err}</h5>`
    });
};

const suffixName = config.suffix_name;

const _reader = {
    async viewsReader(ctx, next) {
        try {
            let _rpath = ctx.request.path;
            let _dirPath = path.join(__dirname, '../' + _rpath);
            if (!_dirPath.endsWith(suffixName)) {
                _dirPath += suffixName;
            }

            _dirPath = _dirPath.replace(suffixName, '');

            ctx.response.status = 200;

            //设置页面全局方法
            ctx.state = Object.assign(ctx.state, {
                get_static_file: function (url) {
                    return getCdn.get_static_file((process.env.NODE_ENV == "dev" ? url : (getStaticRev[url] || url)));
                },
                get_cdn_url: getCdn.get_cdn_url,
                get_domain: ctx.request.origin,
                get_env: process.env.NODE_ENV,
                html_attr: '',
                body_attr: '',
                model_js_type: 'vue',
                css_page_list: [],
                js_head_list: [],
                js_foot_list: [],
                env: {
                    isDev: process.env.NODE_ENV == "dev",
                    isTest: process.env.NODE_ENV == "test",
                    isStaging: process.env.NODE_ENV == "staging",
                    isProd: process.env.NODE_ENV == "production",
                },
                router_data: process.env.NODE_ENV === "production" ? {} : config.router_json
            });

            var htmlContent = '<!-- <html><head><script type="text/javascript" src="main.js"></script><style></style></head><body></body></html> -->';
            
            htmlContent += await ctx.render(_dirPath, {
                title: "一起学"
            });

            if (process.env.NODE_ENV !== "production") {
                htmlContent += `
                <script src="${getCdn.get_static_file('/s17/??lib/eruda/1.3.0/seed.min.js')}" type="text/javascript"></script>
                <script type="text/javascript">
                    document.addEventListener("DOMContentLoaded", function(){
                        try{window.eruda.init();}catch(e){};
                    });
                </script>
                `;
            }

            htmlContent += '<!-- <html><head><script type="text/javascript" src="main.js"> </script><style></style></head><body></body></html>';

            ctx.body = htmlContent;
        } catch (err) {
            console.log(err)
            await errorPage(ctx, next, err);
        }
    },
    async sappReader(ctx) {
        try {
            let _path = ctx.request.path;
            let _temp_file = _path.replace(".vpage", "");

            ctx.response.status = 200;
            
            var htmlContent = '<!-- <html><head><script type="text/javascript" src="main.js"></script><style></style></head><body></body></html> -->';
            
            htmlContent += await ctx.render(path.join(__dirname, '../' + _temp_file), {
                title: "一起学"
            });

            if (process.env.NODE_ENV !== "production") {
                htmlContent += `
                <script src="${getCdn.get_static_file('/s17/??lib/eruda/1.3.0/seed.min.js')}" type="text/javascript"></script>
                <script type="text/javascript">
                    document.addEventListener("DOMContentLoaded", function(){
                        try{window.eruda.init();}catch(e){};
                    });
                </script>
                `;
            }

            htmlContent += '<!-- <html><head><script type="text/javascript" src="main.js"> </script><style></style></head><body></body></html>';

            ctx.body = htmlContent;
        } catch (err) {
            await errorPage(ctx, next);
        }
    },
    async updateStaticReader(ctx) {
        if (ctx.query.key === "AAAAB3NzaC1yc2EAAAADAQABAAABAQCh7/hNLlyS6u6IgF5f") {
            ctx.response.status = 200;
            if (!fs.existsSync(path.join(__dirname, '../update_log.json'))) {
                var w_data = '{"update": ' + Date.now() + '}';
                var w_data = new Buffer(w_data);
                fs.writeFileSync(path.join(__dirname, '../update_log.json'), w_data, (err) => {
                    if (err)
                        return console.error(err);
                    console.log('写入文件成功');
                });

                if (process.env.NODE_ENV === "production" && ctx.query.type != 1) {
                    // https://www.17xueba.com/views/update_static_res.vpage?type=1&key=AAAAB3NzaC1yc2EAAAADAQABAAABAQCh7/hNLlyS6u6IgF5f
                    let _urlArr = ['10.6.50.20']

                    for (var i = 0; i < _urlArr.length; i++) {
                        request('http://' + _urlArr[i] + '/views/update_static_res.vpage?type=1&key=AAAAB3NzaC1yc2EAAAADAQABAAABAQCh7/hNLlyS6u6IgF5f');
                    }
                }
                ctx.response.body = "update + ok";
            } else {
                ctx.response.body = "update ok exists";
            }
        } else {
            await errorPage(ctx, next);
        }
    }
}

module.exports = _reader;