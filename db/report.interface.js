module.exports = {
    addReport: 'INSERT INTO tb_report SET ?',
    addInspection: 'INSERT INTO tb_inspection SET ?',
    queryReportInRange: 'select c.* from tb_user a, tb_patient_id_card b, tb_report c where a.3rd_session=? and a.wechat = b.openid and b.isDefault = 1 and b.cardid = c.cardid and c.create_time between ? and date_add(?, interval 1 day)',
    queryRelativeInspection: 'SELECT * FROM tb_inspection WHERE reportid = ?',
    // isBindPatientIdCard: 'SELECT COUNT(*) AS number FROM tb_user a, tb_patient_id_card b WHERE a.3rd_session = ? and a.wechat = b.openid and b.isDefault = 1'
    isBindPatientIdCard: 'SELECT COUNT(*) AS number FROM tb_user a, tb_patient_id_card b WHERE a.3rd_session = ? and timestampdiff(HOUR, create_time, current_timestamp) < 3 and a.wechat = b.openid and b.isDefault = 1'
};