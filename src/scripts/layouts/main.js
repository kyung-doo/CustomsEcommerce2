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
            box.removeClass('on')
            th.closest(box).addClass('on')            
        })
    });    

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
            
            var sw1 = 0;    
            stopBtn.click(function(){                
                if(sw1==0){
                    $(this).addClass('on');
                    $(this).text('재생');                    
                    swiper.autoplay.stop();     
                    sw1 = 1;
                }else{
                    $(this).removeClass('on');
                    $(this).text('정지');
                    swiper.autoplay.start();
                    sw1 = 0;
                }
            }); 
            
        });
    }

    slide('#list-slide','vertical','bullets',4,12,'.pagination1','.next-btn1','.prev-btn1');
    slide('#images-slide','horizontal','fraction',1,0,'.pagination2','.next-btn2','.prev-btn2');
});