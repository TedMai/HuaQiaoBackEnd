module.exports = {
    /**
     * 统一账户
     */
    addUser: 'INSERT INTO tb_user SET ?',
    editUser: 'UPDATE tb_user SET ? WHERE uid = ?',
    deleteRelativePatient: 'DELETE FROM tb_patient WHERE uid = ?',
    deleteRelativeWeChat: 'DELETE FROM tb_user_wechat WHERE openid in (SELECT wechat FROM tb_user WHERE uid = ?)',
    deleteUser: 'DELETE from tb_user WHERE uid = ?',
    /**
     * 微信
     */
    addWeChat: 'INSERT INTO tb_user_wechat SET ?',
    registerWeChat: 'INSERT INTO tb_user SET ?',
    editWeChat: 'UPDATE tb_user_wechat SET ? WHERE openid = ?',
    deleteWeChat: 'DELETE FROM tb_user_wechat WHERE openid = ?',
    /**
     * 登录
     */
    unionLogin: 'SELECT COUNT(*) AS number FROM tb_user WHERE phone = ? and password = ?'
};
