module.exports = {
    addSms: 'INSERT INTO tb_sms SET ?',
    checkSms: 'SELECT COUNT(*) AS number FROM tb_sms WHERE requestId = ? and bizId = ? and phone = ? and verificationCode = ?'
};