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
            var spaceBar = echarts.init(document.getElementById('spaceBar'));
            var spaceBarOption = {
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
                    top:12,
                    right:10,
                    data:['成人','儿童','婴儿']
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
                        name:'成人',
                        type:'bar',
                        stack: '广告',
                        data:[1120, 132, 101, 134, 390, 230, 210]
                    },
                    {
                        name:'儿童',
                        type:'bar',
                        stack: '广告',
                        data:[220, 182, 191, 234, 290, 130, 110]
                    },
                    {
                        name:'婴儿',
                        type:'bar',
                        stack: '广告',
                        data:[1120, 132, 101, 134, 390, 230, 210]
                    }
                ]
            };
            spaceBar.setOption(spaceBarOption);

            //南丁格尔玫瑰图
            var spacePie = echarts.init(document.getElementById('spacePie'));
            var spacePieOption = {
                title : {
                    text: '销售张数',
                    subtext: '南丁格尔玫瑰图',
                    x:'center',
                    top:10
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'center',
                    bottom : 20,
                    data:['成人','儿童','婴儿']
                },
                calculable : true,
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : [30, 120],
                        center : ['50%', '50%'],
                        roseType : 'area',
                        startAngle: 130,
                        data:[
                            {value:100, name:'成人'},
                            {value:80, name:'儿童'},
                            {value:45, name:'婴儿'}
                        ]
                    }
                ]
            };
            spacePie.setOption(spacePieOption);

        })
})
