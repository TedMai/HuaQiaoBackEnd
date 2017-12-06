module.exports = {
    fetchDoctorList: 'SELECT * FROM tb_doctor',
    querySpecificDoctor: 'SELECT * FROM tb_doctor WHERE id = ?',
    fetchRelativeDoctors: 'SELECT a.*, b.imageurl FROM tb_doctor a left join tb_gallery b ON a.id = b.relative AND b.type = 2 WHERE a.department = ? ORDER BY id',
    fetchDoctorGallery: 'SELECT * FROM tb_gallery WHERE type = 2 AND relative = ?',
    fetchRelativeSchedule: 'SELECT * FROM tb_schedule WHERE doctor = ? AND visiting BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND DATE_ADD(CURDATE(),INTERVAL 30 DAY);',
    addDoctor: 'INSERT INTO tb_doctor SET ?',
    insertDoctorGallery: 'INSERT INTO tb_gallery(imageurl, type, relative) VALUES ?',
    editDoctor: 'UPDATE tb_doctor SET ? WHERE id = ?',
    deleteDoctorGallery: 'DELETE FROM tb_gallery WHERE type = 2 AND relative = ?',
    deleteDoctor: 'DELETE FROM tb_doctor WHERE id = ?'
};