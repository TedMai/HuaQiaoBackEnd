//  导入MySQL模块
const MYSQL = require('mysql');
const CONFIG = require('./mysql.config');
const CODE = require('./mysql.code');
const HANDLER =  require('./mysql.handler');
const EXEC_SQL = require('./hospital.interface');

var api = {

    // 使用mysql.config.js的配置信息创建一个MySQL连接池
    pool: MYSQL.createPool(CONFIG.mysql),

    addHospital: function (req, callback) {
        // 从连接池获取连接
        this.pool.getConnection(function (err, connection) {
            console.info("hospital.api.js ==> getConnection ==> callback | Error: " + err);

            if (err) {
                // 回调
                callback({
                    code: CODE.databaseErrorCode,
                    msg: err
                });

            } else {    // 建立连接
                var hospital = {
                    name: "莆田华侨医院",
                    description: "莆田华侨医院为涵江区三大医院之一，是一所综合性二级乙等非营利性医院、莆田市医疗保险定点医院、新型农村合作医疗保险定点医院、城镇居民医疗保险定点医院、莆田市“120”、“110”联动单位。医院占地总面积33亩多，位于莆田市涵江区江口镇石庭西路869号(福厦路324国道和高速路涵江出口及荔涵大道交汇处)，毗邻涵江火车站。医院编制床位150张，实际开放床位100张，设有内科、外科、妇产科、儿科、眼科、耳鼻喉科、中医、针灸等临床科室；医院现有职工160多人，其中医护人员106人，医技人员37名。拥有西门子螺旋CT、日本进口电子胃镜、DR数字摄片机、彩超、B超、全自动生化分析仪、全自动血球计数仪、全自动化学发光免疫分析仪和全自动尿沉渣分析仪、金科威电子阴道镜等设备。近年来医院加快推进医疗卫生信息化建设，全线并入莆田市区域信息化建设平台，已建成HIS系统、LIS系统、PACS系统、体检系统等，对慢病管理、居民健康档案管理和区域数字平台已实现自动上传功能。医院除承担常见病多发病的诊治外，还积极开展健康教育，参与社区内康复服务等工作。医院先后被评定为国家二级乙等医院、爱婴医院、福建省道路交通事故伤员救治定点医院。",
                    founding: new Date(1983, 8, 16, 0, 0, 0, 0),
                    address: "莆田市涵江区江口镇石庭869号",
                    contact: "(0594)3795120",
                    axisX: 119.160337,
                    axisY: 25.479413
                };

                connection.query(EXEC_SQL.addHospital, hospital, function (err, result) {
                    var gallery;

                    if (err) {
                        connection.rollback(function () {
                            // 回调
                            callback({
                                code: CODE.databaseErrorCode,
                                msg: err
                            });
                        });
                    } else {
                        gallery = {
                            imageurl: "20170929/201709290911098376.jpeg",
                            type: 0,
                            relative: result.insertId
                        };
                        connection.query(EXEC_SQL.insertHospitalGallery, gallery, function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    // 回调
                                    callback({
                                        code: CODE.databaseErrorCode,
                                        msg: err
                                    });
                                });
                            } else {
                                connection.commit(function (err) {
                                    if(err) {
                                        connection.rollback(function () {
                                            // 回调
                                            callback({
                                                code: CODE.failedCode,
                                                msg: err
                                            });
                                        });
                                    } else {
                                        // 回调
                                        callback({
                                            code: CODE.successCode,
                                            msg: "add new hospital completed."
                                        });
                                    }
                                }); /** end of connection. **/
                            }
                        }); /** end of insertHospitalGallery. **/
                    }
                }); /** end of addHospital. **/
            }
        }); /** end of getConnection. **/
    },

    editHospital: function (req, res) {

    },

    deleteHospital: function (req, res) {

    },

    fetchHospitalDetail: function (req, res) {

    },

    fetchHospitalList: function (callback) {
        console.info("hospital.api.js ==> fetchHospitalList");
        HANDLER.execute(EXEC_SQL.fetchHospitalList, null, callback);
    },

    addDoctor: function (req, res) {

    },

    editDoctor: function (req, res) {

    },

    deleteDoctor: function (req, res) {

    }
};


module.exports = api;
