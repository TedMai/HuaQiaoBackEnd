module.exports = {
    addPatient: 'INSERT INTO tb_patient SET ?',
    editPatient: 'UPDATE tb_patient SET ? WHERE pid = ?',
    deletePatient: 'DELETE FROM tb_patient WHERE pid = ?',
    querySpecificPatient: 'SELECT * FROM tb_patient WHERE pid = ?',
    fetchRelativePatients: 'SELECT * FROM tb_patient WHERE uid = ?',
    checkIsUserExist: 'SELECT COUNT(*) AS number FROM tb_user WHERE uid = ?',
    batchSetDefault: 'UPDATE tb_patient SET ? WHERE uid = ?'
};