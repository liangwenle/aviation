$(document).ready(function () {
    $.getJSON('../json/home.json')
        .then(function (res) {
            var provinces = res.provinceIevel;   //地区
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

            //页面初始化
            //KPI
            $('.sales').html(res.allSales / 10000 + '万');
            $('.proxy').html(res.allProxy / 10000 + '万');

            //历史销售分析
            var homeLineXS = echarts.init(document.getElementById('homeLineXS'));
            var lineXSOption = {
                title: {
                    left: 'left',
                    text: '销售收入分析',
                    top:6,
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）'
                },
                legend: {
                    top:10,
                    data:['销售额','代理费'],
                },
                grid: {
                    top: '18%',
                    left: '3%',
                    right: '3%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.allDate.map(function (item) {
                        return item.date
                    })
                },
                yAxis: [
                    {
                        type:'value',
                        name:"万元",
                    },
                    {
                        type: 'value',
                        name:"万元",
                        max: 60,
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        startValue: '2016-8-1',
                        endValue: '2016-8-4',
                        filterMode: 'filter'
                    },
                    {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        realtime: false,
                        height:20,
                        bottom:5,
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                series: [
                    {
                        name: '销售额',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: {
                                color: 'rgb(255, 70, 131)'
                            }
                        },
                        data: res.allDate.map(function (item) {
                            return item.sales / 10000
                        })
                    },
                    {
                        name: '代理费',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        data: res.allDate.map(function (item) {
                            return item.proxy / 10000
                        })
                    }
                ]
            };
            homeLineXS.setOption(lineXSOption);

            //未来销售分析
            var homeLine = echarts.init(document.getElementById('homeLine'));
            var lineOption = {
                title: {
                    left: 'left',
                    text: '承运收入分析',
                    top:6,
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）'
                },
                legend: {
                    top:10,
                    data:['销售额','代理费'],
                },
                grid: {
                    top: '18%',
                    left: '3%',
                    right: '3%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.allDate2.map(function (item) {
                        return item.date
                    })
                },
                yAxis: [
                    {
                        type: 'value',
                        name:'万元'
                    },
                    {
                        type: 'value',
                        name:'万元'
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        startValue: '2016-8-7',
                        endValue: '2016-8-14',
                        filterMode: 'filter'
                    },
                    {
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        realtime: false,
                        height:20,
                        bottom:5,
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                series: [
                    {
                        name: '销售额',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: {
                                color: 'rgb(255, 70, 131)'
                            }
                        },
                        data: res.allDate2.map(function (item) {
                            return item.sales / 10000
                        })
                    },
                    {
                        name: '代理费',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        data: res.allDate2.map(function (item) {
                            return item.proxy / 10000
                        })
                    }
                ]
            };
            homeLine.setOption(lineOption);

            //中国地图
            $.ajax({
                url: '../json/geoJson/area.geo.json',
                async: false,
                success: function (chinaJson) {
                    echarts.registerMap('china', chinaJson);
                }
            })
            var homeChina = echarts.init(document.getElementById('homeChina'));
            var chinaOption = {
                color:['#FF4455','#568EFD'],
                title: {
                    text: '地区分布',
                    top:10,
                    left: 10,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a}：<br />{b}：{c}（万）',
                },
                visualMap: {
                    min: 100,
                    max: 300,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],           // 文本，默认为数值文本
                    calculable: true,
                    color: ['orangered','yellow','lightskyblue' ]
                },
                series: [
                    {
                        name: '销售量',
                        type: 'map',
                        mapType: 'china',
                        selectedMode: 'single',
                        left:120,
                        zoom: 1.2,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:res.provinceIevel.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            homeChina.setOption(chinaOption);

            //柱状图
            var homeBar = echarts.init(document.getElementById('homeBar'));
            var barOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）'
                },
                legend: {
                    data: ['销售额', '代理费'],
                    top:25,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    axisLabel:{
                        interval:0,
                    },
                    data: res.provinceIevel.map(function (item) {
                        return item.name
                    })
                },
                yAxis: [
                    {
                        type: 'value',
                        name:'万元'
                    },
                    {
                        type: 'value',
                        name:'万元',
                        max: 5
                    }
                ],
                series: [
                    {
                        name: '销售额',
                        type: 'bar',
                        yAxisIndex: 0,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: res.provinceIevel.map(function (item) {
                            return item.areaSales / 10000
                        })
                    },
                    {
                        name: '代理费',
                        type: 'line',
                        yAxisIndex: 1,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: res.provinceIevel.map(function (item) {
                            return item.areaProxy / 10000
                        })
                    }
                ]
            };
            homeBar.setOption(barOption);
            echarts.connect([homeChina, homeBar]);

            //地图点击方法
            function homeChinaClick(data) {
                barOption.xAxis.data = data.map(function (item) {
                    return item.name
                });
                barOption.series[0].data = data.map(function (item) {
                    return item.departmentSales / 10000
                });
                barOption.series[1].data = data.map(function (item) {
                    return item.departmentProxy / 10000
                });
                homeBar.setOption(barOption);
                homeChina.group = ' ';   //取消图形联动
            }

            //柱状图点击方法
            function homeBarClick(data) {
                barOption.xAxis.data = data.map(function (item) {
                    return item.name
                })
                barOption.series[0].data = data.map(function (item) {
                    return item.areaSales / 10000
                })
                barOption.series[1].data = data.map(function (item) {
                    return item.areaProxy /10000
                })
                homeBar.setOption(barOption);
                echarts.connect([homeChina, homeBar]);
                window.flag = 0;
            }

            //页面接收数据刷新
            function getQryStr(param) {
                var queryArr = window.location.search.slice(1).split("&");
                var tempArr, item, queryObject = {};

                for (var i = 0; i < queryArr.length; i++) {
                    if (queryArr[0] == "") {
                        return
                    }
                    ;  //判断是否筛选了时间
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
                //判断页面是否有局部层级筛选
                if ($('div').hasClass('selectFilter')) {
                    console.log('111111111111111');
                } else {
                    var receive = allselectDate()
                };
                return receive;
            }

            allDate = getQryStr();
            //时间筛选数据
            function lineXSData() {
                if (allDate == undefined) {return};
                if (allDate[3] !== undefined) {
                    //KPI
                    $('.sales').html(res.selectSales / 10000 + '万');
                    $('.proxy').html(res.selectProxy / 10000 + '万');
                    //历史销售
                    lineXSOption.series[0].data = res.selectDate.map(function (item) {
                        return item.sales / 10000;
                    })
                    lineXSOption.series[1].data = res.selectDate.map(function (item) {
                        return item.proxy / 10000;
                    })
                    homeLineXS.setOption(lineXSOption);
                    //未来销售
                    lineOption.xAxis.data = res.selectDate2.map(function(item){
                        return item.date;
                    })
                    lineOption.series[0].data = res.selectDate2.map(function (item) {
                        return item.sales / 10000;
                    })
                    lineOption.series[1].data = res.selectDate2.map(function (item) {
                        return item.proxy  / 10000;
                    })
                    homeLine.setOption(lineOption);
                    //地图
                    chinaOption.visualMap.max = 3000;
                    chinaOption.series[0].data = res.provinceIevel2.map(function(item){
                        var value = item.value / 10000
                        return {name:item.name,value:value}
                    })
                    homeChina.setOption(chinaOption);
                    //柱状图
                    barOption.series[0].data = res.provinceIevel2.map(function (item) {
                        return item.areaSales / 10000
                    });
                    barOption.yAxis[1].max = 50;
                    barOption.series[1].type = 'bar';
                    barOption.series[1].data = res.provinceIevel2.map(function (item) {
                        return item.areaProxy / 10000
                    })
                    homeBar.setOption(barOption);
                };
            }

            //地图初始化点击事件  层叠柱状图下钻
            homeChina.on('click', function (param) {
                /*if(!window.flag) {*/
                if (allDate == undefined || allDate[3] == undefined) {  //初始化点击
                    window.flag = 1;
                    var dataIndex = param.dataIndex;
                    var data = res.provinceIevel[dataIndex].department;
                    homeChinaClick(data)
                } else {
                    window.flag = 1;
                    var dataIndex = param.dataIndex;
                    var data = res.provinceIevel2[dataIndex].department;
                    homeChinaClick(data)
                }
            })

            //柱状图初始化点击事件返回
            homeBar.on('click', function (param) {
                if (allDate == undefined || allDate[3] == undefined) {  //初始化点击
                    var data = res.provinceIevel
                    homeBarClick(data)
                } else {
                    var data = res.provinceIevel2;
                    homeBarClick(data)
                }
            });

            lineXSData();
        })
})
