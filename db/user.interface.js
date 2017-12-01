module.exports =
    {
        addUser: 'INSERT INTO tb_user SET ?',
        editUser: 'UPDATE tb_user SET ? WHERE openid = ?',
        deleteRelativePatient: 'DELETE FROM tb_patient WHERE openid = ?',
        deleteUser: 'DELETE FROM tb_user WHERE openid = ?'
    };