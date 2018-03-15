const Q = require('q');
const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./user.interface');
const CREDENTIAL = require('../services/credential.service');

var api = {

    /******************************************  第三方账户  ******************************************/

    /**
     * 微信
     *      --  注册
     * @param request
     * @param response
     */
    registerByWeChat: function (request, response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchSpecificWeChat,
                sqlIsRepeat: EXEC_SQL.isWeChatExist,
                sqlRegister: EXEC_SQL.registerWeChat,
                values: [
                    request.params.openid
                ],
                queryCondition: [
                    request.params.openid
                ],
                extra: {
                    wechat: request.params.openid
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.isRepeat)
            .then(
                HANDLER.register,
                HANDLER.fetchList
            )
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
     * 微信公众号
     *  --  网页授权
     * @param request
     * @returns {*|Promise|promise}
     */
    weChatWebpageLogin: function (request) {
        var deferred = Q.defer();

        HANDLER
            .setUpConnection({
                /**
                 *  1. 根据 openid 查询用户是否存在
                 */
                sqlIsRepeat: EXEC_SQL.isWeChatExist,
                queryCondition: [
                    request.openid
                ],
                /**
                 *  2.1 如果不存在，注册
                 */
                sqlRegister: EXEC_SQL.registerWeChat,
                extra: {
                    wechat: request.openid
                },
                /**
                 *  2.2 如果存在，更新用户表
                 */
                sqlUpdateInfo: EXEC_SQL.updateWeChat,
                updateDataSet: [
                    {
                        "wechat": request.openid,
                        "3rd_session": CREDENTIAL.getNonceStr(32)
                    },
                    request.openid],
                /**
                 *  3. 根据 openid 删除微信用户表 user_info
                 */
                sqlDeleteInfo: EXEC_SQL.deleteWeChat,
                deleteDataSet: request.openid,
                /**
                 *  4. 把 user_info 插入微信用户表
                 */
                sqlBasicInfo: EXEC_SQL.addWeChat,
                information: {
                    openid: request.openid,
                    nickname: request.nickname,
                    sex: request.sex,
                    // language: request.language,
                    city: request.city,
                    province: request.province,
                    country: request.country,
                    headimgurl: request.headimgurl
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.isRepeat)
            .then(
                HANDLER.register,
                HANDLER.updateBasicInfo
            )
            .then(HANDLER.deleteBasicInfo)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                deferred.resolve(request);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, function (err) {
                    deferred.reject(err)
                });
            });

        return deferred.promise;
    },

    /**
     * 微信小程序
     *      --  登录
     * @param request
     * @param response
     */
    weChatLogin: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlFetchUser: EXEC_SQL.fetchSpecificUser,
                sqlDeleteInfo: EXEC_SQL.deleteWeChat,
                sqlBasicInfo: EXEC_SQL.addWeChat,
                deleteDataSet: request.body.uid,
                information: request.body.userInfo
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.fetchWeChatAccount)
            .then(HANDLER.deleteBasicInfo)
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
                updateDataSet: [
                    {
                        phone: request.body.phone
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

    /**
     * 登录
     *      --   统一账户
     * @param request
     * @param response
     */
    login: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlIsExist: EXEC_SQL.unionLogin,
                queryCondition: [
                    request.body.phone,
                    request.body.password
                ]
            })
            .then(HANDLER.isExist)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    querySpecificUser: function (request, response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchSpecificUser,
                values: [request.params.id]
            })
            .then(HANDLER.fetchList)
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