var Tools = {};

//用于扩展当前对象
//第一个参数：要扩展的对象，第二个参数：参考的属性
function extend(child, parent) {
    var key;
    for (key in parent) {
        if (parent.hasOwnProperty(key)) {
            child[key] = parent[key];
        }
    }
}
extend(Tools, {
    extend: extend
});

//扩展原型对象
//第一个参数：要扩展的原型对象，第二个参数：参考的属性
function include(child, parent) {
    var key;
    for (key in parent) {
        if (parent.hasOwnProperty(key)) {
            child.prototype[key] = parent[key];
        }
    }
}

//辅助生成 GUID 编号
function guid(format) {
    return format.toLowerCase().replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

//替换所有符合要求的字符串
//第一个参数：需要检查的字符串
//第二个参数：需要替换的字符串
//第三个参数：用于替换的字符串
function replaceAll(target, str1, str2) {
    return target.replace(new RegExp(str1, "gm"), str2);
}

//补位函数
//第一个参数：需要补位的字符串
//第二个参数：用于补位的字符串
//第三个参数：补位后字符串长度
//第四个参数[可选]：补位位置
function strPad(str, padStr, padLength, position) {
    var i = 0;
    var s = "";

    while (i != padLength) {
        s += padStr.toString();
        i++;
    }

    position = position || "l";

    str = position == "l" ? s.concat(str) : str.concat(s);
    return position == "l" ? str.substring(str.length - padLength, str.length) : str.substring(0, padLength);
}

Tools.extend(Tools, {
    include: include,
    guid: guid,
    replaceAll: replaceAll,
    strPad: strPad
});

/*******************************************************************************/
/*  时间处理
/*******************************************************************************/

var formats = {
    s: function (date) {
        return Tools.strPad(date.getSeconds(), "0", 2);
    },

    m: function (date) {
        return Tools.strPad(date.getMinutes(), "0", 2);
    },

    h: function (date) {
        return Tools.strPad(date.getHours(), "0", 2);
    },

    d: function (date) {
        return Tools.strPad(date.getDate(), "0", 2);
    },

    M: function (date) {
        return Tools.strPad(date.getMonth() + 1, "0", 2);
    },

    y: function (date) {
        return Tools.strPad(date.getYear() % 100, "0", 2);
    },

    Y: function (date) {
        return date.getFullYear();
    },

    w: function (date) {
        return date.getDay();
    },

    W: function (date) {
        var _week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return _week[date.getDay()];
    }
};

function _strftime(_format, diff, type, _date_) {
    var _date = _date_ == null ? new Date() : _date_;
    switch (type) {
        case "Y":
        case "y":
            _date.setFullYear(_date.getFullYear() + diff);
            break;
        case "M":
            _date.setMonth(_date.getMonth() + diff);
            break;
        case "D":
        case "d":
            _date.setDate(_date.getDate() + diff);
            break;
        case "H":
        case "h":
            _date.setHours(_date.getHours() + diff);
            break;
        case "m":
            _date.setMinutes(_date.getMinutes() + diff);
            break;
        case "S":
        case "s":
            _date.setSeconds(_date.getSeconds() + diff);
            break;
        case "W":
        case "w":
            _date.setDate(_date.getDate() + diff * 7);
            break;
    }

    return (_format + "").replace(/%([a-zA-Z])/g, function (m, f) {
        var formatter = formats && formats[f];

        switch (typeof formatter) {
            case "function":
                return formatter.call(formats, _date);
            case "string":
                return _strftime(formatter, date);
        }

        return f;
    });
}

function Strftime(date, _format) {
    return _strftime(_format, 0, 'd', new Date(date));
}

//无参数：返回 "%Y-%M-%d" 格式的当前日期时间
//一个参数：指定格式的当前日期时间
//二个参数：
//   第一个参数：返回日期时间格式
//   第二个参数：与当天的所差天数
//三个参数：
//   第一个参数：返回日期时间格式
//   第二个参数：第三个参数指定的单位所差值
//   第三个参数：制定第二个参数的单位 w d h m s
//四个参数：
//   第一个参数：返回日期时间格式
//   第二个参数：第三个参数指定的单位所差值
//   第三个参数：指定第二个参数的单位 w d h m s
//   第四个参数：指定要返回的日期
function DateUtils() {
    switch (arguments.length) {
        case 0:
            return _strftime("%Y-%M-%d", 0, "d", null);
        case 1:
            return _strftime(arguments[0], 0, "d", null);
        case 2:
            return _strftime(arguments[0], arguments[1], "d", null);
        case 3:
            return _strftime(arguments[0], arguments[1], arguments[2], null);
        case 4:
            return _strftime(arguments[0], arguments[1], arguments[2], arguments[3]);
        default:
            return _strftime("%Y-%M-%d");
    }
}

//时间对比函数
//第一个参数：开始时间
//第二个参数：结束时间
//第三个参数：要得到差异的单位
//第四个参数[可选。第三个为timer时]：返回的计时格式
//第五个参数[可选。第四个参数包括日期属性时]：日期格式化长度
function DateDiff(start, end, type, format, dayLength) {
    var startDate = Tools.strPad(start, "0", 20, "r");
    var endDate = Tools.strPad(end, "0", 20, "r");
    var diff = null;

    startDate = new Date(startDate.substring(0, 4), startDate.substring(5, 7), startDate.substring(8, 10), startDate.substring(11, 13), startDate.substring(14, 16), startDate.substring(17, 19));
    endDate = new Date(endDate.substring(0, 4), endDate.substring(5, 7), endDate.substring(8, 10), endDate.substring(11, 13), endDate.substring(14, 16), endDate.substring(17, 19));
    diff = Date.parse(endDate) - Date.parse(startDate);
    format = format || "%d %h:%m:%s";
    dayLength = dayLength || 0;

    switch (type) {
        case "W":
        case "w":
            return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
        case "D":
        case "d":
            return Math.floor(diff / (24 * 60 * 60 * 1000));
        case "H":
        case "h":
            return Math.floor(diff / (60 * 60 * 1000));
        case "m":
            return Math.floor(diff / (60 * 1000));
        case "S":
        case "s":
            return Math.floor(diff / 1000);
        case "timer":
            format = format.replace(/%d/g, dayLength == 0 ? Math.floor(diff / (24 * 60 * 60 * 1000)) : Tools.strPad(Math.floor(diff / (24 * 60 * 60 * 1000)), "0", dayLength));
            format = format.replace(/%h/g, Tools.strPad(Math.floor(diff / (60 * 60 * 1000)) % 24, "0", 2));
            format = format.replace(/%m/g, Tools.strPad(Math.floor(diff / (60 * 1000)) % 60, "0", 2));
            format = format.replace(/%s/g, Tools.strPad(Math.floor(diff / 1000) % 60, "0", 2));
            return format;
        default:
            return null;
    }
}

//yyyy-MM-dd hh:mm:ss格式
function myDate(info) {
    var info = info.split(/:|-|\s/g);
    return new Date(info[0], info[1], info[2], info[3], info[4], info[5]);
}

Tools.extend(Tools, {
    DateUtils: DateUtils,
    DateDiff: DateDiff,
    Date: myDate,
    Strftime: Strftime
});

/*通用消息提示弹窗
 **type为消息类型，'error'：错误，'success'：成功，'info'：普通消息，'warning'：警告
 */
function msgTip(text, type, title) {
    type = type || 'error';
    title = title || null;
    if (typeof toastr !== 'undefined') {
        toastr[type](text, title, {
            positionClass: 'toast-middle-center',
            timeOut: 2000
        });
    }
    else {
        alert(text);
    }
}

function isWechatBrowser() {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
}

function isAndroid() {
    return navigator && navigator.userAgent && navigator.userAgent.toUpperCase().indexOf("ANDROID") != -1;
}

function isParentApp() {
    return navigator && navigator.userAgent && navigator.userAgent.toUpperCase().indexOf("17PARENT") != -1;
}

function isIOS() {
    return navigator && navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

//通用黑底色即时消息提示弹窗
function blackBgTip(text) {
    if (typeof text == 'string') {
        $('#20170710_blackBgTip').html(text).show();
        setTimeout(function () {
            $('#20170710_blackBgTip').hide();
        }, 3000);
    }
}

function isSupportFlash() {
    var hasFlash = 0;     //是否安装了flash
    var flashVersion = 0; //flash版本
    if (document.all) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
            hasFlash = 1;
            VSwf = swf.GetVariable("$version");
            flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return { hasFlash: hasFlash, flashVersion: flashVersion };
}

function playFlash(data) {
    if (typeof data != "object") return;

    var width = data.width;
    var height = data.height;
    var pcPlayerId = data.pcPlayerId;
    var strFlash = '';
    var flashvarStr = '';
    var flashvars = [];
    var playerPath = 'https://cdn-cnc.17zuoye.cn/s17/lib/hlsplayer/StrobeMediaPlayback.swf';
    flashvars.push('src=' + encodeURIComponent(data.flashSrc));
    flashvars.push('autoPlay=' + 'true');
    flashvars.push('plugin_hls=' + 'https://cdn-cnc.17zuoye.cn/s17/lib/hlsplayer/flashlsOSMF.swf');
    flashvarStr = '<param name="flashvars" value="' + flashvars.join('&') + '">';

    if (/MSIE ([^;]+)/.test(window.navigator.userAgent)) {
        strFlash = [
            '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
            'width="' + width + '" height="' + height + '" id="' + pcPlayerId + '" name="' + pcPlayerId + '">',
            '<param name="movie" value="' + playerPath + '">',
            '<param name="wmode" value="direct">',
            '<param name="allowScriptAccess" value="always">',
            '<param name="allowFullScreen" value="true">',
            flashvarStr,
            '</object>'
        ].join('');
    } else {
        strFlash = [
            '<object object type="application/x-shockwave-flash" data="' + playerPath + '"',
            'width="' + width + '" height="' + height + '" id="' + pcPlayerId + '" name="' + pcPlayerId + '">',
            '<param name="wmode" value="direct">',
            '<param name="allowScriptAccess" value="always">',
            '<param name="allowFullScreen" value="true">',
            flashvarStr,
            '</object>'
        ].join('');
    }

    return strFlash;
}

//跳转
function jumpUrl(url) {
    setTimeout(function () {
        window.location.href = url;
    }, 500);
}

function getMappingFunc(appName, type, isTest, modeType) {
    var modeType = modeType || "apps";

    return function (key, _appName) {
        var result = "";

        if (isTest) {
            if (type == "js") {
                return modeType + "/" + (_appName || appName) + "/modules/" + key + ".js";
            } else {
                result = modeType + "/" + (_appName || appName) + "/templates/" + key + ".html";
                if (isBlank(result)) {
                    raindrop(`${key}.${type} missing of ${appName}`);
                    throw `=> ${appName} 的 ${key}.${type} 找不到了。 囧TL`;
                }
                return result.substring(0, result.length - 5);
            }
        } else {
            if (type == "js") {
                return this[modeType + "/" + (_appName || appName) + "/modules/" + key + ".min.js"];
            } else {
                result = this[modeType + "/" + (_appName || appName) + "/templates/" + key + ".html"];
                if (isBlank(result)) {
                    raindrop(`${key}.${type} missing of ${appName}`);
                    throw `=> ${appName} 的 ${key}.${type} 找不到了。 囧TL`;
                }
                return result.substring(0, result.length - 5);
            }
        }
    };
}

//获得地址栏参数
function getQuery(item) {
    var svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
    return svalue ? decodeURIComponent(svalue[1]) : '';
}

function getUserInfo() {
    var key = "17x_s_uid";
    var reg = new RegExp(key + '=' + '([^;]*)' + ';');
    var result = reg.exec(document.cookie);
    return (result && result[1]) || '--';
}

function getCookieValue(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

// 前端监控
function raindrop(msg, print) {
    var xid = getUserInfo();
    var ua = encodeURI((navigator && navigator.userAgent) ? navigator.userAgent : "No browser information");
    var path = location.href.replace(/#/g, "@");
    var url = `//log.17zuoye.cn/log?_c=17xue_fn:raindrop&_l=3&m=${msg}&xid=${xid}&ua=${ua}&path=${path}`;
    if (print || (params && params.test) || false) {
        console.log("");
        console.log(">>> raindrop <<<");
        console.log("xid: ", xid);
        console.log("ua: ", decodeURI(ua));
        console.log("path: ", path);
        console.log("msg: ", msg);
        console.log(">>> /raindrop <<<");
        console.log("");
    }
    $('<img />').attr('src', url).css('display', 'none').appendTo($('body'));
}

window.onerror = function (errMsg, file, line) {
    raindrop(`${errMsg}&file=${file}&line=${line}`, ((params && params.test) || false));
};

//验证是否未定义或null或空字符串
function isBlank(str) {
    return typeof str == 'undefined' || String(str) == 'null';
}

function checkUser() {
    try {
        if (typeof window.external != "undefined" && typeof window.external.getAppIsLogin != "undefined") {
            var cao = window.external.getAppIsLogin();

            if (JSON.parse(cao).type == "type_no_login") return 1;
            if (JSON.parse(cao).type == "type_login_and_no_child") return 2;
            if (JSON.parse(cao).type == "type_login_and_has_child") return 3;
        }
    } catch (err) { }
}

function recordIsLoginLog(currentUser, msg) {
    if ((typeof currentUser != "undefined") && !currentUser) {
        raindrop(msg + ',parentAppS：' + checkUser() + ',yiqixueS：' + JSON.stringify(currentUser) + '&ref=' + document.referrer + '&17xssign=' + getCookieValue('17x_s_sign') + '&rxid=' + getCookieValue('17x_s_uid'));
    }
}

function goLogin(currentUser) {
    try {
        if (typeof window.external != "undefined" && typeof window.external.innerJump != "undefined") {
            window.external.innerJump(JSON.stringify({
                name: "go_login",
                func_model_detail_type: "17xue",
                loginSource: 24
            }));
        } else {
            if (isParentApp()) {
                recordIsLoginLog(currentUser, 'from_fn_goLogin');
            }
            location.href = location.origin + "/m/auth/login.vpage";
        }
    } catch (err) { }
}

function setTitle(title) {
    document.title = title;
    try {
        if (window["external"] && window.external["updateTitle"]) {
            window["external"]["updateTitle"](title);
        }
    } catch (err) { }
}

/*******************************************************************************/
/*   打点
/*******************************************************************************/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function getAppVersion() {
    var native_version = "";

    try {
        if (window["external"] && window.external["getInitParams"]) {
            var $params = window.external.getInitParams();

            if ($params) {
                $params = eval("(" + $params + ")");

                native_version = $params.native_version;
            }
        } else if (getQueryString("app_version")) {
            native_version = getQueryString("app_version") || "";
        }
    } catch (err) { }

    return native_version;
}

function _getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function json2str(o) {
    var arr = [];
    var str = function (s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in o) arr.push('"' + i + '":' + str(o[i]));
    return '{' + arr.join(',') + '}';
}

function log() {
    var arg0 = arguments[0];
    setTimeout(function () {
        var pathName = window.location.pathname;
        var appName = pathName.split("/");
        var $child = {
            "_c": "vox_logs:17_live_student",
            "_l": 3,
            "userId": _getCookie("uid"),
            "xue_userId": _getCookie("17x_s_uid"),
            "app": appName[1] || pathName,
            "module": appName[1] || pathName,
            "op": "Load",
            "userAgent": window.navigator.appVersion,
            "appVersion": getAppVersion(),
            "target": pathName,
            "referrer": document.referrer || "",
            "aid": _getCookie("_aid") || 0 //广告ID来源
        };
        // if (isAndroid()) {
        //     $child._c = "app_17parent_android:normal";
        // }
        // if (isIOS()) {
        //     $child._c = "app_17Parent_ios:normal";
        // }
        if (isWechatBrowser() || isAndroid() || isIOS()) {
            $child._c = "vox_logs:wechat_logs​";
        }
        
        Tools.extend($child, arg0);

        //App logs
        try {
            if (window["external"] && window.external["log_b"]) {
                window.external["log_b"]('App-h5', json2str($child));
                return false;
            }
        } catch (err) { }

        var url = '//log.17zuoye.cn/log?_c=' + $child._c + '&_l=' + $child._l + '&_log=' + encodeURIComponent(json2str($child)) + '&_t=' + new Date().getTime();

        var logImage = document.createElement('img');
        logImage.style.display = "none";
        logImage.src = url;

        document.getElementsByTagName("html")[0].appendChild(logImage);

        if (location.host.indexOf("test") > -1 || location.host.indexOf("staging") > -1 || location.host.indexOf("localhost") > -1) {
            console.info($child);
        }
    }, 200);
}

//  解决浮点数相乘bug，如19.33*100
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { }
    try {
        m += s2.split(".")[1].length;
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

//  解决浮点数相减bug，如0.01-2.22
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

function getSrcFormat(ko) {
    return function (src) {
        var json = ko.utils.unwrapObservable(src);
        var result = "";

        if (json.indexOf("host") != -1 && json.indexOf("path") != -1) {
            json = JSON.parse(json);
            result = (/^\/\//.test(json.host) ? 'https:' + json.host : json.host) + '/' + json.path;
        }

        return result;
    };
}

function calcMonth(timestamp, month, year) {
    var year = year || new Date(timestamp).getFullYear();
    var arr = [];
    var dayLen = new Date(year, month + 1, 0).getDate();
    for (var i = 1; i <= dayLen; i++) {
        arr.push({
            yearStr: year,
            monthStr: month + 1,
            dayStr: i < 10 ? '0' + i : i.toString(),
            date: new Date(year, month, i, 0, 0, 0, 0),
            show: true
        });
    }
    return arr;
}

/**
 * 计算日历数组
 * @param timestamp 当前月时间戳
 * @param month 月(0-11)
 * @param year 年
 * @returns {Array.<T>} 日历数组
 */
function rendCalendar(timestamp, month, year) {
    var month = Tools.isBlank(month) ? new Date(timestamp).getMonth() : month;
    var year = year || new Date(timestamp).getFullYear();
    var total = 42;
    var curMonth = new Date(year, month, 1, 0, 0, 0, 0);

    var arr = calcMonth(timestamp, month, year),
        prevArr = calcMonth(timestamp, month - 1, year),
        nextArr = calcMonth(timestamp, month + 1, year);

    var dayLen = arr.length;

    var prevRestLen = curMonth.getDay(),
        nextRestLen = total - dayLen - prevRestLen;

    var prevRestArr = prevArr.splice(prevArr.length - prevRestLen, prevRestLen);
    var nextRestArr = nextArr.splice(0, nextRestLen);
    prevRestArr.map(function (value) {
        value.show = false;
        value.position = 'prev';
    });
    nextRestArr.map(function (value) {
        value.show = false;
        value.position = 'next';
    });
    var result = (prevRestArr.concat(arr)).concat(nextRestArr);
    if (nextRestLen >= 7) result.splice(result.length - 7, 7);
    return result;
}

/***************
 * 硬件加速处理函数
 ***************/
function hardware(url, context) {
    if (
        context &&
        context.data &&
        context.data.whiteScreenMobileTypes &&
        Object.prototype.toString.call(context.data.whiteScreenMobileTypes) == "[object Array]"
    ) {
        try {
            var option = { url: url };
            var whiteScreenMobileTypes = context.data.whiteScreenMobileTypes;
            var userAgent = navigator["userAgent"] && navigator.userAgent.toUpperCase();
            ko.utils.arrayForEach(whiteScreenMobileTypes, function (obj) {
                if (userAgent.indexOf(obj.code.toUpperCase()) != -1) {
                    option.params = {};
                    option.params["webview_layer_status"] = obj.name == "true" ? "webview_hardware" : "webview_software";
                }
            });
            window.external.openSecondWebview(JSON.stringify(option));
        } catch (err) {
            Tools.raindrop("Hardware Super error");
            window.external.openSecondWebview(JSON.stringify({ url: url }));
        }
    } else {
        window.external.openSecondWebview(JSON.stringify({ url: url }));
    }
}

/*******************************************************************************/
/*  课节报告进出教室计算工具
/*******************************************************************************/
/**
 * 计算占比
 * @param start 开始位置
 * @param end 结束位置
 * @param total 总长度
 * @returns {number} 占总长度百分比，保留两位小数
 */
function calculateWidth(start, end, total) {
    return Math.floor((end - start) / total * 10000) / 100;
}

/**
 * 获取进出时间段对象
 * @param enterTime 进入时间
 * @param leaveTime 离开时间
 * @param width 区间占总长百分比
 * @param css 样式名称
 * @returns {{enterTime: *, leaveTime: *, width: *, css: *}}
 */
function getSlotObj(enterTime, leaveTime, width, css) {
    return {
        enterTime: enterTime,
        leaveTime: leaveTime,
        width: width,
        css: css
    };
}

/***
 * 根据在线时间段不全离线时间段，并返回总占宽度
 * @param result 在线时间段对象集合
 * @param start 数轴开始位置
 * @param end 数轴结束位置
 * @returns {{totalWidth: number, timeSlots: Array}}
 */
function supplyTimeSlots(result, start, end) {
    var total = end - start;
    var len = result.length;
    var timeSlots = [], totalWidth = 0;

    if (len) {
        for (var i = 0; i < len; i++) {
            var item = result[i], enterTime, leaveTime, width;
            totalWidth += item.width;
            if (i == 0) {
                if (item.enterTime == start) {
                    timeSlots.push(item);
                    continue;
                }
                enterTime = start;
            } else {
                enterTime = result[i - 1].leaveTime;
            }
            leaveTime = item.enterTime;
            width = calculateWidth(enterTime, leaveTime, total);
            totalWidth += width;
            timeSlots.push(getSlotObj(enterTime, leaveTime, width, ""));
            timeSlots.push(item);
        }

        var lastEnter = result[len - 1].leaveTime;
        if (lastEnter < end) {
            var width = calculateWidth(lastEnter, end, total);
            totalWidth += width;
            timeSlots.push(getSlotObj(lastEnter, end, width, ""))
        }
    } else {
        totalWidth = 100;
    }

    return {
        totalWidth: totalWidth,
        timeSlots: timeSlots
    }
}

/**
 * 过滤在线时间段记录，返回合法的集合
 * @param timeRecords 所有时间段记录集合
 * @param start 数轴开始位置
 * @param end 数轴结束位置
 * @param min 最小间距（小于此间距的不记录）
 * @returns {Array}
 */
function filterRecords(timeRecords, start, end, min) {
    var result = [];
    if (timeRecords instanceof Array && timeRecords.length) {
        var len = timeRecords.length, total = end - start, index = 0;
        for (var i = 0; i < len; i++) {
            var item = timeRecords[i];
            if (item.enterTime && item.leaveTime) {
                item.enterTime < start && (item.enterTime = start);
                item.leaveTime > end && (item.leaveTime = end);

                // 当前出 - 当前进 >= min 此记录合格
                if (item.leaveTime - item.enterTime >= min) {
                    // 当前进 - 上次出 < min 当前进等于上次合格进
                    if (index && (item.enterTime - timeRecords[index - 1].leaveTime < min)) {
                        item.enterTime = timeRecords[index - 1].enterTime;
                        result.pop();
                    }
                    item.width = calculateWidth(item.enterTime, item.leaveTime, total);
                    if (item.width > 0) {
                        result.push(getSlotObj(item.enterTime, item.leaveTime, item.width, "on"));
                        index = i + 1;
                    }
                }
            }
        }
    }
    return result;
}

export default {
    msgTip: msgTip,
    getMappingFunc: getMappingFunc,
    isBlank: isBlank,
    getQuery: getQuery,
    getCookieValue: getCookieValue,
    raindrop: raindrop,
    blackBgTip: blackBgTip,
    map: { map: { key: "code", value: "name" } },
    isWechatBrowser: isWechatBrowser,
    isAndroid: isAndroid,
    isParentApp: isParentApp,
    isSupportFlash: isSupportFlash,
    playFlash: playFlash,
    jumpUrl: jumpUrl,
    getAppVersion: getAppVersion,
    checkUser: checkUser,
    recordIsLoginLog: recordIsLoginLog,
    goLogin: goLogin,
    setTitle: setTitle,
    log: log,
    accMul: accMul,
    accSub: accSub,
    getSrcFormat: getSrcFormat,
    rendCalendar: rendCalendar,
    hardware: hardware,
    calculateWidth: calculateWidth,
    supplyTimeSlots: supplyTimeSlots,
    filterRecords: filterRecords
}