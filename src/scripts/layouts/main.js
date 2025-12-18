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
    
    var slideSpeed = 3000;  

    //화면 리사이즈 했을때 액션 슬라이드 꼬임 방지
    function syncToActiveSlide() {
        if (!swiper1 || swiper1.destroyed) return;

        const $slides = $('.slide-area1 .swiper-slide');
        let $activeSlide = $slides.filter('.on').first();

    if ($activeSlide.hasClass('swiper-slide-duplicate')) {
        const realIndex = $activeSlide.attr('data-swiper-slide-index');
        $activeSlide = $slides
            .not('.swiper-slide-duplicate')
            .filter('[data-swiper-slide-index="' + realIndex + '"]')
            .first();
    }
        
        if (!$activeSlide.length) {
            $activeSlide = $slides.eq(0);
        }

        const index = Number($activeSlide.attr('data-swiper-slide-index')) || 0;
        const tabBtn = $activeSlide.attr('data-btn');
        const box = $('.main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont');

        // Swiper 위치 동기화
        swiper1.slideToLoop(index, 0, true);
        swiper1.update();

        // UI 정리
        $slides.removeClass('on').removeAttr('title');
        $activeSlide.addClass('on').attr('title', '선택됨');

        box.removeClass('on');
        $('#' + tabBtn).addClass('on');
    }    

    //이미지슬라이드 개수가 적으면 정지버튼 삭제
    if($('.slide-area1 .swiper-button-next').hasClass('swiper-button-lock')){                    
        $('.swiper-stop').addClass('swiper-button-lock');                    
    }else{                    
        $('.swiper-stop').removeClass('swiper-button-lock');                    
    }     

    //액션 슬라이드 리스트 클릭            
    var tabBox = $('.slide-area1 .swiper-slide-active').attr('data-btn');                                

    $('#'+tabBox).addClass('on')
    $('.slide-area1 .swiper-slide-active').addClass('on');  
    $('.slide-area1').attr('tabindex','0');   
    

    $('.slide-area1 .swiper-slide').on('click focus', function () {
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

        $('.slide-area1 .swiper-slide').on('mouseleave', function() {
            setTimeout(function(){
                swiper1.autoplay.start();
            },1)
        });
    });        


    // Tab 키로 슬라이드 제어
    $(document).on('keydown', function(e) {
        if (e.key === 'Tab') {
            // 현재 포커스가 slide-area1 내부 요소인지 확인
            if ($(':focus').closest('.slide-area1').length) {
                // 슬라이드 정지
                swiper1.autoplay.stop();
                $('.slide-area1 .swiper-stop').addClass('on').text('재생');
            } else {
                // slide-area1 벗어나면 재생
                swiper1.autoplay.start();
                $('.slide-area1 .swiper-stop').removeClass('on').text('정지');
            }
        }
    });
    
    //액션 슬라이드
    const swiper1 = new Swiper('#list-slide', {
        slidesPerView: 'auto',
        spaceBetween: 14,              
        direction: 'vertical',
        autoHeight : true,               
        loop: true,      
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        resizeObserver: true,       
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
    
    let resizeTimer = null;

    $(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            syncToActiveSlide();

            // 리사이즈 끝나면 다시 자동재생
            if (swiper1.autoplay) {
                swiper1.autoplay.start();
            }
        }, 1);
    });


    swiper1.on('init', function () {
        syncToActiveSlide();
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

                // Tab 키로 slide-area2 제어
                $(document).on('keydown', function(e) {
                    if (e.key === 'Tab') {
                        // 현재 포커스가 slide-area2 내부 요소인지 확인
                        if ($(':focus').closest('.slide-area2').length) {
                            // 슬라이드 정지
                            swiper2.autoplay.stop();
                            $('.slide-area2 .swiper-stop').addClass('on').text('재생');
                        } else {
                            // slide-area2 벗어나면 재생
                            swiper2.autoplay.start();
                            $('.slide-area2 .swiper-stop').removeClass('on').text('정지');
                        }
                    }
                });

                // slide-area2 내부 슬라이드 항목 포커스 이동 시 해당 슬라이드로 이동
                $('.slide-area2 .swiper-slide').on('focus', function() {
                    if (window.event && window.event instanceof KeyboardEvent) { // 키보드 입력인지 확인
                        var slideIndex = $(this).attr('data-swiper-slide-index');
                        swiper2.slideToLoop(Number(slideIndex), 0, true);
                    }
                });
            },
        }        
    });   

    //화면 최초 로드 시 자동 슬라이드
    setTimeout(function(){
        swiper1.update();
        swiper1.autoplay.atart();
        swiper2.update();
        swiper2.autoplay.atart();
    },300)

    // 공통 play/pause 처리
    $('.swiper-stop').click(function() {
        const $btn = $(this);
        const targetSwiper = $btn.closest('.slide-area1').length ? swiper1 : swiper2;

        if ($btn.hasClass('on')) {
            // 현재 정지 상태 → 재생 시작
            $btn.removeClass('on')
                .text('정지')
                .attr('title', '슬라이드 정지');
            targetSwiper.autoplay.start();
        } else {
            // 현재 재생 상태 → 정지
            $btn.addClass('on')
                .text('재생')
                .attr('title', '슬라이드 재생');
            targetSwiper.autoplay.stop();
        }
    });


    $('.swiper-stop').attr({
        'title': '슬라이드 정지',        
    });    

    $('.swiper-button-next').attr({
        'title': '다음 슬라이드',        
    });
    $('.swiper-button-prev').attr({
        'title': '이전 슬라이드',        
    });
});