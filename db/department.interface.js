module.exports =
    {
        fetchDepartmentList: 'SELECT * FROM tb_department',
        fetchDepartmentGallery: 'SELECT * FROM tb_gallery WHERE type = 1 AND relative = ?',
        addDepartment: 'INSERT INTO tb_department SET ?',
        insertDepartmentGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editDepartment: 'UPDATE tb_department SET ? WHERE did = ?',
        deleteRelativeDoctorsGallery: "DELETE FROM tb_gallery WHERE type = 2 AND relative IN (SELECT id FROM tb_doctor WHERE department = ?)",
        deleteDepartmentGallery: 'DELETE FROM tb_gallery WHERE type = 1 AND relative = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department = ?',
        deleteDepartment: 'DELETE FROM tb_department WHERE did = ?'
    };