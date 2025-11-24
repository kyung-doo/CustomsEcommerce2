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
    
    $(function(){    
        var btn = $('.main .box1 .cont-box .wrap-mobile-list .more button');

        btn.click(function(){
            if($(this).hasClass('open')){
                console.log('열기');
                $(this).closest('.wrap-mobile-list').addClass('active');
                $(this).attr('title','메뉴닫기');
                $(this).attr('aria-label','메뉴닫기');
                $(this).removeClass('open');
                $(this).addClass('close');                
                $(this).text('접기')
            }else{
                console.log('닫기');
                $(this).closest('.wrap-mobile-list').removeClass('active');
                $(this).attr('title','메뉴열기');
                $(this).attr('aria-label','메뉴열기');
                $(this).removeClass('close');
                $(this).addClass('open');                
                $(this).text('더보기')
            }
        })
    })

    //개인통관고유부호 복사
    $(function(){
        var btn = $('.main .box1 .cont-box .login-box.logout[class*=-chtxt] .txt-box .txt-area a');

        btn.click(function(){
            var html = `
                <p class="copy-txt">개인통관고유부호가 복사되었습니다</p>
            `

            $(this).after(html)

            setTimeout(function(){
              $('.copy-txt').remove()
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
            init: function () {
                //반응형
                $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont').each(function(i){
                    var tabId = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont').eq(i).attr('id');                    
                    var dataNum = $('.main .wrap-slide-box .slide-area1 .swiper-slide').eq(i).attr('data-btn');                                        
                    var txt = $(`#${tabId}`).find('button .kr-tit').text();                         
                    var tabClass = $(`#${tabId}`).attr('class').split(/\s+/);
                    var target = tabClass.find(cls => cls.startsWith('illust-people')); 
                    var txt1 = $('.main .box1 .cont-box .wrap-slide-box .slide-box a [class*=-txt]').eq(i).text();                  

                    if(tabId === dataNum){                        
                        $('.main .box1 .cont-box .wrap-slide-box .slide-box a').eq(i).addClass(target)
                        $('.main .box1 .cont-box .wrap-mobile-list ul li a').eq(i).addClass(target)                        

                        function responsiveCheck() {
                            let winWidth = $(window).width();

                            if (winWidth <= 1120) {
                                var link = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont .btn').eq(i).attr('onclick');                                
                                $('.main .box1 .cont-box .wrap-slide-box .slide-box a [class*=-txt]').eq(i).text(txt);
                                $('.main .box1 .cont-box .wrap-mobile-list ul li a').eq(i).text(txt)
                                $(`#${tabId}`).find('button .kr-tit').text(txt1);                                   
                                $('.main .box1 .cont-box .wrap-slide-box .slide-box a').eq(i).attr('onclick',link)                                        
                                $('.main .box1 .mobile-list a').eq(i).attr('onclick',link)
                                //console.log('1120 보다 작음')
                            }else{
                                $(`#${tabId}`).find('button .kr-tit').text(txt);
                                $('.main .box1 .cont-box .wrap-slide-box .slide-box a [class*=-txt]').eq(i).text(txt1);
                                $('.main .box1 .cont-box .wrap-slide-box .slide-box a').removeAttr('onclick')
                                //console.log('1120 보다 큼')                                
                            }
                        }
                        // 처음 로드 시 실행
                        $(document).ready(responsiveCheck);
                        

                        // 창 크기 변경 시마다 실행
                        $(window).resize(responsiveCheck);
                    }
                });

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
                
                const slides = swiper1.slides;
                const positions = [0]; // 첫 슬라이드 위치

                for (let i = 1; i < slides.length; i++) {
                    const prevSlide = slides[i - 1];
                    const style = window.getComputedStyle(prevSlide);
                    const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
                    positions[i] = positions[i - 1] + prevSlide.offsetHeight + margin-0.5;
                }

                swiper1.wrapperEl.style.transform = `translate3d(0px, -${positions[swiper1.activeIndex]}px, 0px)`;
     
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