module.exports =
    {
        addUser: 'INSERT INTO tb_user SET ?',
        editUser: 'UPDATE tb_user SET ? WHERE id = ?',
        deleteUser: 'DELETE FROM tb_user WHERE id = ?'
    };