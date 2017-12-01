const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./user.interface');

var api = {

    /**
     * 新增 - 平台用户
     * @param request
     * @param response
     */
    addUser: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addUser,
                // information: request.body.information,
                information: {
                    openid: 'osCkO0a1sPv2YDNBIAw7wFXlTib4',
                    nickname: '晕砰',
                    sex: 0,
                    headimgurl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epUM6YMGgk050cJfxfal6w039ZDD5787lqW7cpl6whKjDmibAjSnJn54wFOtZ9vyu54a5kh8iaNk6mw/0',
                    country: '',
                    province: '',
                    city: '',
                    phone: '18159393355',
                    email: 'flowerinhouse@163.com'
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    /**
     * 编辑 - 平台用户
     * @param request
     * @param response
     */
    editUser: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editUser,
                // information: [request.body.information, request.query.id]
                information: [
                    {
                        nickname: '深瓜',
                        sex: 1,
                        headimgurl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epUM6YMGgk050cJfxfal6w039ZDD5787lqW7cpl6whKjDmibAjSnJn54wFOtZ9vyu54a5kh8iaNk6mw/0',
                        country: '美国',
                        province: '德州',
                        city: '电气城',
                        phone: '18760598086',
                        email: '18760598086@139.com'
                    },
                    request.query.id
                ]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 删除 - 平台用户
     * @param request
     * @param response
     */
    deleteUser: function (request, response) {

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deleteRelativePatient,
                    EXEC_SQL.deleteUser
                ],
                information: [request.params.id]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.deleteDataSet)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 获取 - 平台用户
     * @param request
     * @param response
     */
    fetchUser: function (request, response) {


    }
};

module.exports = api;