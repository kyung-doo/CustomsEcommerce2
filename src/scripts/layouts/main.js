import $ from 'jquery';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

$(() => {
    //공지사항
    $(function(){
        var btn = $('.main .box2 .notice-box .area .tit');        

        btn.click(function(){
            var th = $(this);
            var box = $('.main .box2 .notice-box .area');
            box.removeClass('on');
            btn.removeAttr('title');
            th.closest(box).addClass('on');            
            th.attr('title','선택됨');
        })
    });    

    //리스트 슬라이드 tab
    $(function(){
        var btn = $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide a');

        btn.click(function(){
            var th = $(this);
            var btnClass = th.attr('class');
            var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');
            
            box.hide();
            $('.'+btnClass).show();
        })
    })

    //슬라이드
    function slide(slideName,direction,pagination,slidesPerView,spaceBetween,page,next,prev){        
        $('.slide-box').each(function(i){
            var i = i + 1
            var speed = 5000;
            var stopBtn = $(slideName).closest('.slide-box').find('.swiper-stop')
            $(this).find('.swiper-pagination').addClass('pagination'+i)
            $(this).find('.swiper-button-next').addClass('next-btn'+i)
            $(this).find('.swiper-button-prev').addClass('prev-btn'+i)

            var swiper = new Swiper(slideName, {            
                loop: true,     
                slidesPerView: slidesPerView,
                direction: direction, 
                autoHeight : true,
                spaceBetween: spaceBetween,  
                freeMode:true,
                autoplay:{
                    delay: speed,
                    disableOnInteraction: false,                    
                },                 

                pagination: {
                    el: page,
                    type: pagination,
                },
                
                navigation: {
                    nextEl: next,
                    prevEl: prev,
                },
            });
            
            var stopNum = 0;    
            stopBtn.click(function(){                
                if(stopNum==0){
                    $(this).addClass('on');
                    $(this).text('재생');                    
                    swiper.autoplay.stop();     
                    stopNum = 1;
                }else{
                    $(this).removeClass('on');
                    $(this).text('정지');
                    swiper.autoplay.start();
                    stopNum = 0;
                }
            }); 
            
        });
    }

    //리스트 슬라이드
    slide('#list-slide','vertical','bullets',4,12,'.pagination1','.next-btn1','.prev-btn1');

    //이미지 슬라이드
    slide('#images-slide','horizontal','fraction',1,0,'.pagination2','.next-btn2','.prev-btn2');
});