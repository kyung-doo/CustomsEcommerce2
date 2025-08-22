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

    //리스트    
    $(function(){
        $('.swiper-wrapper.destroy .swiper-slide').click(function(){        
            var tabBtn = $(this).attr('data-btn');
            var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           
            $('#list-slide .swiper-wrapper.destroy .swiper-slide').removeAttr('title')
            $(this).attr('title','선택됨');
            $('#list-slide .swiper-wrapper.destroy .swiper-slide').removeClass('on')
            $(this).addClass('on');
    
            box.removeClass('on');
            $('#'+tabBtn).addClass('on');        
        });
    });    

    //슬라이드
    function slide(slideName,direction,pagination,slidesPerView,spaceBetween,page,next,prev){        
        $('.slide-box').each(function(i){
            var i = i + 1
            var speed = 5000;
            var stopBtn = $(slideName).closest('.slide-box').find('.swiper-stop');
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
                    clickable: true
                },
                
                navigation: {
                    nextEl: next,                    
                    prevEl: prev,
                },    
                on:{
                    init:function() { 
                        $('.slide-box').attr('tabindex','0');                        
                         
                        //공통 슬라이드 focus
                        $(slideName).closest('.slide-box').focus(function(){                
                            stopBtn.addClass('on');
                            stopBtn.text('재생');                    
                            swiper.autoplay.stop();   
                            $(slideName).closest('.swiper-slide').removeClass('on');                
                            swiper.slideTo(0)
                            $(slideName).closest('.slide-box').find('.swiper-button-prev').focusout(function(){
                                $(this).removeClass('on');
                                $(this).text('정지');
                                swiper.autoplay.start();                        
                                swiper.slideTo(0)
                            })
                        });
                        
                        //리스트 슬라이드 focus
                        $(slideName).find('.swiper-slide').focus(function(){                
                            var slideIndex = $(this).attr('data-swiper-slide-index');						
                            var slideLoop = slideIndex++;	                
                            var ariaNum = $(this).attr('aria-label')[4];
                            swiper.slideToLoop(slideLoop,300,true);		                
                            if(ariaNum <= slideIndex){                    
                                $(this).closest('.wrap-slide-box').find('.swiper-slide').attr('tabindex','-1');                    
                            }
                        });
                        
                        //리스트 슬라이드 메뉴
                        $(slideName).closest('.slide-box').find('.swiper-slide').click(function(){
                            var slideIndex = $(this).attr('data-swiper-slide-index');						
                            var slideLoop = slideIndex++;		
                            var tabBtn = $('#list-slide .swiper-slide.swiper-slide-active').attr('data-btn');
                            var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           
                            $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide').removeAttr('title')
                            $(this).attr('title','선택됨');
                            $('#list-slide .swiper-slide').removeClass('on')
                            $(this).addClass('on');
                            box.removeClass('on');
                            $('#'+tabBtn).addClass('on');
                            swiper.slideToLoop(slideLoop,300,true)
                        });
                        
                        //슬라이드 정지
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
                    },       
                    slideNextTransitionStart: function() {
                        var tabBtn = $('#list-slide .swiper-slide.swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           
                        
                        $('.swiper-slide').removeAttr('title');
                        $('.swiper-slide').removeClass('on')
                        $('.swiper-slide.swiper-slide-active').addClass('on')
                        $('.swiper-slide.swiper-slide-active').attr('title','선택됨');
                        box.removeClass('on');
                        $('#'+tabBtn).addClass('on');       
                    },
                    slidePrevTransitionEnd: function() {  
                        var tabBtn = $('#list-slide .swiper-slide.swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                           
                        
                        $('.swiper-slide').removeAttr('title');
                        $('.swiper-slide').removeClass('on')
                        $('.swiper-slide.swiper-slide-active').addClass('on')
                        $('.swiper-slide.swiper-slide-active').attr('title','선택됨');     
                        box.removeClass('on');
                        $('#'+tabBtn).addClass('on');
                    }
                }
            });  

        });
    }    

    //리스트 슬라이드    
    slide('#list-slide','vertical','bullets',4,12,'.pagination1','.next-btn1','.prev-btn1');

    //이미지 슬라이드
    slide('#images-slide','horizontal','fraction',1,0,'.pagination2','.next-btn2','.prev-btn2');
});