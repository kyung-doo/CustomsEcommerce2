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

    function slide(){
        
    }

    //슬라이드
    $(function(){     
        $('.slide-box').each(function(i){  
                                                             
            //리스트 슬라이드
            var swiper1 = new Swiper('#list-slide', {            
                loop: true,     
                slidesPerView: 4,
                direction: 'vertical', 
                autoHeight : true,
                spaceBetween: 12,  
                freeMode:true,
                autoplay:{
                    delay: 1000,
                    disableOnInteraction: false,
                    reverseDirection: false,
                }, 

                pagination: {
                    el: '.list-slide .swiper-pagination',
                    type: 'bullets',
                },
                
                navigation: {
                    nextEl: '.list-slide .swiper-button-next',
                    prevEl: '.list-slide .swiper-button-prev',
                },
            });

            var sw = 0;    
            $('.list-slide .swiper-stop').click(function(){
                if(sw==0){
                    $(this).addClass('on');
                    $(this).text('재생');
                    swiper1.autoplay.stop();            
                    sw = 1;
                }else{
                    $(this).removeClass('on');
                    $(this).text('정지');
                    swiper1.autoplay.start();
                    sw = 0;
                }
            });


            //이미지 슬라이드
            var swiper2 = new Swiper('#images-slide', {            
                loop: true,     
                slidesPerView: 1,
                direction: 'horizontal',   
                autoplay:{
                    delay: 1000,
                    disableOnInteraction: false,
                    reverseDirection: false,
                }, 

                pagination: {
                    el: '.images-slide .swiper-pagination',
                    type: 'fraction',
                },
                
                navigation: {
                    nextEl: '.images-slide .swiper-button-next',
                    prevEl: '.images-slide .swiper-button-prev',
                },
            });
        
            var sw1 = 0;    
            $('.images-slide .swiper-stop').click(function(){
                if(sw1==0){
                    $(this).addClass('on');
                    $(this).text('재생');
                    swiper2.autoplay.stop();            
                    sw1 = 1;
                }else{
                    $(this).removeClass('on');
                    $(this).text('정지');
                    swiper2.autoplay.start();
                    sw1 = 0;
                }
            }); 
            
        });           
    });

});