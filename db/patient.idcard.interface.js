module.exports = {
    bindPatientIDCard: 'INSERT INTO tb_patient_id_card SET ?',
    isPatientIDCardExist: 'SELECT COUNT(*) AS number FROM tb_patient_id_card WHERE openid = ?',
    getPhoneInCard: 'SELECT phone FROM tb_patient_id_card where cardid = ?',
    fetchCardList: 'SELECT * FROM tb_patient_id_card WHERE openid in (SELECT wechat from tb_user WHERE 3rd_session = ?)',
    isBound: 'SELECT COUNT(*) AS number FROM tb_patient_id_card a, tb_user b WHERE b.3rd_session = ? and b.wechat = a.openid and a.cardid = ?',
    getOpenid: 'SELECT wechat FROM tb_user WHERE 3rd_session = ? LIMIT 1',
    removePatientIdCard: 'DELETE FROM tb_patient_id_card WHERE cardid = ?'
};