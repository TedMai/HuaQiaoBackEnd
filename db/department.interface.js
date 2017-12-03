module.exports =
    {
        fetchDepartmentList: 'SELECT * FROM tb_department',
        fetchSpecificDepartment: 'SELECT * FROM tb_department WHERE did = ?',
        fetchDepartmentGallery: 'SELECT * FROM tb_gallery WHERE type = 1 AND relative = ?',
        fetchRelativeDoctors: 'SELECT a.id, a.name, b.imageurl FROM tb_doctor a left join tb_gallery b ON a.id = b.relative AND b.type = 2 WHERE a.department = ? ORDER BY id',
        addDepartment: 'INSERT INTO tb_department SET ?',
        insertDepartmentGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editDepartment: 'UPDATE tb_department SET ? WHERE did = ?',
        deleteRelativeDoctorsGallery: "DELETE FROM tb_gallery WHERE type = 2 AND relative IN (SELECT id FROM tb_doctor WHERE department = ?)",
        deleteDepartmentGallery: 'DELETE FROM tb_gallery WHERE type = 1 AND relative = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department = ?',
        deleteDepartment: 'DELETE FROM tb_department WHERE did = ?'
    };