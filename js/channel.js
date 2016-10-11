$(function () {
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


            //树形图
            var channelForce = echarts.init(document.getElementById('channelForce'));
            var channelForce_option = {
                title: {
                    text: '渠道收入结构层级图',
                    left:10,
                    top:10
                },
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                },
                series: [
                    {
                        type: 'sankey',
                        layout:'none',
                        data: res.nodes,
                        links: res.links,
                        nodeWidth:50,
                        nodeGap:14,
                        label:{
                            normal:{
                                show:true,
                                formatter:'{b}:{c}（万）'
                                /*formatter :function(params){
                                    var data = res.nodes;
                                    for(var i = 0; i < data.length;i++){
                                        var obj = {};
                                        var name = data[i].name;
                                        var value = data[i].value;
                                        obj.name = name;
                                        obj.value = value
                                        return obj.name + ':' + obj.value;
                                    }
                                },*/
                            },
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                borderColor: '#aaa'
                            }
                        },
                        lineStyle: {
                            normal: {
                                curveness: 0.5
                            }
                        }
                    }
                ]
            };
            channelForce.setOption(channelForce_option);
            //一级饼图
            var channel_onePie = echarts.init(document.getElementById('channel_onePie'));
            var onePie_option = {
                title: {
                    text: '渠道收入结构占比分析',
                    x: 'left',
                    padding: [10, 400, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}万 ({d}%)"
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
                        data:res.structure[0].directDistribution.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            channel_onePie.setOption(onePie_option);
            $('.totalRevenue').html(res.structure[0].totalRevenue / 10000 + '万');

            //二级分销
            var channel_twoTopPie = echarts.init(document.getElementById('channel_twoTopPie'));
            var twoTopPie_option = {
                title: {
                    text: '分销收入及占比',
                    x: 'left',
                    padding: [10, 400, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}万 ({d}%)"
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
                        data:res.structure[0].local_offSite.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            channel_twoTopPie.setOption(twoTopPie_option);
            $('.distribution').html(res.structure[0].distribution / 10000 + '万');

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
                    formatter: "{a} <br/>{b}: {c}万 ({d}%)"
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
                        data:res.structure[0].agent.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            channel_threeTopPie.setOption(threeTopPie_option);

            //二级直销
            var channel_twoBottomPie = echarts.init(document.getElementById('channel_twoBottomPie'));
            var twoBottomPie_option = {
                title: {
                    text: '直销收入及占比',
                    x: 'left',
                    padding: [10, 500, 10, 10],
                    backgroundColor: '#eee',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}万 ({d}%)"
                },
                series: [
                    {
                        name: '川航',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        avoidLabelOverlap: false,
                        center: ['50%', '60%'],
                        startAngle: 120,
                        minAngle:25,
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
                        data:res.structure[0].directChannel.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            channel_twoBottomPie.setOption(twoBottomPie_option);
            $('.direct').html(res.structure[0].direct / 10000 + '万');

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
                    formatter: "{a} <br/>{b}: {c}万 ({d}%)"
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
                        data:res.structure[0].directChannel[0].website.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            channel_threeBottomPie.setOption(threeBottomPie_option);


            //页面接收数据刷新
            function getQryStr(param) {
                var str =parent.document.getElementById("right").src
                var queryArr = str.substr(str.indexOf('?')).slice(1).split('&');
                //var queryArr = window.location.search.slice(1).split("&");
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

            //三级分销点击事件
            channel_threeTopPie.on('click', function (param) {
                var dataIndex = param.dataIndex;
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');

                    if(window.flag == 1) {
                        if (indexOne == '0') {
                            threeTopPie_option.series[0].data = res.structure2[0].agent.map(function(item){
                                var value = item.value / 10000
                                return {name:item.name,value:value}
                            });
                        }else{
                            threeTopPie_option.series[0].data = res.structure[0].agent.map(function(item){
                                var value = item.value / 10000
                                return {name:item.name,value:value}
                            });
                        }
                        window.flag = 0;
                    }else{
                        if(dataIndex == 1){
                            if (indexOne == '0') {
                                window.flag = 1;
                                var data = res.structure2[0].agent[dataIndex].platform
                                travelersBar(dataIndex, data);
                            } else {
                                window.flag = 1;
                                var data = res.structure[0].agent[dataIndex].platform
                                travelersBar(dataIndex, data);
                            }
                        }
                    }
                channel_threeTopPie.setOption(threeTopPie_option);
            })

            //三级分销点击方法
            function travelersBar(index,data){
                if (index == 1) {
                    threeTopPie_option.series[0].data =data.map(function(item){
                        var value = item.value / 10000
                        return {name:item.name,value:value}
                    });
                }else{
                    return;
                }
                channel_threeTopPie.setOption(threeTopPie_option);
            }
            //二级直销点击方法
            function travelersBar2(index,data){
                if (index == 0) {
                    threeBottomPie_option.series[0].data =data.website.map(function(item){
                        var value = item.value / 10000
                        return {name:item.name,value:value}
                    });
                } else if (index == 3) {
                    threeBottomPie_option.series[0].data =data.website.map(function(item){
                        var value = item.value / 10000
                        return {name:item.name,value:value}
                    });
                }else{
                    return;
                }
                channel_threeBottomPie.setOption(threeBottomPie_option);
            }
            //二级直销点击事件
            channel_twoBottomPie.on('click', function (param) {
                var dataIndex = param.dataIndex;
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                if(indexOne == '0'){
                    var data = res.structure2[0].directChannel[dataIndex]
                    travelersBar2(dataIndex,data);
                }else{
                    var data = res.structure[0].directChannel[dataIndex]
                    travelersBar2(dataIndex,data);
                }
            })
            //全局时间筛选数据  点击全局提交的时候会清空分页面的层级筛选内容
            //通用方法给分页面按钮
            function pageDate(){
                /*if (allDate[3] !== undefined) {*/
                    //判断页面是否有局部层级筛选
                    var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                    var indexTwo = $('.twoSelect').find('option:selected').attr('data-index');
                    var indexThree = $('.threeSelect').find('option:selected').attr('data-index');
                    if (indexOne == '0' && indexTwo == '3' && indexThree == '0') { //成都片区
                        //一级饼图
                        $('.totalRevenue').html(res.structure2[0].totalRevenue /10000 + '万');
                        onePie_option.series[0].data = res.structure2[0].directDistribution.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        });
                        //二级分销
                        $('.distribution').html(res.structure2[0].distribution /10000 + '万');
                        twoTopPie_option.series[0].data = res.structure2[0].local_offSite.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        });
                        //三级分销
                        threeTopPie_option.series[0].data = res.structure2[0].agent.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        //二级直销
                        $('.direct').html(res.structure2[0].direct /10000 + '万');
                        twoBottomPie_option.series[0].data = res.structure2[0].directChannel.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        //三级直销
                        threeBottomPie_option.series[0].data = res.structure2[0].directChannel[0].website.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        channel_onePie.setOption(onePie_option);
                        channel_twoTopPie.setOption(twoTopPie_option);
                        channel_threeTopPie.setOption(threeTopPie_option);
                        channel_twoBottomPie.setOption(twoBottomPie_option);
                        channel_threeBottomPie.setOption(threeBottomPie_option);
                    } else{
                        alert('请选择3U、成都片区、成都营业厅再进行查询，谢谢!!!');
                    }
                /*}else{
                    alert('请选择四个时间段再进行查询，谢谢!!!');
                }*/
            }

            /*pageDate()*/


        })
})
