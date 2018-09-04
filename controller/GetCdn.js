const cdn_json = {
    dev: '',
    test: '',
    staging: '',
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
            return "/" + url;
        }
    }
}

module.exports = getCdn;