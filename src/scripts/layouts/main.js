import $ from 'jquery';

$(() => {
    $(function(){
        var btn = $('.main .box2 .notice-box .area .tit');
        var box = $('.main .box2 .notice-box .area .box');

        btn.click(function(){
            var th = $(this);
            $('.main .box2 .notice-box .area').removeClass('on')
            th.closest('.main .box2 .notice-box .area').addClass('on')

            console.log(1)
        })
    })
});