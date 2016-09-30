$(function () {
    //获取日期内容
    function allFilter(){
        var xsStart =new Date($('#datePicker').val()).getTime() / 1000,
            xsEnd =new Date($('#datePicker2').val()).getTime() / 1000,
            hdStart =new Date($('#datePicker3').val()).getTime() / 1000,
            hdEnd =new Date($('#datePicker4').val()).getTime() / 1000;
        var current = $('.default').attr('href');
        document.getElementById("right").src=''+ current +'?0='+ xsStart +'&1='+ xsEnd +'&2='+ hdStart +'&3='+ hdEnd +'';
        //document.getElementById("right").src='paging/right.html?0='+ xsStart +'&1='+ xsEnd +'&2='+ hdStart +'&3='+ hdEnd +'';
    }
    var topHeight = $('.mainTop').height();
    $('#lanPos').css('top', $('.default').offset().top - topHeight);
    $('.nav > li').hover(function () {
        $('#lanPos').css('top', $(this).offset().top - topHeight);
            /*var $currentDIV = $(this).children('ul');
            $currentDIV.slideDown(200);  //二级菜单显示*/
    }, function () {
        $('#lanPos').css('top', $('.default').offset().top - topHeight);
        var $currentDIV = $(this).children('ul');
        $currentDIV.slideUp(200);
    })
    //一级菜单点击图标
    $('.nav > li').click(function () {
        for (var i = 0; i < $('.nav > li').size(); i++) {
            if (this == $('.nav > li').get(i)) {
                $('.nav > li').eq(i).children('a').addClass('default');
                $('.nav > li').eq(i).children('a').removeClass('left' + i);
                $('.nav > li').eq(i).children('a').addClass('left0' + i);
            } else {
                $('.nav > li').eq(i).children('a').removeClass('default');
                $('.nav > li').eq(i).children('a').removeClass('left0' + i);
                $('.nav > li').eq(i).children('a').addClass('left' + i);
            }
        }
        allFilter();
    });
    /*鼠标经过显示二级菜单*/
    /*$('.nav > li').each(function(){
     $('.nav > li').mouseover(function(){
     var $currentDIV = $(this).children('div');
         $currentDIV.show();
     }).mouseout(function(){
         var $currentDIV = $(this).children('div');
         $currentDIV.hide();
     })
     })*/
    /*二级级菜单点击*/
    /*$('.twoText').on('click', function () {
        if(!$(this).children('span').hasClass('rotationClick')){
            $('.twoText').siblings('li').children('span').removeClass('rotationClick')
            $('.twoText').siblings('li').children('div').slideUp(200);
            $(this).children('span').addClass('rotationClick');
            $(this).children('div').slideDown(200);
        }else{
            if(!$(this).children('div').children('a').hasClass('currentThree')){
                $(this).children('span').removeClass('rotationClick');
                $(this).children('div').slideUp(200);
            }
        }
    })
    /!*三级菜单点击*!/
    $('.navThree > a').on('click',function(){
        $('.navThree >a').removeClass('currentThree')
        $('.navTwo').css('display','none');
        $(this).addClass('currentThree');
        $(this).siblings('a').removeClass('currentThree');
    })*/

    //日期筛选
    $('#datePicker').date_input();
    $('#datePicker2').date_input();
    $('#datePicker3').date_input();
    $('#datePicker4').date_input();

    //清空所有筛选
    $('#dateClear').on('click',function(){
        /*$('.oneSelect > option:first').prop('selected','selected');
        $('.twoSelect > option:first').attr('selected','selected');
        if($('.threeSelect').css('display') !== 'none'){
            $('.threeSelect > option:first').attr('selected','selected');
        }*/
        $('#datePicker').val(" ");
        $('#datePicker2').val(" ");
        $('#datePicker3').val(" ");
        $('#datePicker4').val(" ");
    })

    //提交所有筛选
    $('#dateSubmit').on('click',function(){
        allFilter()
    })
})