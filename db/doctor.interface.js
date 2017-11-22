module.exports =
    {
        fetchDoctorList: 'SELECT * FROM tb_doctor',
        fetchDoctorGallery: 'SELECT * FROM tb_gallery WHERE type = 2 AND relative = ?',
        addDoctor: 'INSERT INTO tb_doctor SET ?',
        insertDoctorGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editDoctor: 'UPDATE tb_doctor SET ? WHERE id = ?',
        deleteDoctorGallery: 'DELETE FROM tb_gallery WHERE type = 2 AND relative = ?',
        deleteDoctor: 'DELETE FROM tb_doctor WHERE id = ?'
    };