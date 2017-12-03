module.exports =
    {
        fetchHospitalList: 'SELECT * FROM tb_hospital',
        fetchSpecificHospital: 'SELECT * FROM tb_hospital WHERE hid = ?',
        fetchHospitalGallery: 'SELECT * FROM tb_gallery WHERE type = 0 AND relative = ?',
        addHospital: 'INSERT INTO tb_hospital SET ?',
        insertHospitalGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editHospital: 'UPDATE tb_hospital SET ? WHERE hid = ?',
        deleteRelativeDoctorsGallery: 'DELETE FROM tb_gallery WHERE type = 2 AND relative IN (SELECT id FROM tb_doctor WHERE department IN (SELECT did FROM tb_department WHERE hospital = ?))',
        deleteRelativeDepartmentsGallery: 'DELETE FROM tb_gallery WHERE type = 1 AND relative IN (SELECT did FROM tb_department WHERE hospital = ?)',
        deleteHospitalGallery: 'DELETE FROM tb_gallery WHERE type = 0 AND relative = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department IN ( SELECT did FROM tb_department WHERE hospital = ? )',
        deleteRelativeDepartments: 'DELETE FROM tb_department WHERE hospital = ?',
        deleteHospital: 'DELETE FROM tb_hospital WHERE hid = ?'
    };