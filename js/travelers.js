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

            //菜单筛选清空按钮
            $('#dateClear2').on('click',function(){
                $('.oneSelect > option:first').prop('selected','selected');
                 $('.twoSelect > option:first').attr('selected','selected');
                 if($('.threeSelect').css('display') !== 'none'){
                 $('.threeSelect > option:first').attr('selected','selected');
                 }
            })

            //运价层叠柱状图
            var travelerBar = echarts.init(document.getElementById('travelerBar'));
            var travelerBarOption = {
                title : {
                    text: '旅客类型收入',
                    x:'left',
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{b}<br />{a0}: {c0}'+'（万）<br />{a1}: {c1}'+'（万）<br />{a2}: {c2}'+'（万）'
                },
                legend: {
                    top:12,
                    right:10,
                    data:['成人','儿童','婴儿']
                },
                grid: {
                    top:'22%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                        },
                        data :res.travelersData[1].travelers.map(function(item){return item.name})
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'成人',
                        type:'bar',
                        stack: '广告',
                        data:res.travelersData[1].travelers.map(function(item){
                            return item.areaSales[0].value / 10000;
                        })
                    },
                    {
                        name:'儿童',
                        type:'bar',
                        stack: '广告',
                        data:res.travelersData[1].travelers.map(function(item){
                            return item.areaSales[1].value / 10000;
                        })
                    },
                    {
                        name:'婴儿',
                        type:'bar',
                        stack: '广告',
                        data:res.travelersData[1].travelers.map(function(item){
                            return item.areaSales[2].value / 10000;
                        })
                    }
                ]
            };
            travelerBar.setOption(travelerBarOption);

            //南丁格尔玫瑰图
            var travelerPie = echarts.init(document.getElementById('travelerPie'));
            var travelerPieOption = {
                title : {
                    text: '客票张数及占比',
                    x:'center',
                    top:10
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}万 ({d}%)"
                },
                legend: {
                    x : 'center',
                    bottom : 20,
                    data:res.travelersData[0].total.map(function(item){return item.name})
                },
                calculable : true,
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : ['30%','56%'],
                        center : ['50%', '50%'],
                        roseType : 'area',
                        startAngle: 130,
                        itemStyle:{
                            normal:{
                                label:{
                                    formatter:'{b}:{d}%'
                                },
                            },
                        },
                        data:res.travelersData[0].total.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                    }
                ]
            };
            travelerPie.setOption(travelerPieOption);



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
                if(indexData == '-1'){alert('请先选择区域!!!'); return};
                pageDate()
            })

            //柱状图点击方法
            function travelersBar(data){
                travelerPieOption.series[0].data = data.numberOfSheets.map(function(item){
                    var value = item.value / 10000
                    return {name:item.name,value:value}
                });
                travelerPie = echarts.init(document.getElementById('travelerPie'));
                travelerPie.setOption(travelerPieOption);
            }
            //柱状图点击事件
            travelerBar.on('click',function(param){
                var dataIndex = param.dataIndex;
                var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                if (indexOne == '0') {  //初始化点击
                    var data = res.travelersData2[1].travelers[dataIndex]
                    travelersBar(data)
                } else {
                    var data = res.travelersData[1].travelers[dataIndex]
                    travelersBar(data)
                }
            })
            //全局时间筛选数据  点击全局提交的时候会清空分页面的层级筛选内容
            //通用方法给分页面按钮
            function pageDate(){
                if (allDate[3] !== undefined) {
                    //判断页面是否有局部层级筛选
                    var indexOne = $('.oneSelect').find('option:selected').attr('data-index');
                    var indexTwo = $('.twoSelect').find('option:selected').attr('data-index');
                    var indexThree = $('.threeSelect').find('option:selected').attr('data-index');
                    if (indexOne == '0' && indexTwo == '3' && indexThree == '0') { //成都片区
                        //柱状图
                        var spaceBarData = res.travelersData2[1].travelers
                        travelerBarOption.grid.bottom = '6%';
                        travelerBarOption.dataZoom = [
                            {
                                type: 'inside',
                                startValue: 'CTU-PEK',
                                endValue: 'CTU-HGH',
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
                            travelerBarOption.xAxis[0].data = spaceBarData.map(function(item){return item.name})
                        travelerBarOption.series[0].data = spaceBarData.map(function(item){
                            return item.areaSales[0].value / 10000;
                        })
                        travelerBarOption.series[1].data = spaceBarData.map(function(item){
                            return item.areaSales[1].value / 10000;
                        })
                        travelerBarOption.series[2].data = spaceBarData.map(function(item){
                            return item.areaSales[2].value / 10000;
                        })
                        travelerBar.setOption(travelerBarOption);

                        //南丁格尔玫瑰图
                        travelerPieOption.series[0].data = res.travelersData2[0].total.map(function(item){
                            var value = item.value / 10000
                            return {name:item.name,value:value}
                        })
                        travelerPie = echarts.init(document.getElementById('travelerPie'));
                        travelerPie.setOption(travelerPieOption);
                    } else{
                        alert('请选择3U、成都片区、成都营业厅再进行查询，谢谢!!!');
                    };
                }else{
                    alert('请选择四个时间段再进行查询，谢谢!!!');
                }
            }
        })
})
