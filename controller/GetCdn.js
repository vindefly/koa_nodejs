const cdn_json = {
    dev: 'https://cdn-static-shared.test.17zuoye.net/',
    test: 'https://cdn-static-shared.test.17zuoye.net/',
    staging: 'https://cdn-cnc.staging.17zuoye.net/',
    production: 'https://cdn-cnc.ustalk.com/'
}

const getCdn = {
    get_cdn_url(src) {
        return cdn_json[process.env.NODE_ENV] + (src || "");
    },
    get_static_file(url) {
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return url;
        } else if (url.startsWith('s17/') || url.startsWith('/s17')) {
            return this.get_cdn_url(url);
        } else {
            if (process.env.NODE_ENV == "dev") {
                return "/" + url;
            } else {
                return this.get_cdn_url('s17/xuestatic/static/' + url);
            }
        }
    }
}

module.exports = getCdn;