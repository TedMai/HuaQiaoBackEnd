const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./hospital.interface');

var api = {

    /**
     * 新增 - 医院
     * @param request
     * @param response
     */
    addHospital: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addHospital,
                sqlInsertGallery: EXEC_SQL.insertHospitalGallery,
                information: {
                    name: "莆田华侨医院",
                    description: "莆田华侨医院为涵江区三大医院之一，是一所综合性二级乙等非营利性医院、莆田市医疗保险定点医院、新型农村合作医疗保险定点医院、城镇居民医疗保险定点医院、莆田市“120”、“110”联动单位。医院占地总面积33亩多，位于莆田市涵江区江口镇石庭西路869号(福厦路324国道和高速路涵江出口及荔涵大道交汇处)，毗邻涵江火车站。医院编制床位150张，实际开放床位100张，设有内科、外科、妇产科、儿科、眼科、耳鼻喉科、中医、针灸等临床科室；医院现有职工160多人，其中医护人员106人，医技人员37名。拥有西门子螺旋CT、日本进口电子胃镜、DR数字摄片机、彩超、B超、全自动生化分析仪、全自动血球计数仪、全自动化学发光免疫分析仪和全自动尿沉渣分析仪、金科威电子阴道镜等设备。近年来医院加快推进医疗卫生信息化建设，全线并入莆田市区域信息化建设平台，已建成HIS系统、LIS系统、PACS系统、体检系统等，对慢病管理、居民健康档案管理和区域数字平台已实现自动上传功能。医院除承担常见病多发病的诊治外，还积极开展健康教育，参与社区内康复服务等工作。医院先后被评定为国家二级乙等医院、爱婴医院、福建省道路交通事故伤员救治定点医院。",
                    founding: new Date(1983, 8, 16, 0, 0, 0, 0),
                    address: "莆田市涵江区江口镇石庭869号",
                    contact: "(0594)3795120",
                    axisX: 119.160337,
                    axisY: 25.479413
                },
                gallery: {
                    imageurl: "20170929/201709290911098376.jpeg",
                    type: 0,
                    relative: 0
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.insertGallery)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    /**
     * 编辑 - 医院
     * @param request
     * @param response
     */
    editHospital: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editHospital,
                information: [{
                    name: "华侨医院",
                    description: "涵江区三大医院之一，是一所综合性二级乙等非营利性医院、莆田市医疗保险定点医院、新型农村合作医疗保险定点医院、城镇居民医疗保险定点医院、莆田市“120”、“110”联动单位。医院占地总面积33亩多，位于莆田市涵江区江口镇石庭西路869号(福厦路324国道和高速路涵江出口及荔涵大道交汇处)，毗邻涵江火车站。医院编制床位150张，实际开放床位100张，设有内科、外科、妇产科、儿科、眼科、耳鼻喉科、中医、针灸等临床科室；医院现有职工160多人，其中医护人员106人，医技人员37名。拥有西门子螺旋CT、日本进口电子胃镜、DR数字摄片机、彩超、B超、全自动生化分析仪、全自动血球计数仪、全自动化学发光免疫分析仪和全自动尿沉渣分析仪、金科威电子阴道镜等设备。近年来医院加快推进医疗卫生信息化建设，全线并入莆田市区域信息化建设平台，已建成HIS系统、LIS系统、PACS系统、体检系统等，对慢病管理、居民健康档案管理和区域数字平台已实现自动上传功能。医院除承担常见病多发病的诊治外，还积极开展健康教育，参与社区内康复服务等工作。医院先后被评定为国家二级乙等医院、爱婴医院、福建省道路交通事故伤员救治定点医院。",
                    founding: new Date(1985, 8, 16, 0, 0, 0, 0),
                    address: "涵江区江口镇石庭869号",
                    contact: "0594-3795120",
                    axisX: 119.161337,
                    axisY: 25.479513
                },
                    3]
            })
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 删除 - 医院
     * @param request
     * @param response
     */
    deleteHospital: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlDeleteInfo: EXEC_SQL.deleteHospital,
                information: [4]
            })
            .then(HANDLER.deleteBasicInfo)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    fetchHospitalDetail: function (req, res) {

    },

    /**
     * 获取列表 - 医院
     * @param response
     */
    fetchHospitalList: function (response) {

        HANDLER
            .setUpConnection({
                tableName: 'hospital',
                execSQL: EXEC_SQL.fetchHospitalList,
                values: null
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    }
};

module.exports = api;
