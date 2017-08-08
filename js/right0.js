$(function(){
    var selectJson;
    var url = "../json/home.json";
    //select筛选框
    $('.selectFilter').each(function(){
        var temp_html;
        var oneSelect = $(this).find('.oneSelect');
        var twoSelect = $(this).find('.twoSelect');
        var threeSelect = $(this).find('.threeSelect');
        //一级
        var oneFilter = function(){
            $.each(selectJson.provinceIevel,function(i,oneFilter){
                temp_html +='<option value="'+ oneFilter.name +'">'+ oneFilter.name +'</option>';
            });
            oneSelect.html(temp_html);
            twoFilter();
        }

        //二级
        var twoFilter = function(){
            temp_html = '';
            var n = oneSelect.get(0).selectedIndex;
            $.each(selectJson.provinceIevel[n].SalesDepartment,function(i,twoFilter){
                temp_html +='<option value="'+ twoFilter.name  +'">'+ twoFilter.name +'</option>';
            })
            twoSelect.html(temp_html);
            threeFilter();
        }

        //三级
        var threeFilter = function(){
            temp_html = '';
            var n = oneSelect.get(0).selectedIndex;
            var m = twoSelect.get(0).selectedIndex;
            if(typeof(selectJson.provinceIevel[n].SalesDepartment[m].area) == "undefined"){
                threeSelect.css('display','none');
            }else{
                threeSelect.css('display','inline');
                $.each(selectJson.provinceIevel[n].SalesDepartment[m].area,function(i,threeFilter){
                    temp_html +='<option value="'+ threeFilter.name  +'">'+ threeFilter.name +'</option>';
                })
                threeSelect.html(temp_html);
            }
        }
        //选择一级改变二级
        oneSelect.change(function(){
            twoFilter();
        })
        //选择二级改变三级
        twoSelect.change(function(){
            threeFilter();
        })
        //获取json数据
        $.getJSON(url,function(data){
            selectJson = data;
            oneFilter();
        })
    })
    //中国地图
    $.ajax({
        url:'../json/geoJson/area.geo.json',
        async:false,
        success:function(chinaJson){
            echarts.registerMap('china',chinaJson);
        }
    })
    var homeChina = echarts.init(document.getElementById('homeChina'));
    var chinaOption = {
        title : {
            text: '地区分布',
            subtext: '数据纯属虚构',
            left: 'left',
        },
        tooltip: {
            trigger: 'item',
            formatter:'{a}：<br />{b}：{c}（万）',
        },
        visualMap: {
            min: 0,
            max: 50000,
            left: 'left',
            top: 'bottom',
            text: ['高','低'],           // 文本，默认为数值文本
            calculable: true
        },
        series: [
            {
                name: '省级数据',
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:selectJson,
            }
        ]
    };
    homeChina.setOption(chinaOption);

    //层叠柱状图
    var homeBar = echarts.init(document.getElementById('homeBar'));
    var barOption = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['直接访问', '邮件营销']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis:  {
            data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
                name: '邮件营销',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };
    homeBar.setOption(barOption);

    //地图点击事件
    homeChina.on('mapselectchanged',function(param){
        console.log(param);
    })
})
