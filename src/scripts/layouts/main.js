

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
    /*
    $(function(){
        var btn = $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide');

        btn.click(function(){
            var th = $(this);
            var btnClass = th.attr('data-btn');
            var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           
            
            $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide').removeAttr('title')
            th.attr('title','선택됨')
            
            box.removeClass('on');
            $('#'+btnClass).addClass('on');                 
        });
    })
        */

    

    //슬라이드
    function slide(slideName,direction,pagination,slidesPerView,spaceBetween,page,next,prev){        
        $('.slide-box').each(function(i){
            var i = i + 1
            var speed = 500000000;
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
                onClick: function (swiper, event) {
                    // 클릭된 슬라이드 요소
                    const slide = event.target.closest('.swiper-slide');

                    // 모든 슬라이드에서 swiper-slide-active 클래스 제거
                    swiper.slides.forEach(function(s) {
                        s.classList.remove('swiper-slide-active');
                    });

                    // 클릭된 슬라이드에 swiper-slide-active 클래스 추가
                    slide.classList.add('swiper-slide-active');

                    // 필요하다면 슬라이드 이동 (예: 슬라이드 인덱스 확인 후 이동)
                    // swiper.slideTo(swiper.clickedIndex);
                },
                on:{
                    activeIndexChange:function(){
                       
                    },
                

                    slideNextTransitionStart: function() {
                        var tabBtn = $('#list-slide .swiper-slide.swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           

                        $('#list-slide .swiper-slide').removeClass('on')
                        box.removeClass('on');
                        $('#'+tabBtn).addClass('on')


                        /*
                        var btnData = $('.box1 .swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                        
                        
                        box.removeClass('on');
                        $('#'+btnData).addClass('on');       
                        */
                        
                        
                        console.log()
                        			



                        
                    },

                    slidePrevTransitionEnd: function() {   
                       var tabBtn = $('#list-slide .swiper-slide.swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');           

                        $('#list-slide .swiper-slide').removeClass('on')
                        box.removeClass('on');
                        $('#'+tabBtn).addClass('on')


                        /*
                        var btnData = $('.box1 .swiper-slide-active').attr('data-btn');
                        var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                        
                        
                        box.removeClass('on');
                        $('#'+btnData).addClass('on');       
                        */
                        
                        
                        console.log()
             
                    }
                        
                }
                
            });   

           
            
            
            $('#list-slide .swiper-slide').click(function(){
				var slideIndex = $(this).attr('data-swiper-slide-index');						
				var slideLoop = slideIndex++;				
                $('#list-slide .swiper-slide').removeClass('on')
                $(this).addClass('on')		

				swiper.slideToLoop(slideLoop,300,true)
			});
            
            
            /*
            $('#list-slide .swiper-slide a').click(function(){
                $(this).closest('.swiper-slide').addClass('on');
            })
                */
            
            //리스트 슬라이드 접근성
            /*
            $('#list-slide .swiper-slide a').focusout(function(){
                var index = $(this).closest('.swiper-slide').attr('data-swiper-slide-index');
                var total = $('#list-slide .swiper-slide a').length - 1;   
                $(this).closest('.swiper-slide').addClass('on');

                if(index == total){                    
                    $(this).closest('.wrap-slide-box').find('.swiper-button-prev').focus();
                }
            })
                */

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