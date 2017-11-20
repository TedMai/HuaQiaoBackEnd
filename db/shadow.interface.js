module.exports =
    {
        // fetchHospitalList: 'SELECT a.*, b.id as pid, b.imageurl FROM tb_hospital a left join tb_gallery b on a.hid = b.relative and b.type = 0',
        // fetchDepartmentList: 'SELECT a.*, b.id as pid, b.imageurl FROM tb_department a left join tb_gallery b on a.did = b.relative and b.type = 1',
        // fetchDoctorList: 'SELECT a.*, b.id as pid, b.imageurl FROM tb_doctor a left join tb_gallery b on a.id = b.relative and b.type = 0',
        fetchHospitalList: 'SELECT * FROM tb_hospital',
        fetchDepartmentList: 'SELECT * FROM tb_department',
        fetchDoctorList: 'SELECT * FROM tb_doctor',
        extractHospitalSelect: 'SELECT hid, name FROM tb_hospital',
        extractDepartmentSelect: 'SELECT did, name FROM tb_department'
    };