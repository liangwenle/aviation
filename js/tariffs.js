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


            /*//数据排序
            function tariffsBarSOrt(){
                var Ary = [];
                res.tariffsData[0].area.map(function(item){
                    //return item.tariff[0].value / 10000;
                    var data = item.tariff[0].value / 10000;
                    Ary.push(data);
                })
                Ary.sort(function(a,b){
                    return a - b;
                })
            }*/
            //运价层叠柱状图
            var tariffsBar = echarts.init(document.getElementById('tariffsBar'));
            var tariffsBarOption = {
                title : {
                    text: '散/团收入及占比',
                    left:10,
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）'
                },
                legend: {
                    left:'30%',
                    top:13,
                    data:['散客','团队']
                },
                grid: {
                    top:'23%',
                    left: '5%',
                    right: '10%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data : res.tariffsData[0].area.map(function(item){return item.name})
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:'散客',
                        type:'bar',
                        stack: '广告',
                        barGap:'80%',
                        barWidth:'65%',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.tariff[0].value / 10000;
                        })
                    },
                    {
                        name:'团队',
                        type:'bar',
                        stack: '广告',
                        barGap:'80%',
                        barWidth:'65%',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.tariff[1].value / 10000;
                        })
                    }
                ]
            };
            tariffsBar.setOption(tariffsBarOption);

            //运价饼图
            var tariffsPie = echarts.init(document.getElementById('tariffsPie'));
            var tariffsPieOption = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}万 ({d}%)"
                },
                series : [
                    {
                        name: '川航',
                        type: 'pie',
                        radius : '62%',
                        center: ['47%', '62%'],
                        startAngle: 170,
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
                        data:res.tariffsData[0].tariffPie.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            tariffsPie.setOption(tariffsPieOption);

            //张数层叠柱状图
            var tariffsBar2 = echarts.init(document.getElementById('tariffsBar2'));
            var tariffsBar2Option = {
                title : {
                    text: '散/团销售张数及占比',
                    left:10,
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）'
                },
                legend: {
                    left:'35%',
                    top:13,
                    data:['散客','团队']
                },
                grid: {
                    top:'23%',
                    left: '5%',
                    right: '10%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data :res.tariffsData[0].area.map(function(item){return item.name})
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:'散客',
                        type:'bar',
                        stack: '广告',
                        barGap:'80%',
                        barWidth:'65%',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.numberOfSheets[0].value / 10000;
                        })
                    },
                    {
                        name:'团队',
                        type:'bar',
                        stack: '广告',
                        barGap:'80%',
                        barWidth:'65%',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.numberOfSheets[1].value / 10000;
                        })
                    }
                ]
            };
            tariffsBar2.setOption(tariffsBar2Option);

            //张数饼图
            var tariffsPie2 = echarts.init(document.getElementById('tariffsPie2'));
            var tariffsPie2Option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}万 ({d}%)"
                },
                series : [
                    {
                        name: '川航',
                        type: 'pie',
                        radius : '62%',
                        center: ['47%', '62%'],
                        startAngle: 170,
                        labelLine:{
                            normal:{
                                length:8,
                                length2:5,
                            },
                        },
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        data:res.tariffsData[0].numberPie.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            tariffsPie2.setOption(tariffsPie2Option);

            //散客团体气泡图
            var tariffsScatter = echarts.init(document.getElementById('tariffsScatter'));
            var tariffsScatterOption = {
                title: {
                    top:10,
                    left:10,
                    text: '平均票价'
                },
                legend: {
                    top:10,
                    right: 10,
                    data: ['散客', '团体']
                },
                xAxis: [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data :res.tariffsData[0].area.map(function(item){return item.name})
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
                    data:res.tariffsData[0].area.map(function(item){
                        return item.fitGroup[0].value;
                    }),
                    type: 'scatter',
                    symbolSize:26,
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                },
                {
                    name: '团体',
                    data: res.tariffsData[0].area.map(function(item){
                        return item.fitGroup[1].value;
                    }),
                    type: 'scatter',
                    symbolSize:26,
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                }]
            };
            tariffsScatter.setOption(tariffsScatterOption);

            //明折明扣气泡图
            var tariffsScatter2 = echarts.init(document.getElementById('tariffsScatter2'));
            var tariffsScatterOption2 = {
                title: {
                    left:10,
                    top:10,
                    text: '平均票价'
                },
                legend: {
                    top:10,
                    right: 10,
                    data: ['折扣运价','优惠券','正常运价']
                },
                xAxis: [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data :res.tariffsData[0].area.map(function(item){return item.name})
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
                        name: '折扣运价',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.discounted[0].value;
                        }),
                        type: 'scatter',
                        symbolSize:26,
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        },
                    },
                    {
                        name: '优惠券',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.discounted[1].value;
                        }),
                        type: 'scatter',
                        symbolSize:26,
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        }
                    },
                    {
                        name: '正常运价',
                        data:res.tariffsData[0].area.map(function(item){
                            return item.discounted[2].value;
                        }),
                        type: 'scatter',
                        symbolSize:26,
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        }
                    }
                ]
            };
            tariffsScatter2.setOption(tariffsScatterOption2);


            //页面接收数据刷新
            function getQryStr(param) {
                var str =parent.document.getElementById("right").src
                var queryArr = str.substr(str.indexOf('?')).slice(1).split('&');
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
                if(indexData == '-1'){alert('请先选择区域!!!'); return};
                pageDate()
            })

            //柱状图点击方法
            function travelersBar(data){
                tariffsPieOption.series[0].data = data.areatariffPie.map(function(item){
                    var value = item.value / 10000
                    return {name:item.name,value:value}
                });
                tariffsPie.setOption(tariffsPieOption);
            }
            function travelersBar2(data){
                tariffsPie2Option.series[0].data = data.areaNumberPie.map(function(item){
                    var value = item.value / 10000
                    return {name:item.name,value:value}
                });
                tariffsPie2.setOption(tariffsPie2Option);
            }
            //运价柱状图点击事件
            tariffsBar.on('click',function(param){
                var dataIndex = param.dataIndex;
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                if (indexOne == '0') {
                    var data = res.tariffsData2[0].area[dataIndex]
                    travelersBar(data)
                } else {
                    var data = res.tariffsData[0].area[dataIndex]
                    travelersBar(data)
                }
            })
            //张数柱状图点击事件
            tariffsBar2.on('click',function(param){
                var dataIndex = param.dataIndex;
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                if (indexOne == '0') {
                    var data = res.tariffsData2[0].area[dataIndex]
                    travelersBar2(data)
                } else {
                    var data = res.tariffsData[0].area[dataIndex]
                    travelersBar2(data)
                }
            })

            //全局时间筛选数据  点击全局提交的时候会清空分页面的层级筛选内容
            //通用方法给分页面按钮
            function pageDate(){
                if (allDate == undefined){return};
                /*if (allDate[3] !== undefined) {*/
                    //判断页面是否有局部层级筛选
                    var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                    var indexTwo = $('.twoSelect').find('option:selected').attr('data-index');
                    var indexThree = $('.threeSelect').find('option:selected').attr('data-index');
                    if (indexOne == '0' && indexTwo == '3' && indexThree == '0') { //成都片区
                        //运价柱状图
                        tariffsBarOption.grid.bottom = '8%';
                        tariffsBarOption.dataZoom = [
                            {
                                type: 'inside',
                                startValue: 'CTU-PEK',
                                endValue: 'CTU-KMG',
                                filterMode: 'filter'
                            },
                            {
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                realtime: false,
                                height:14,
                                bottom:5,
                                handleStyle: {
                                    color: '#fff',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];
                        tariffsBarOption.xAxis[0].data =res.tariffsData2[0].area.map(function(item){return item.name})
                        tariffsBarOption.series[0].data = res.tariffsData2[0].area.map(function(item){
                            return item.tariff[0].value / 10000;
                        });
                        tariffsBarOption.series[1].data = res.tariffsData2[0].area.map(function(item){
                            return item.tariff[1].value / 10000;
                        })
                        tariffsBar.setOption(tariffsBarOption);

                        //运价饼图
                        tariffsPieOption.series[0].data = res.tariffsData2[0].tariffPie.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        tariffsPie.setOption(tariffsPieOption);

                        //张数柱状图
                        tariffsBar2Option.grid.bottom = '8%';
                        tariffsBar2Option.dataZoom = [
                            {
                                type: 'inside',
                                startValue: 'CTU-PEK',
                                endValue: 'CTU-KMG',
                                filterMode: 'filter'
                            },
                            {
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                realtime: false,
                                height:14,
                                bottom:5,
                                handleStyle: {
                                    color: '#fff',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];
                        tariffsBar2Option.xAxis[0].data =res.tariffsData2[0].area.map(function(item){return item.name})
                        tariffsBar2Option.series[0].data = res.tariffsData2[0].area.map(function(item){
                            return item.numberOfSheets[0].value / 10000;
                        });
                        tariffsBar2Option.series[1].data = res.tariffsData2[0].area.map(function(item){
                            return item.numberOfSheets[1].value / 10000;
                        })
                        tariffsBar2.setOption(tariffsBar2Option);

                        //张数饼图
                        tariffsPie2Option.series[0].data = res.tariffsData2[0].numberPie.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        tariffsPie2.setOption(tariffsPie2Option);

                        //散客团体气泡图
                        tariffsScatterOption.grid.bottom = '8%';
                        tariffsScatterOption.dataZoom = [
                            {
                                type: 'inside',
                                startValue: 'CTU-PEK',
                                endValue: 'CTU-KMG',
                                filterMode: 'filter'
                            },
                            {
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                realtime: false,
                                height:14,
                                bottom:5,
                                handleStyle: {
                                    color: '#fff',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];
                        tariffsScatterOption.xAxis[0].data =res.tariffsData2[0].area.map(function(item){return item.name})
                        tariffsScatterOption.series[0].data = res.tariffsData2[0].area.map(function(item){
                            return item.fitGroup[0].value;
                        });
                        tariffsScatterOption.series[1].data = res.tariffsData2[0].area.map(function(item){
                            return item.fitGroup[1].value;
                        }),
                        tariffsScatter.setOption(tariffsScatterOption);

                        //明折明扣气泡图
                        tariffsScatterOption2.grid.bottom = '8%';
                        tariffsScatterOption2.dataZoom = [
                            {
                                type: 'inside',
                                startValue: 'CTU-PEK',
                                endValue: 'CTU-KMG',
                                filterMode: 'filter'
                            },
                            {
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                realtime: false,
                                height:14,
                                bottom:5,
                                handleStyle: {
                                    color: '#fff',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];
                        tariffsScatterOption2.xAxis[0].data =res.tariffsData2[0].area.map(function(item){return item.name})
                        tariffsScatterOption2.series[0].data = res.tariffsData2[0].area.map(function(item){
                            return item.discounted[0].value;
                        });
                        tariffsScatterOption2.series[1].data = res.tariffsData2[0].area.map(function(item){
                            return item.discounted[1].value;
                        }),
                        tariffsScatterOption2.series[2].data = res.tariffsData2[0].area.map(function(item){
                            return item.discounted[2].value;
                        }),
                        tariffsScatter2.setOption(tariffsScatterOption2);
                    } else{
                        alert('请选择3U、成都片区、成都营业厅再进行查询，谢谢!!!');
                    }
                /*}else{
                    alert('请选择四个时间段再进行查询，谢谢!!!');
                }*/
            }

        })
})
