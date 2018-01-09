const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./user.interface');

var api = {

    /******************************************  第三方账户  ******************************************/

    /**
     * 新增 - 微信登录
     * @param request
     * @param response
     */
    addWeChat: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addWeChat,
                sqlRegister: EXEC_SQL.registerWeChat,
                //information: {
                //    openid: 'osCkO0a1sPv2YDNBIAw7wFXlTib4',
                //    nickname: '晕砰',
                //    sex: 0,
                //    headimgurl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epUM6YMGgk050cJfxfal6w039ZDD5787lqW7cpl6whKjDmibAjSnJn54wFOtZ9vyu54a5kh8iaNk6mw/0',
                //    country: '',
                //    province: '',
                //    city: ''
                //},
                //extra: {
                //    wechat: 'osCkO0a1sPv2YDNBIAw7wFXlTib4'
                //}
                information: {
                    openid: request.body.openid,
                    nickname: request.body.nickname,
                    sex: request.body.sex,
                    headimgurl: request.body.headimgurl,
                    country: request.body.country,
                    province: request.body.province,
                    city: request.body.city
                },
                extra: {
                    wechat: request.body.openid
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.register)
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
     * 编辑 - 微信登录
     * @param request
     * @param response
     */
    editWeChat: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editWeChat,
                // information: [request.body.information, request.query.id]
                updateDataSet: [
                    {
                        nickname: request.body.nickname,
                        sex: request.body.sex,
                        headimgurl: request.body.headimgurl,
                        country: request.body.country,
                        province: request.body.province,
                        city: request.body.city
                    },
                    request.body.id
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

    /******************************************  统一账户  ******************************************/

    addUser: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addUser,
                // information: request.body.information,
                information: {
                    phone: request.body.phone,
                    password: request.body.password,
                    wechat: ''
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

    editUser: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editUser,
                // information: [request.body.information, request.query.id]
                updateDataSet: [
                    {
                        phone: request.body.phone,
                        password: request.body.password,
                        wechat: ''
                    },
                    request.body.id
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
     * 删除 - 统一账户
     * @param request
     * @param response
     */
    deleteUser: function (request, response) {

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deleteRelativePatient,
                    EXEC_SQL.deleteRelativeWeChat,
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

    login: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlIsExist: EXEC_SQL.unionLogin,
                queryCondition: [
                    request.body.phone,
                    request.body.password
                ]
            })
            //.then(HANDLER.beginTransaction)
            .then(HANDLER.isExist)
            //.then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    }
};

module.exports = api;