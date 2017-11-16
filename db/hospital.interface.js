module.exports =
    {
        fetchHospitalList: 'SELECT * FROM tb_hospital',
        addHospital: 'INSERT INTO tb_hospital SET ?',
        insertHospitalGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
        editHospital: 'UPDATE tb_hospital SET ? WHERE hid = ?',
        deleteRelativeDoctors: 'DELETE FROM tb_doctor WHERE department in ( SELECT did FROM tb_department WHERE hospital = ? )',
        deleteRelativeDepartments: 'DELETE FROM tb_department WHERE hospital = ?',
        deleteHospital: 'DELETE FROM tb_hospital WHERE hid = ?'
    };