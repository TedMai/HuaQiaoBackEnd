module.exports =
    {
        fetchDepartmentList: 'SELECT * FROM tb_department',
        addDepartment: 'INSERT INTO tb_department SET ?',
        insertDepartmentGallery: 'INSERT INTO tb_gallery SET ?',
        editDepartment: 'UPDATE tb_department SET ? WHERE did = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department = ?',
        deleteDepartment: 'DELETE FROM tb_department WHERE did = ?'
    };