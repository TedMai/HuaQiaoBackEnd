module.exports =
    {
        addPatient: 'INSERT INTO tb_patient SET ?',
        editPatient: 'UPDATE tb_patient SET ? WHERE id = ?',
        deletePatient: 'DELETE FROM tb_patient WHERE id = ?'
    };