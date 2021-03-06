module.exports = {
    /**
     * 统一账户
     */
    addUser: 'INSERT INTO tb_user SET ?',
    editUser: 'UPDATE tb_user SET ? WHERE uid = ?',
    deleteRelativePatient: 'DELETE FROM tb_patient WHERE uid = ?',
    deleteRelativeWeChat: 'DELETE FROM tb_user_wechat WHERE openid in (SELECT wechat FROM tb_user WHERE uid = ?)',
    deleteUser: 'DELETE from tb_user WHERE uid = ?',
    fetchSpecificUser: 'SELECT * FROM tb_user WHERE uid = ?',
    /**
     * 微信
     */
    fetchSpecificWeChat: 'SELECT * FROM tb_user WHERE wechat = ?',
    isWeChatExist: 'SELECT COUNT(*) AS number FROM tb_user WHERE wechat = ?',
    registerWeChat: 'INSERT INTO tb_user SET ?',
    updateWeChat: 'UPDATE tb_user SET ? WHERE wechat = ?',
    addWeChat: 'INSERT INTO tb_user_wechat SET ?',
    editWeChat: 'UPDATE tb_user_wechat SET ? WHERE openid = ?',
    deleteWeChat: 'DELETE FROM tb_user_wechat WHERE openid = ?',
    getUserInfo: 'SELECT nickname, sex, headimgurl FROM tb_user_wechat WHERE openid in (SELECT wechat FROM tb_user WHERE 3rd_session = ?)',
    /**
     * 登录
     */
    unionLogin: 'SELECT uid, COUNT(uid) AS number FROM tb_user WHERE phone = ? and password = ? GROUP BY uid'
};
