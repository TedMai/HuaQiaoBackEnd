module.exports = {
    addSchedule: 'INSERT INTO tb_schedule SET ?',
    editSchedule: 'UPDATE tb_schedule SET ? WHERE id = ?',
    deleteSchedule: 'DELETE FROM tb_schedule WHERE id = ?',
    fetchRelativeSchedule: 'SELECT * FROM tb_schedule WHERE doctor = ? AND visiting BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND DATE_ADD(CURDATE(),INTERVAL 30 DAY);',
    batchAddSchedule: 'INSERT INTO tb_schedule(doctor, visiting, section, registerFee, medicalFee, openNumber) VALUES ?'
};