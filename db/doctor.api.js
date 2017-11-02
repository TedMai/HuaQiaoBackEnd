const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./doctor.interface');

var api = {

    /**
     * 新增 - 医生
     * @param request
     * @param response
     */
    addDoctor: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addDoctor,
                sqlInsertGallery: EXEC_SQL.insertDoctorGallery,
                information: {
                    name: "陈扬俊",
                    title: "副主任医师",
                    position: "内镜中心主任",
                    resume: "大学本科，毕业于福建中医学院，曾于福建医科大学附一医院深造心血管内科，于省立医院进修胃镜操作及诊疗",
                    field: "擅长高血压病、冠心病、心律失常等心血管病及胃镜、胃肠道疾病的诊治",
                    department: 22
                },
                gallery: {
                    imageurl: "20170929/201709290911091537.jpeg",
                    type: 2,
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
     * 编辑 - 医生
     * @param request
     * @param response
     */
    editDoctor: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editDoctor,
                information: [{
                    name: "陈俊",
                    title: "主任医师",
                    position: "中心主任",
                    resume: "本科，毕业于福建中医学院，曾于福建医科大学附一医院深造心血管内科，于省立医院进修胃镜操作及诊疗",
                    field: "擅长高血压病、冠心病、心律失常等心血管病及胃镜、胃肠道疾病",
                    department: 22
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

    deleteDoctor: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlDeleteInfo: EXEC_SQL.deleteDoctor,
                information: [3]
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

    fetchDoctorList: function (response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchDoctorList,
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