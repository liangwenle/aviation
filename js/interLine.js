$(function() {
    $.getJSON('../json/home.json')
    .then(function (res) {
            var provinces = res.selectOne;
            var allDate;

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

                var provinceIevel = provinces[index]['provinceIevel'];

                var option_dep = provinceIevel.map(function (item, index) {
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

                var area = provinces[p_index]['provinceIevel'][index]['department'];
                if (!provinces[p_index]['provinceIevel'][index]['department']) {
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

        //一级饼图
        var interLinePie = echarts.init(document.getElementById('interLinePie'));
        var interOption = {
            title : {
                text: '单程联程结构占比分析',
                x:'left',
                padding:[10,200,10,10],
                backgroundColor:'#eee',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name:'川航',
                    type:'pie',
                    radius: ['35%', '55%'],
                    startAngle:180,
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '22',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:[
                        {value:335, name:'单程占比'},
                        {value:310, name:'联程占比'},
                    ]
                }
            ]
        };
        interLinePie.setOption(interOption);

        //饼图点击事件
        interLinePie.on('click',function(param){
            if(!window.flag) {
                window.flag = 1;
                var data_index = param.dataIndex;
                console.log(data_index);
                if (data_index == 1) {
                    interOption.series[0].data = [
                        {value: 335, name: 'LA'},
                        {value: 510, name: 'LC'},
                        {value: 810, name: '其他'},
                    ]
                } else {
                    return;
                }
                interLinePie.setOption(interOption);
            }else{
                interOption.series[0].data = [
                    {value: 335, name: '单程占比'},
                    {value: 310, name: '联程占比'},
                ]
                interLinePie.setOption(interOption);
                window.flag = 0;
            }
        })

        //地图
        $.ajax({
            url:'../json/china.json',
            async:false,
            success:function(chinaJson){
                echarts.registerMap('china',chinaJson);
            }
        })
        var interLineChina = echarts.init(document.getElementById('interLineChina'));
        var geoCoordMap = {
            '丽江': [100.25,26.86],
            '绵阳': [104.73,31.48],
            '成都': [103.9526,30.7617],
            '拉萨': [91.1865,30.1465],
            '昆明': [102.9199,25.4663],
            '杭州': [119.5313,29.8773],
            '西宁': [101.4038,36.8207],
            '西安': [109.1162,34.2004],
            '重庆': [107.7539,30.1904]
        };
        var LSData = res.interLineData[0].interLineChina[0].LSData;
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        };

        var color = ['#a6c84c'];
        var series = [];
        [['拉萨', LSData]].forEach(function (item, i) {
            series.push({
                name: item[0],
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0],
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0],
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 50;
                },
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
        });
        var chinaOption = {
            backgroundColor: '#ccc',
            title : {
                text: '模拟迁徙',
                left: 'right',
                textStyle : {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter:function(obj){
                    var name = obj.name;
                    var value = obj.data.value[2];
                    return name + '：' + value + '（万）'
                }
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                zoom:2,
                left:180,
                bottom:30,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: series
        };
        interLineChina.setOption(chinaOption);

        //柱状图
        var interLineBar = echarts.init(document.getElementById('interLineBar'));
        var interLineBaroption = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['去程', '回程'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'数据量',
                        type:'bar',
                        barWidth: '60%',
                        data:[980, 872]
                    }
                ]
            };
        interLineBar.setOption(interLineBaroption);

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

            //菜单筛选清空按钮
            $('#dateClear2').on('click', function () {
                $('.oneSelect > option:first').prop('selected', 'selected');
                $('.twoSelect > option:first').attr('selected', 'selected');
                if ($('.threeSelect').css('display') !== 'none') {
                    $('.threeSelect > option:first').attr('selected', 'selected');
                }
            })

            //分页面按钮点击提交
            $('#dateSubmit2').on('click',function(){
                var indexData = $('.oneSelect').find('option:selected').attr('data-index')
                if(indexData == '-1'){alert('请先选择区域!!!')};
                pageDate()
            })

        //地图点击事件
        interLineChina.on('click',function(param){
            if(!window.flag) {
                window.flag = 1;
                var dataIndex = param.dataIndex;
                interLineBaroption.xAxis.data = provinces[dataIndex].department.map(function (item) {
                    return item.name
                });
                interLineBaroption.series[0].data = provinces[dataIndex].department.map(function (item) {
                    return item.departmentSales
                });
                interLineBar.setOption(interLineBaroption);
            }else{
                interLineBaroption.xAxis.data = [980, 872]
                interLineBaroption.series[0].data = [980, 872]
                interLineBar.setOption(interLineBaroption);
                window.flag =0;
            }
        })

        //柱状图点击事件返回
        interLineBar.on('click',function(param){
            interLineBaroption.xAxis.data = ['去程','回程']
            interLineBaroption.series[0].data = [980, 872]
            interLineBar.setOption(interLineBaroption);
            window.flag =0;
        });

        //全局时间筛选数据  点击全局提交的时候会清空分页面的层级筛选内容
        //通用方法给分页面按钮
        function pageDate(){
            if (allDate == undefined){return};
            if (allDate[3] !== undefined) {
                //判断页面是否有局部层级筛选
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                var indexTwo = $('.twoSelect').find('option:selected').attr('data-index');
                var indexThree = $('.threeSelect').find('option:selected').attr('data-index');
                if (indexOne == '0') { //成都片区
                    console.log(chinaOption.series[0].data);
                    console.log(chinaOption.series[1].data);
                    console.log(chinaOption.series[2].data);
                } else if(indexThree == '-1'){
                    //默认页面数据
                };
            }
        }

        pageDate()
    })
})
