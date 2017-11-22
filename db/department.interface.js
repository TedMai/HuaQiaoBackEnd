module.exports =
    {
        fetchDepartmentList: 'SELECT * FROM tb_department',
        fetchDepartmentGallery: 'SELECT * FROM tb_gallery WHERE type = 1 AND relative = ?',
        addDepartment: 'INSERT INTO tb_department SET ?',
        insertDepartmentGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editDepartment: 'UPDATE tb_department SET ? WHERE did = ?',
        deleteDepartmentGallery: 'DELETE FROM tb_gallery WHERE type = 1 AND relative = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department = ?',
        deleteDepartment: 'DELETE FROM tb_department WHERE did = ?'
    };