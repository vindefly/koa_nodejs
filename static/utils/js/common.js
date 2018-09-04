function _vue_modle(obj) {
    obj = obj || {};
    obj.delimiters = ['${', '}$'];
    return new Vue(obj);
}

export {
    _vue_modle
}