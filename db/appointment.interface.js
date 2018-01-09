module.exports =
    {
        addAppointment: 'INSERT INTO tb_appointment SET ?',
        editAppointment: 'UPDATE tb_appointment SET ? WHERE rid = ?',
        deleteAppointment: 'DELETE FROM tb_appointment WHERE rid = ?',
        checkRepeatAppointment: 'SELECT COUNT(*) AS number FROM tb_appointment WHERE schedule = ? AND patient = ?'
    };