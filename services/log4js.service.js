/**
 * npm install log4js
 * 源码及文档地址：https://github.com/nomiddlename/log4js-node
 */
const log4js = require('log4js');

/**
 * 第一种：
 * configure方法为配置log4js对象，内部有levels、appenders、categories三个属性
 * levels:
 *         配置日志的输出级别,共ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF八个级别,default level is OFF
 *         只有大于等于日志配置级别的信息才能输出出来，可以通过category来有效的控制日志输出级别
 * appenders:
 *         配置文件的输出源，一般日志输出type共有console、file、dateFile三种
 *         console:普通的控制台输出
 *         file:输出到文件内，以文件名-文件大小-备份文件个数的形式rolling生成文件
 *         dateFile:输出到文件内，以pattern属性的时间格式，以时间的生成文件
 * replaceConsole:
 *         是否替换控制台输出，当代码出现console.log，表示以日志type=console的形式输出
 *
 */

log4js.configure('./services/log4js.config.json');

/**
 * 第二种
 * appenders:
 *         一个JS对象，key为上面的category，value是一些其他属性值
 * categories：
 *         default表示log4js.getLogger()获取找不到对应的category时，使用default中的日志配置
 *
 */
// log4js.configure({
//     appenders: {
//         ruleConsole: {type: 'console'},
//         ruleFile: {
//             type: 'dateFile',
//             filename: 'logs/server-',
//             pattern: 'yyyy-MM-dd.log',
//             maxLogSize: 10 * 1000 * 1000,
//             numBackups: 3,
//             alwaysIncludePattern: true
//         }
//     },
//     categories: {
//         default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}
//     }
// });

module.exports = {
    getLogger: function (category) {
        return log4js.getLogger(category);
    }
};