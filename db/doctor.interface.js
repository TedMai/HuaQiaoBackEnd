module.exports =
    {
        fetchDoctorList: 'SELECT * FROM tb_doctor',
        addDoctor: 'INSERT INTO tb_doctor SET ?',
        insertDoctorGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editDoctor: 'UPDATE tb_doctor SET ? WHERE id = ?',
        deleteDoctor: 'DELETE FROM tb_doctor WHERE id = ?'
    };