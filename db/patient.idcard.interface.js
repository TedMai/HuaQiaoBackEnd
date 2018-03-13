module.exports = {
    addPatientIDCard:'INSERT INTO tb_patient_id_card SET ?',
    isPatientIDCardExist: 'SELECT COUNT(*) AS number FROM tb_patient_id_card WHERE openid = ?'
};