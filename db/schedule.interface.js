module.exports =
    {
        addSchedule: 'INSERT INTO tb_schedule SET ?',
        editSchedule: 'UPDATE tb_schedule SET ? WHERE id = ?',
        deleteSchedule: 'DELETE FROM tb_schedule WHERE id = ?'
    };