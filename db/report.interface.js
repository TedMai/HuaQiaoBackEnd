module.exports = {
    addReport: 'INSERT INTO tb_report SET ?',
    addInspection: 'INSERT INTO tb_inspection SET ?',
    queryReportInRange: 'select c.* from tb_user a, tb_patient_id_card b, tb_report c where a.3rd_session=? and a.wechat = b.openid and b.cardid = c.cardid and c.create_time between ? and date_add(?, interval 1 day)',
    queryRelativeInspection: 'SELECT * FROM tb_inspection WHERE reportid = ?'
};