$(function () {
    $.getJSON('../json/home.json')
        .then(function (res) {
            var provinces = res.provinceIevel;
            var allDate  //时间筛选结果
            //三级下拉菜单
            var options = provinces.map(function (item, index) {
                return '<option value="' + item.value + '" data-index="' + index + '">' + item.name + '</option>';
            })

            $('.oneSelect').html('<option data-index="-1">--请选择--</option>' + options);

            $('.oneSelect').on('change', function () {

                var index = $(this).find('option:selected').data('index');

                if (index == -1) {
                    $('.twoSelect').html('<option data-index="-1">--请选择--</option>');
                    return;
                }

                var departments = provinces[index]['department'];

                var option_dep = departments.map(function (item, index) {
                    return '<option value="' + item.value + '" data-index="' + index + '">' + item.name + '</option>';
                })
                $('.twoSelect').html('<option data-index="-1">--请选择--</option>' + option_dep);
            })

            $('.twoSelect').on('change', function () {
                var index = $(this).find('option:selected').data('index');
                var p_index = $('.oneSelect').find('option:selected').data('index');

                if (index == -1) {
                    $('.twoSelect').html('<option data-index="-1">--请选择--</option>');
                    return;
                }

                var area = provinces[p_index]['department'][index]['sub'];
                if (!provinces[p_index]['department'][index]['sub']) {
                    $('.threeSelect').css('display', 'none');
                    return;
                } else {
                    $('.threeSelect').css('display', 'inline-block');
                    var area_dep_option = area.map(function (item, index) {
                        return '<option value="' + item.value + '" data-index="' + index + '">' + item.name + '</option>';
                    })
                    $('.threeSelect').html('<option data-index="-1">--请选择--</option>' + area_dep_option);
                }

            })

            //菜单筛选清空按钮
            $('#dateClear2').on('click', function () {
                $('.oneSelect > option:first').prop('selected', 'selected');
                $('.twoSelect > option:first').attr('selected', 'selected');
                if ($('.threeSelect').css('display') !== 'none') {
                    $('.threeSelect > option:first').attr('selected', 'selected');
                }
            })

            function getQryStr(param) {
                var queryArr = location.search.slice(1).split("&");
                var tempArr, item, queryObject = {};

                for (var i = 0; i < queryArr.length; i++) {
                    item = queryArr[i];
                    if (item.indexOf("=") !== -1) {
                        tempArr = item.split("=");
                        queryObject[tempArr[0]] = tempArr[1];
                    }
                }
                console.log(queryObject);
                return queryObject[param] ? queryObject[param] : "";
            }

            //页面层级筛选提交
            $('#dateSubmit2').on('click', function () {
                getQryStr();
            })

            //一级饼图
            var channel_onePie = echarts.init(document.getElementById('channel_onePie'));
            var onePie_option = {
                title: {
                    text: '渠道结构占比分析',
                    x: 'left',
                    padding: [10, 400, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['35%', '55%'],
                        center: ['50%', '60%'],
                        startAngle: 150,
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        data:res.structure[0].directDistribution
                    }
                ]
            };
            channel_onePie.setOption(onePie_option);
            $('.totalRevenue').html(res.structure[0].totalRevenue + '元');

            //二级分销
            var channel_twoTopPie = echarts.init(document.getElementById('channel_twoTopPie'));
            var twoTopPie_option = {
                title: {
                    text: '分销收入占比',
                    x: 'left',
                    padding: [10, 400, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '60%'],
                        startAngle: 70,
                        label: {
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:res.structure[0].local_offSite
                    }
                ]
            };
            channel_twoTopPie.setOption(twoTopPie_option);
            $('.distribution').html(res.structure[0].distribution + '元');

            //三级分销
            var channel_threeTopPie = echarts.init(document.getElementById('channel_threeTopPie'));
            var threeTopPie_option = {
                title: {
                    text: '',
                    x: 'left',
                    padding: [10, 500, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['45%', '60%'],
                        label: {
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:res.structure[0].agent
                    }
                ]
            };
            channel_threeTopPie.setOption(threeTopPie_option);

            //二级直销
            var channel_twoBottomPie = echarts.init(document.getElementById('channel_twoBottomPie'));
            var twoBottomPie_option = {
                title: {
                    text: '直销收入占比',
                    x: 'left',
                    padding: [10, 500, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        avoidLabelOverlap: false,
                        center: ['50%', '60%'],
                        startAngle: 120,
                        label: {
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:res.structure[0].directChannel
                    }
                ]
            };
            channel_twoBottomPie.setOption(twoBottomPie_option);
            $('.direct').html(res.structure[0].direct + '元');

            //三级直销
            var channel_threeBottomPie = echarts.init(document.getElementById('channel_threeBottomPie'));
            var threeBottomPie_option = {
                title: {
                    text: ' ',
                    x: 'left',
                    padding: [10, 500, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '60%'],
                        startAngle: 100,
                        label: {
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:res.structure[0].directChannel[0].website
                    }
                ]
            };
            channel_threeBottomPie.setOption(threeBottomPie_option);

            //channel_twoBottomPie点击事件
            channel_twoBottomPie.on('click', function (param) {
                var data_index = param.dataIndex;
                if (data_index == 0) {
                    threeBottomPie_option.series[0].data =res.structure[0].directChannel[0].website;
                } else if (data_index == 3) {
                    threeBottomPie_option.series[0].data =res.structure[0].directChannel[3].website;
                }else{
                    return;
                }
                channel_threeBottomPie.setOption(threeBottomPie_option);
            })

            //页面接收数据刷新
            function getQryStr(param) {
                var queryArr = window.location.search.slice(1).split("&");
                var tempArr, item, queryObject = {};

                for (var i = 0; i < queryArr.length; i++) {
                    if (queryArr[0] == "") {
                        return
                    };
                    //判断是否筛选了时间
                    item = queryArr[i];
                    if (item.indexOf("=") !== -1) {
                        tempArr = item.split("=");
                        queryObject[tempArr[0]] = tempArr[1];
                    }
                }
                for (var key in queryObject) {
                    if (queryObject[key] == 'NaN') {  //删除没有选择的时间
                        delete queryObject[key];
                    }
                }
                //全局时间筛选
                function allselectDate() {
                    for (var cut in queryObject) {
                        var cutValue = queryObject[cut];
                        if (cut == '0' || cut == '1') {   //销售时间
                            var allDataXS = res.selectDate;
                            for (var i = 0; i < allDataXS.length; i++) {
                                var objXS = allDataXS[i].date;
                                var xsDate = new Date(objXS).getTime() / 1000;
                                if (cutValue == xsDate) {
                                    if (cut == '0') {
                                        var xsStartRQ = allDataXS[i];
                                    } else {
                                        var xsEndRQ = allDataXS[i];
                                    }
                                    break;
                                }
                            }
                        } else {      //航运时间
                            var allDataHD = res.selectDate2;
                            for (var i = 0; i < allDataHD.length; i++) {
                                var objHD = allDataHD[i].date;
                                var hdDate = new Date(objHD).getTime() / 1000;
                                if (cutValue == hdDate) {
                                    if (cut == '2') {
                                        var hdStartRQ = allDataHD[i];
                                    } else {
                                        var hdEndRQ = allDataHD[i];
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    console.log(xsStartRQ, xsEndRQ, hdStartRQ, hdEndRQ)
                    return [xsStartRQ, xsEndRQ, hdStartRQ, hdEndRQ];
                }
                var receive = allselectDate()
                return receive;
            }
            allDate = getQryStr();
            console.log(allDate);

            //全局时间筛选数据  点击全局提交的时候会清空分页面的层级筛选内容
            //通用方法给分页面按钮

            if (allDate == undefined){return};
            if (allDate[3] !== undefined) {
                function pageDate(){
                    //判断页面是否有局部层级筛选
                    var indexData = $('.oneSelect').find('option:selected').attr('data-index')
                    if (indexData == '3') { //成都片区
                        alert('选择成都片区')
                    } else if(indexData == '-1'){
                        alert('没有成都片区')
                    };
                }
            }

            pageDate()

            //分页面按钮点击提交
            $('#dateSubmit2').on('click',function(){
                var indexData = $('.oneSelect').find('option:selected').attr('data-index')
                if(indexData == '-1'){return};
                pageDate()
            })

        })
})
