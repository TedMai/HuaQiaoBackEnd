module.exports =
    {
        fetchHospitalList: 'SELECT * FROM tb_hospital',
        fetchDepartmentList: 'SELECT * FROM tb_department',
        fetchDoctorList: 'SELECT * FROM tb_doctor',
        extractHospitalSelect: 'SELECT hid, name FROM tb_hospital',
        extractDepartmentSelect: 'SELECT did, name FROM tb_department'
    };