import $ from 'jquery';

$(() => {
    //공지사항
    $(function(){
        var btn = $('.main .box2 .notice-box .area .tit');        

        btn.click(function(){
            var th = $(this);
            var box = $('.main .box2 .notice-box .area');
            box.removeClass('on')
            th.closest(box).addClass('on')

            console.log(1)
        })
    })
});