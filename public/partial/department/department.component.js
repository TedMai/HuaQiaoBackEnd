'use strict';

angular
    .module('department')
    .component('department', {
        templateUrl: "partial/department/department.template.html",
        controller: [
            'Table', 'Container',
            function (Table, Container) {
                var that = this,
                    data = Container.get();

                console.info("==>   department.component.js");
                Table.librarian().get(
                    {
                        id: data.did,
                        name: 'department'
                    },
                    {},
                    function (response) {
                        var
                            i,
                            length,
                            count,
                            tmpArray = [];

                        if (response.code === 0) {
                            console.info("==>   department.component.js     ==>  Response:");
                            /**
                             *      基本信息
                             */
                            that.department = JSON.parse(response.msg.department)[0];
                            console.info(that.department);

                            /**
                             *      图集
                             */
                            that.gallery = JSON.parse(response.msg.gallery);
                            console.info(that.gallery);
                            (that.gallery.length > 0) && (that.focusImage = 'file/image/screenshot/' + that.gallery[0].imageurl);

                            /**
                             *      科室医生
                             */
                            that.doctors = [];
                            tmpArray = JSON.parse(response.msg.doctors);
                            console.info(tmpArray);
                            // 去重
                            if (tmpArray.length > 0) {
                                for (i = 0, length = tmpArray.length; i < length; i++) {
                                    count = that.doctors.length;
                                    if (count < 1 || tmpArray[i].id !== that.doctors[count - 1].id) {
                                        that.doctors.push({
                                            id: tmpArray[i].id,
                                            name: tmpArray[i].name,
                                            imageurl: (tmpArray[i].imageurl === null) ? "" : 'file/image/screenshot/' + tmpArray[i].imageurl
                                        });
                                    }
                                }
                                /* end of for */
                            }
                            console.info(that.doctors);
                        }
                    },
                    function (err) {
                        console.error(err);
                    }
                )
            }
        ]
    });