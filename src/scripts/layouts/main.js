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

    //상단 리스트
    $(function(){
        var btn = $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide a');

        btn.click(function(){
            var th = $(this);
            var btnClass = th.attr('data-btn');
            var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');
            
            $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide a').removeClass('on')
            th.addClass('on');
            $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide a').removeAttr('title')
            th.attr('title','선택됨')
            
            box.removeClass('on');
            $('#'+btnClass).addClass('on');                 
        });
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
                on:{       
                    slideChange: function () {                       
                        
                        document.querySelectorAll('.swiper-slide').forEach(slide => {
                            slide.style.height = ''; // 초기화
                        });

                        $('#list-slide .swiper-slide a').focus(function(){
                            document.querySelector('.swiper-slide-active a').style.padding = '19px 24px';
                        });
                        
                        $('#list-slide .swiper-slide a').focusout(function(){
                            document.querySelector('.swiper-slide a').style.padding = '9px 16px';
                        });                    
                    },

                    slideNextTransitionStart: function() {
                        var btnData = $('.box1 .swiper-slide-active > a').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');
                        $('.box1 .swiper-slide > a').removeClass('on');
                        $('.box1 .swiper-slide-active > a').addClass('on');
                        
                        box.removeClass('on');
                        $('#'+btnData).addClass('on')
                                              
                    },

                    slidePrevTransitionStart: function() {
                        var btnData = $('.box1 .swiper-slide-active > a').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');
                        $('.box1 .swiper-slide > a').removeClass('on');
                        $('.box1 .swiper-slide-active > a').addClass('on');
                        
                        box.removeClass('on');
                        $('#'+btnData).addClass('on')
                                              
                    }
                        
                }
                
            });        
            
            
            //리스트 슬라이드 접근성
            $('#list-slide .swiper-slide a').focusout(function(){
                var index = $(this).closest('.swiper-slide').attr('data-swiper-slide-index');
                var total = $('#list-slide .swiper-slide a').length - 1;                

                if(index == total){                    
                    $(this).closest('.wrap-slide-box').find('.swiper-button-prev').focus();
                }
            })

            //정지 재생
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