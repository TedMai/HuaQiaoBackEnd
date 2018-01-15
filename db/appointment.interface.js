module.exports =
    {
        addAppointment: 'INSERT INTO tb_appointment SET ?',
        editAppointment: 'UPDATE tb_appointment SET ? WHERE rid = ?',
        deleteAppointment: 'DELETE FROM tb_appointment WHERE rid = ?',
        checkRepeatAppointment: 'SELECT COUNT(*) AS number FROM tb_appointment WHERE schedule = ? AND patient = ?',
        fetchSpecificAppointment: 'select a.rid, a.appointment, a.status, b.visiting, b.section, b.registerFee, b.medicalFee, c.name, c.identity, c.phone, d.name as doctorName, e.name as departmentName from tb_appointment a, tb_schedule b, tb_patient c, tb_doctor d, tb_department e where a.rid = ? and a.schedule = b.id and  a.patient = c.pid and b.doctor = d.id and d.department = e.did',
        fetchRelativeAppointments: 'select a.rid, a.appointment, a.status, b.visiting, b.section, c.name as doctorName, d.name as departmentName from tb_appointment a, tb_schedule b, tb_doctor c, tb_department d where a.schedule = b.id and a.patient in (select pid from tb_patient where uid = ?) and b.doctor = c.id and c.department = d.did'
    };