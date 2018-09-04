var viewModel = {
    btnName: ko.observable("一起学云课堂"),
    router_data: ko.observable(typeof (router_data) !== "undefined" ? router_data : {}),
    logout: function () {
        location.href = "/views/login.vpage";
    },
    openLink: function (_e) {
        var returnData = null;
        $.ajax({
            url: "/m/indexlist.vpage",
            data: {},
            async: false,
            type: "POST",
            dataType: 'json',
            success: function (data) {
                returnData = data;
            }
        });

        //想让a标签不跳转，给a标签的onclick事件返回false
        if (returnData.success) {
            return true;
        } else {
            console.log("超链接被点击，我不想跳转到指定界面");
            return false;
        }
    }
};

ko.applyBindings(viewModel);