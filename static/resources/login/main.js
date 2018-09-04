import { logs } from "../../utils/js/voxLogs";
import { _vue_modle } from "../../utils/js/common";

_vue_modle({
    el: '#app_content',
    data: {
        username: '',
        password: '',
        errorInfo: "",
        cleanTime: -1
    },
    created() {
        $.post("/m/indexlist.vpage", {}, function (data) {
            console.log("indexlist", data)
        });

        $.get("/teacherapi/napi/captcha/imgtoken.vpage", {}, function (data) {
            console.log(data)
        });
    },
    methods: {
        submit() {
            if (this.username != 'admin') {
                this.errorContent();
                return;
            }

            if (this.password != 'xue') {
                this.errorContent();
                return;
            }

            $("#LoginForm").submit();
        },
        errorContent(info) {
            clearTimeout(this.cleanTime);
            this.errorInfo = info || '用户名或密码错误';
            this.cleanTime = setTimeout(() => {
                this.errorInfo = "";
            }, 2000);
        }
    }
});