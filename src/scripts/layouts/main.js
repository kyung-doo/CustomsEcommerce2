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

    //개인통관고유부호 복사
    $(function(){
        var btn = $('.main .box1 .cont-box .login-box.logout[class*=-chtxt] .txt-box .txt-area a');

        btn.click(function(){
            var html = `
                <p class="copy-txt">개인통관고유부호가 복사되었습니다</p>
            `

            $(this).after(html)

            setTimeout(function(){
              $('.copy-txt').animate({"opacity":"0"},500)
            },500)            
        })
    })
    
    var stopNum = 0;      
    var slideSpeed = 3000;  
    
    //리스트 슬라이드
    const swiper1 = new Swiper('#list-slide', {
        slidesPerView: 'auto',
        spaceBetween: 14,              
        direction: 'vertical',
        autoHeight : true,               
        loop: true,             
        autoplay: {
            delay: slideSpeed,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.slide-area1 .swiper-pagination',
            clickable: false,    
            type: 'bullets',
        },
        navigation: {
            nextEl: '.slide-area1 .swiper-button-next',
            prevEl: '.slide-area1 .swiper-button-prev',
        },
        on: { 
            swiperCreated: function() {
                let offset = 0;
                for (let i = 0; i < swiper1.activeIndex; i++) {
                    offset += swiper1.slides[i].offsetHeight + 14;
                }                  
                swiper1.wrapperEl.style.transform = `translate3d(0px, -${offset}px, 0px)`;
            },                   
            init: function () {
                //이미지슬라이드 개수가 적으면 정지버튼 삭제
                if($('.slide-area1 .swiper-button-next').hasClass('swiper-button-lock')){                    
                    $('.swiper-stop').addClass('swiper-button-lock');                    
                }else{                    
                    $('.swiper-stop').removeClass('swiper-button-lock');                    
                }     

                //슬라이드 load                
                var tabBox = $('.slide-area1 .swiper-slide-active').attr('data-btn');                                

                $('#'+tabBox).addClass('on')
                $('.slide-area1 .swiper-slide-active').addClass('on');  
                $('.slide-area1').attr('tabindex','0');
    
                //리스트 클릭했을때
                $('.slide-area1 .swiper-slide').click(function(){
                    var slideIndex = $(this).attr('data-swiper-slide-index');						
                    var slideLoop = slideIndex++;		
                    var tabBtn = $(this).attr('data-btn');
                    var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                                                      

                    $('.main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide').removeAttr('title')
                    $(this).attr('title','선택됨');

                    $('.slide-area1 .swiper-slide').removeClass('on')
                    $(this).addClass('on');

                    box.removeClass('on');
                    $('#'+tabBtn).addClass('on');
                    
                    swiper1.slideToLoop(slideLoop,0,true);
                });                
                
                //슬라이드 mouseenter
                $('.slide-area1').mouseenter(function(){
                    $('.slide-area1 .swiper-stop').addClass('on');
                    $('.slide-area1 .swiper-stop').text('재생');                    
                    swiper1.autoplay.stop();     
                });

                //슬라이드 mouseleave
                $('.slide-area1').mouseleave(function(){
                    $('.slide-area1 .swiper-stop').removeClass('on');
                    $('.slide-area1 .swiper-stop').text('정지');
                    swiper1.autoplay.start();     
                });

                //슬라이드 focus
                $('.slide-area1').focus(function(){
                    swiper1.slideToLoop(0);
                    $('.slide-area1 .swiper-stop').addClass('on');
                    $('.slide-area1 .swiper-stop').text('재생');                    
                    swiper1.autoplay.stop();                             

                    $('.slide-area1 .swiper-slide').focus(function(){
                        var slideIndex = $(this).attr('data-swiper-slide-index');						
                        var slideLoop = slideIndex++;                                      

                        swiper1.slideToLoop(slideLoop,0,true);                                                                        
                    }); 
                });                

                //슬라이드 focusout
                $('.slide-area1 .swiper-stop').focusout(function(){
                    $('.slide-area1 .swiper-stop').removeClass('on');
                    $('.slide-area1 .swiper-stop').text('정지');
                    swiper1.autoplay.start();     
                });    
            },   
            reachEnd: function() {
                //swiper1.slideTo(0, 500);
            },         
            slideNextTransitionStart: function() {
                var tabBtn = $('.slide-area1 .swiper-slide.swiper-slide-active').attr('data-btn');
                var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                                       
                
                $('.slide-area1 .swiper-slide').removeAttr('title');
                $('.slide-area1 .swiper-slide').removeClass('on')
                $('.slide-area1 .swiper-slide.swiper-slide-active').addClass('on')
                $('.slide-area1 .swiper-slide.swiper-slide-active').attr('title','선택됨');
                box.removeClass('on');
                $('#'+tabBtn).addClass('on');     
                
                let offset = 0;
                for (let i = 0; i < swiper1.activeIndex; i++) {
                    offset += swiper1.slides[i].offsetHeight + 14;
                }                  
                swiper1.wrapperEl.style.transform = `translate3d(0px, -${offset}px, 0px)`;                
            },
            slidePrevTransitionEnd: function() {  
                var tabBtn = $('.slide-area1 .swiper-slide.swiper-slide-active').attr('data-btn');
                var box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');                                          
                
                $('.slide-area1 .swiper-slide').removeAttr('title');
                $('.slide-area1 .swiper-slide').removeClass('on')
                $('.slide-area1 .swiper-slide.swiper-slide-active').addClass('on')
                $('.slide-area1 .swiper-slide.swiper-slide-active').attr('title','선택됨');
                box.removeClass('on');
                $('#'+tabBtn).addClass('on');                                                    
            },
            
        },        
    });   

    $('.slide-area1 .swiper-stop').click(function(){                
        if(stopNum==0){
            $(this).addClass('on');
            $(this).text('재생');                    
            swiper1.autoplay.stop();     
            stopNum = 1;                                                                     
        }else{
            $(this).removeClass('on');
            $(this).text('정지');
            swiper1.autoplay.start();
            stopNum = 0;
        }
    });   

    //이미지슬라이드
    const swiper2 = new Swiper('#images-slide', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
         a11y: true,
        autoplay: {
            delay: slideSpeed,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.slide-area2 .swiper-pagination',
            clickable: true,    
            type: 'fraction',
        },
        navigation: {
            nextEl: '.slide-area2 .swiper-button-next',
            prevEl: '.slide-area2 .swiper-button-prev',
        },
        on: {
            init: function () {
                $('.slide-area2').attr('tabindex','0');                

                //슬라이드 mouseenter
                $('.slide-area2').mouseenter(function(){
                    $('.slide-area2 .swiper-stop').addClass('on');
                    $('.slide-area2 .swiper-stop').text('재생');                    
                    swiper2.autoplay.stop();     
                });

                //슬라이드 mouseleave
                $('.slide-area2').mouseleave(function(){
                    $('.slide-area2 .swiper-stop').removeClass('on');
                    $('.slide-area2 .swiper-stop').text('정지');
                    swiper2.autoplay.start();     
                });

                //슬라이드 focus
                $('.slide-area2').focus(function(){
                    swiper2.slideToLoop(0);
                    $('.slide-area2 .swiper-stop').addClass('on');
                    $('.slide-area2 .swiper-stop').text('재생');                    
                    swiper2.autoplay.stop();                                                                 
                });               

                //슬라이드 focusout
                $('.slide-area2 .swiper-stop').focusout(function(){
                    $('.slide-area2 .swiper-stop').removeClass('on');
                    $('.slide-area2 .swiper-stop').text('정지');
                    swiper2.autoplay.start();     
                });
            },
        }        
    });    
    
    $('.slide-area2 .swiper-stop').click(function(){                
        if(stopNum==0){
            $(this).addClass('on');
            $(this).text('재생');                    
            swiper2.autoplay.stop();     
            stopNum = 1;                                                                     
        }else{
            $(this).removeClass('on');
            $(this).text('정지');
            swiper2.autoplay.start();
            stopNum = 0;
        }
    });    
});