module.exports =
    {
        fetchDepartmentList: 'SELECT * FROM tb_department',
        addDepartment: 'INSERT INTO tb_department SET ?',
        insertDepartmentGallery: 'INSERT INTO tb_gallery SET ?',
        editDepartment: 'UPDATE tb_department SET ? WHERE did = ?',
        deleteDepartment: 'DELETE FROM tb_department WHERE did = ?'
    };