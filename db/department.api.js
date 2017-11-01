const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./department.interface');

var api = {

    addDepartment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addDepartment,
                sqlInsertGallery: EXEC_SQL.insertDepartmentGallery,
                information: {
                    name: "外科",
                    description: "莆田华侨医院外科是集普通外科、骨科、神经外科等临床医疗、科研、教学为一体的综合性科室，设有床位27张，每个房间按A类病房标准配置, 有独立卫生间、洗漱设施、热水、空调、电视等设施。现有主任医师2人、副主任医师2人，主治医师3人，主管护师 1 人。科室拥有心电监护仪、微量推注泵、输液泵等先进设备，能开展普通外科、骨科、痔疮等专科疾病的诊治。医院重视科研、教学工作，有多篇论文在省级以上刊物发表，同时还担任医学院校的实习带教工作。",
                    parent: 0,
                    hospital: 3
                },
                gallery: {
                    imageurl: "20170929/201709290911094643.jpeg",
                    type: 1,
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

    editDepartment: function (req, res) {
    },

    deleteDepartment: function (req, res) {

    },

    fetchDepartmentList: function (response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchDepartmentList,
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