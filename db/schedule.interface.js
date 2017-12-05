module.exports =
    {
        addSchedule: 'INSERT INTO tb_schedule SET ?',
        editSchedule: 'UPDATE tb_schedule SET ? WHERE id = ?',
        deleteSchedule: 'DELETE FROM tb_schedule WHERE id = ?',
        fetchRelativeSchedule: 'SELECT a.*, b.imageurl FROM tb_doctor a left join tb_gallery b ON a.id = b.relative AND b.type = 2 WHERE a.department = ? ORDER BY id'
    };