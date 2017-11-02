module.exports =
    {
        fetchHospitalList: 'SELECT * FROM tb_hospital',
        addHospital: 'INSERT INTO tb_hospital SET ?',
        insertHospitalGallery: 'INSERT INTO tb_gallery SET ?',
        editHospital: 'UPDATE tb_hospital SET ? WHERE hid = ?',
        deleteHospital: 'DELETE FROM tb_hospital WHERE hid = ?'
    };