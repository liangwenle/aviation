$(function() {
    $.getJSON('../json/home.json')
        .then(function (res) {
            var provinces = res.provinceIevel;

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
            $('#dateClear2').on('click',function(){
                $('.oneSelect > option:first').prop('selected','selected');
                 $('.twoSelect > option:first').attr('selected','selected');
                 if($('.threeSelect').css('display') !== 'none'){
                 $('.threeSelect > option:first').attr('selected','selected');
                 }
            })

            function getQryStr(param) {
                var queryArr = location.search.slice(1).split("&");
                var tempArr,item,queryObject = {};

                for (var i = 0 ; i < queryArr.length; i++) {
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
            $('#dateSubmit2').on('click',function(){
                getQryStr();
            })

            //运价层叠柱状图
            var tariffsBar = echarts.init(document.getElementById('tariffsBar'));
            var tariffsBarOption = {
                title : {
                    text: '运价收入',
                    x:'left',
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    left:'20%',
                    top:12,
                    data:['散客','团体']
                },
                grid: {
                    top:'15%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data : ['华东片区','云贵渝片区','北方片区','成都片区','西北片区','中南片区','中原片区']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'散客',
                        type:'bar',
                        stack: '广告',
                        data:[1120, 132, 101, 134, 390, 230, 210]
                    },
                    {
                        name:'团体',
                        type:'bar',
                        stack: '广告',
                        data:[220, 182, 191, 234, 290, 130, 110]
                    }
                ]
            };
            tariffsBar.setOption(tariffsBarOption);

            //运价饼图
            var tariffsPie = echarts.init(document.getElementById('tariffsPie'));
            var tariffsPieOption = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '川航',
                        type: 'pie',
                        radius : '50%',
                        center: ['50%', '43%'],
                        /*itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },*/
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:[
                            {value:335, name:'明折明扣'},
                            {value:310, name:'折上折'},
                            {value:234, name:'其他'},
                            {value:35, name:'L'},
                            {value:48, name:'LA'},
                            {value:48, name:'SA'},
                            {value:48, name:'SAJZ'},
                            {value:48, name:'Y'},
                            {value:48, name:'YCH'},
                        ]
                    }
                ]
            };
            tariffsPie.setOption(tariffsPieOption);

            //销售层叠柱状图
            var tariffsBar2 = echarts.init(document.getElementById('tariffsBar2'));
            var tariffsBar2Option = {
                title : {
                    text: '销售张数',
                    x:'left',
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    left:'20%',
                    top:12,
                    data:['散客','团体']
                },
                grid: {
                    top:'15%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data :['华东片区','云贵渝片区','北方片区','成都片区','西北片区','中南片区','中原片区']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'散客',
                        type:'bar',
                        stack: '广告',
                        data:[1120, 132, 101, 134, 390, 230, 210]
                    },
                    {
                        name:'团体',
                        type:'bar',
                        stack: '广告',
                        data:[220, 182, 191, 234, 290, 130, 110]
                    }
                ]
            };
            tariffsBar2.setOption(tariffsBar2Option);

            //销售饼图
            var tariffsPie2 = echarts.init(document.getElementById('tariffsPie2'));
            var tariffsPie2Option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '川航',
                        type: 'pie',
                        radius : '50%',
                        center: ['50%', '43%'],
                        /*itemStyle:{
                         normal:{
                         label:{
                         formatter:'{b}:{d}%'
                         },
                         },
                         },*/
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        data:[
                            {value:335, name:'明折明扣'},
                            {value:310, name:'折上折'},
                            {value:234, name:'其他'},
                            {value:35, name:'L'},
                            {value:48, name:'LA'},
                            {value:48, name:'SA'},
                            {value:48, name:'SAJZ'},
                            {value:48, name:'Y'},
                            {value:48, name:'YCH'},
                        ]
                    }
                ]
            };
            tariffsPie2.setOption(tariffsPie2Option);

            //气泡图
            var tariffsScatter = echarts.init(document.getElementById('tariffsScatter'));
            var tariffsScatterOption = {
                title: {
                    text: '平均票价'
                },
                legend: {
                    right: 10,
                    data: ['散客', '团体']
                },
                xAxis: [
                    {
                        type : 'category',
                        data : ['航段一','航段二','航段三','航段四','航段五','航段六','航段七']
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ],
                grid: {
                    top:'20%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                series: [{
                    name: '散客',
                    data: [120, 132, 101, 134, 90, 230, 210],
                    type: 'scatter',
                    symbolSize:20,
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(251, 118, 123)'
                            }, {
                                offset: 1,
                                color: 'rgb(204, 46, 72)'
                            }])
                        }
                    }
                },
                {
                    name: '团体',
                    data: [220, 182, 191, 234, 290, 330, 310],
                    type: 'scatter',
                    /*symbolSize: function (data) {
                     return Math.sqrt(data[2]) / 5e2;
                     },*/
                    symbolSize:20,
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(221, 221, 45, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(236,236,138)'
                            }, {
                                offset: 1,
                                color: 'rgb(188,188,30)'
                            }])
                        }
                    }
                }]
            };
            tariffsScatter.setOption(tariffsScatterOption);

            //气泡图
                var tariffsScatter2 = echarts.init(document.getElementById('tariffsScatter2'));
                var tariffsScatterOption2 = {
                    title: {
                        text: '平均票价'
                    },
                    legend: {
                        right: 10,
                        data: ['明折明扣','折上折']
                    },
                    xAxis: [
                        {
                            type : 'category',
                            data : ['航段一','航段二','航段三','航段四','航段五','航段六','航段七']
                        }
                    ],
                    yAxis: [
                        {
                            type : 'value'
                        }
                    ],
                    grid: {
                        top:'20%',
                        left: '3%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    series: [
                        {
                            name: '明折明扣',
                            data: [620, 732, 701, 734, 1090, 1130, 1120],
                            type: 'scatter',
                            /*symbolSize: function (data) {
                             return Math.sqrt(data[2]) / 5e2;
                             },*/
                            symbolSize:20,
                            label: {
                                emphasis: {
                                    show: true,
                                    formatter: function (param) {
                                        return param.data[3];
                                    },
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(25, 100, 150, 0.5)',
                                    shadowOffsetY: 5,
                                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                        offset: 0,
                                        color: 'rgb(129, 227, 238)'
                                    }, {
                                        offset: 1,
                                        color: 'rgb(25, 183, 207)'
                                    }])
                                }
                            }
                        },
                        {
                            name: '折上折',
                            data: [60, 72, 71, 74, 190, 130, 110],
                            type: 'scatter',
                            symbolSize:20,
                            label: {
                                emphasis: {
                                    show: true,
                                    formatter: function (param) {
                                        return param.data[3];
                                    },
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(31,89,208, 0.5)',
                                    shadowOffsetY: 5,
                                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                        offset: 0,
                                        color: 'rgb(164,190,241)'
                                    }, {
                                        offset: 1,
                                        color: 'rgb(23,66,154)'
                                    }])
                                }
                            }
                        }]
                };
                tariffsScatter2.setOption(tariffsScatterOption2);
        })
})
