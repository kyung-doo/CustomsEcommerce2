

$(() => {



    let moveArrow = '';
    let oldTop = 0;
    let scrollbarCompensation = 0;
    var isEn = document.documentElement.lang === 'en';


    sessionStorage.setItem('scw', window.innerWidth - document.body.getBoundingClientRect().width);

    const $scrollCompensationTargets = $('#masthead, #header');


    $("#wrap").append('<div class="blind d-none"></div>');

    function getScrollBarWidth() {

        const hasScw = Number(sessionStorage.getItem('scw'));
        if (hasScw) {
            return hasScw
        } else {

            const nowScw = window.innerWidth - document.body.getBoundingClientRect().width;

            sessionStorage.setItem('scw', nowScw);

            return nowScw
        }

    }

    function syncHeaderScrollbarCompensation() {
        const shouldCompensate = $(window).width() >= 1023 && $('#header .allmenu').hasClass('active');
        const compensationValue = shouldCompensate ? scrollbarCompensation : 0;

        $scrollCompensationTargets.each(function () {
            const $target = $(this);

            if (compensationValue > 0) {

                if (!$target.data('scroll-padding-right')) {

                    $target.data('scroll-padding-right', $target.css('padding-right'));
                }

                const targetPaddingRight = parseFloat($target.data('scroll-padding-right')) || 0;
                $target.css('padding-right', targetPaddingRight + compensationValue);
            } else {

                const targetPaddingRight = $target.data('scroll-padding-right');

                if (targetPaddingRight !== undefined) {

                    $target.css('padding-right', targetPaddingRight || '');
                    $target.removeData('scroll-padding-right');
                }
            }
        });
    }

    function syncBodyScrollbarCompensation() {
        const shouldCompensate = $(window).width() >= 1023 && $('#header .allmenu').hasClass('active') && scrollbarCompensation > 0;
        const $body = $('body');


        if (shouldCompensate) {
            if (!$body.data('scroll-padding-right')) {
                $body.data('scroll-padding-right', $body.css('padding-right'));
            }

            const bodyPaddingRight = parseFloat($body.data('scroll-padding-right')) || 0;
            $body.css('padding-right', bodyPaddingRight + scrollbarCompensation);
        } else {
            const bodyPaddingRight = $body.data('scroll-padding-right');

            if (bodyPaddingRight !== undefined) {
                $body.css('padding-right', bodyPaddingRight || '');
                $body.removeData('scroll-padding-right');
            }
        }
    }

    function resetHeaderScrollbarCompensation() {
        scrollbarCompensation = 0;
        syncBodyScrollbarCompensation();
        syncHeaderScrollbarCompensation();
    }


    //스크롤 막기
    // function preventDefault(e) {
    //     e.preventDefault();
    // }    

    // function disableScroll() {
    //     document.addEventListener('wheel', preventDefault, { passive: false });
    //     document.addEventListener('touchmove', preventDefault, { passive: false });        
    // }

    // function enableScroll() {
    //     document.removeEventListener('wheel', preventDefault, { passive: false });
    //     document.removeEventListener('touchmove', preventDefault, { passive: false });        
    // }


    function stopScroll(e) {
        e.preventDefault();
    }

    function disableScroll() {
        document.addEventListener('wheel', stopScroll, { passive: false });
        document.addEventListener('touchmove', stopScroll, { passive: false });
    }

    function enableScroll() {
        document.removeEventListener('wheel', stopScroll, { passive: false });
        document.removeEventListener('touchmove', stopScroll, { passive: false });
    }

    /* ==================================================
        메뉴
        ================================================== */
    $(".gnb-menu li").each(function () {

        const btn = $(this).find("button.gnb-main-trigger");
        btn.on('click', function () {
            var menuH = $('#header .main-menu .gnb-menu').height();
            $(".gnb-menu li").removeClass('active');
            $(this).parent().addClass('active');
            $('body').addClass('no-scroll')
            $(".main-allmenu").hide();
            $('body').css({ 'overflow': 'auto' });
            $("#header .allmenu").removeClass('active');
            $('#header , #masthead').css('padding-right', 0)
            $(".mobile-dep-menu").removeClass('mobile-active');


            function setGnbPosition() {
                if ($(window).width() >= 1000) {
                    $('#header .main-menu .gnb-toggle-wrap').css('top', menuH - 1);
                } else {
                    $('#header .main-menu .gnb-toggle-wrap').css('top', '');
                }
            }

            setGnbPosition();
            $(window).on('resize', setGnbPosition);
            if ($(window).width() >= 1000) {
                $("#wrap > .blind").show();
                // disableScroll();
            }
        });
    });

    /* ==================================================
        전체메뉴
        ================================================== */

    // $("#header .allmenu").on("click", function () {
		$(document).on("click", "#header .allmenu", function () {
        if (!scW) scW = getScrollBarWidth();

        if ($(this).hasClass("active")) {

            $(".main-allmenu").hide();
            $('body').css({ 'overflow': '' });
            $("#header .allmenu").removeClass('active');
            if (isEn === true) {
                $(this).attr('title', 'Open All Menus')
            } else {
                $(this).attr('title', '전체메뉴 열기')
            }
            $('#header, #masthead').css("padding-right", 0)
        } else {

            $(".main-allmenu").show().scrollTop(0);
            $(".gnb-menu li").removeClass('active');
            $("#wrap > .blind").hide();
            $('body').css({ 'overflow': 'hidden' });
            $("#header .allmenu").addClass('active');
            $('#header, #masthead').css("padding-right", scW)
            // syncBodyScrollbarCompensation();
            // syncHeaderScrollbarCompensation();
            /*  $(window).on('resize', () => {
                  if($("#header .allmenu").hasClass('active')){                    
                      $('body').css({'overflow': 'hidden'});                    
                  }else{
                      $('body').css({'overflow': 'auto'});
                  }
                 syncBodyScrollbarCompensation();
                  syncHeaderScrollbarCompensation();
              }); */



            if (isEn === true) {
                $(this).attr('title', 'Close All Menus')
            } else {
                $(this).attr('title', '전체메뉴 닫기')
            }


        }
        enableScroll();
    });

    /* ==================================================
        검은색 배경 클릭하면 메뉴 닫기
        ================================================== */
    // $("#wrap > .blind").on('click', function () {
		$(document).on('click', '#wrap > .blind', function () {
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').removeClass('no-scroll')
        resetHeaderScrollbarCompensation();
        enableScroll();
    });

    /* ==================================================
        전체메뉴 포커스하면 메뉴닫기
        ================================================== */
    $('#header .main-menu .allmenu').on('focus', function () {
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        //$('body').css({'overflow': ''});
        resetHeaderScrollbarCompensation();
        enableScroll();
    });


    /* ==================================================
        전체메뉴, 내소식 클릭 시 메뉴 닫기
        (1023px 이하 추가 처리 포함)
        ================================================== */
    // $('#header .header-actions .name-box a:has(.inform),.btn-navi.login,.btn-navi.sch').click(function () {
		$(document).on('click', '#header .header-actions .name-box a:has(.inform),.btn-navi.login,.btn-navi.sch', function () {

        // 공통 처리
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').removeClass('no-scroll');
        enableScroll();
        $('.main-menu.main-allmenu').hide();
        $('.allmenu').removeClass('active');
        // resetHeaderScrollbarCompensation();
        $('#header .main-menu .allmenu').attr('title', '전체메뉴 열기');
        // $('body').css({ "overflow-y": "auto" });

        // 1023px 이하일 때만
        if (window.innerWidth <= 1023) {
            $('#wrap').removeClass('mobile-open');
        }
        //$('.sub-title').removeClass('mobile-dep-menu');
    });




    /* ==================================================
        모바일 메뉴
        ================================================== */
    // $(".mobile-all-menu").on('click', function (e) {
		$(document).on('click', '.mobile-all-menu', function (e) {
        $("#wrap").addClass('mobile-open');
        // gsap.set($("#header .main-menu"), {x: 390});
        // gsap.to($("#header .main-menu"), 0.6, {x: 0, ease: Expo.easeInOut}); 
        $('.gnb-menu > li').removeClass('active')
        $('.dep1').addClass('active');
        // $('.sub-title').removeClass('mobile-dep-menu');
        $('.sub-title').siblings('ul').hide();
        $('body').css({ "overflow": "hidden" });

        // $(window).on('resize', function () {
        //     if ($("#wrap").hasClass('mobile-open')) {
        //         $('body').css({ "overflow": "hidden" });
        //     } else {
        //         $('body').css({ "overflow": "auto" });
        //     }   

        // })
    });
    // $("#header .main-menu .gnb-main-list .gnb-list .depth2 a").on('click', function (e) {
		$(document).on('click', '#header .main-menu .gnb-main-list .gnb-list .depth2 a', function (e) {
        // gsap.to($("#header .main-menu"), 0.6, {x: 390, ease: Expo.easeOut, onComplete: () => {
        //     $("#wrap").removeClass('mobile-open');
        //     $('.sub-title').removeClass('mobile-active');
        // }});
        $("#wrap").removeClass('mobile-open');
        $('.sub-title').removeClass('mobile-active');
        // $('body').css({ "overflow": "auto" });
        // $(window).on('resize', function () {
        //     $('body').css({ "overflow": "auto" });
        // })

        // 페이지 이동 못하고 confirm/alert 뜨는 조건에 걸렸을때는 allMenu 히든시키지 않을것. 0814 lyj
        // if (!$('#modalAlert').is(':visible')) {
        //     setTimeout(function () {
        //         $('.main-allmenu').hide();
        //         $('.allmenu').removeClass('active');
        //         // resetHeaderScrollbarCompensation();
        //         // }, $(this).closest('.main-allmenu').length ? 500 : 0);
        //     }, 500);
        // }

    });

    // $(".mobile-close").on('click', function () {
		$(document).on('click', '.mobile-close', function () {
        $("#wrap").removeClass('mobile-open');
        $('.sub-title').removeClass('mobile-active');
        $('body').css({ "overflow": "auto" });

    })


    // $(".mobile-dep-menu").on('click', function () {
		$(document).on('click', '.mobole-dep-menu', function () {

        if (!$(this).parent().find('.depth2').is(':visible')) {
            $('.gnb-list:has(strong.sub-title)').find('.depth2').slideUp(300);
            // $(this).parent().find('.depth2').slideUp(300);

            $(this).parent().find('.depth2').slideDown(300);
            $('.sub-title').removeClass('mobile-active');
            $(this).addClass('mobile-active');
            $('.sub-title').attr('title', '메뉴열기')
            $(this).attr('title', '메뉴닫기');
        } else {
            $(this).parent().find('.depth2').slideUp(300);
            $(this).removeClass('mobile-active');
            $('.sub-title').attr('title', '메뉴열기');
        }
    });


    /* ==================================================
        스크롤
        ================================================== */
    $("html, body").on("scroll", (e) => {
        const top = $('body').scrollTop();
        if (oldTop < top) {
            moveArrow = 'down';
        } else {
            moveArrow = 'up';
        }
        if (moveArrow === 'down' && top > 200) {
            if (!$("#header").hasClass('hide')) {
                $("#header").addClass('hide');
            }
        } else if (moveArrow === 'up') {
            if ($("#header").hasClass('hide')) {
                $("#header").removeClass('hide');
            }
        }

        if (top >= 32) {
            if (!$(".main-allmenu").hasClass("large")) {
                $(".main-allmenu").addClass("large");
            }
        } else {
            if ($(".main-allmenu").hasClass("large")) {
                $(".main-allmenu").removeClass("large");
            }
        }

        oldTop = top;
    });

    if ($(window).width() < 1023) {
        $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function () {

            
            $("#wrap").removeClass('mobile-open');
            $("#wrap > .blind").hide();
            $('body').css({ 'overflow': 'auto' });
            enableScroll()
        })
    } else {
        $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function () {
            $('.gnb-menu > li').removeClass('active');
            $('.blind').hide();
            // $('body').css({ 'overflow': 'auto' });
            enableScroll()
        })
    }
    /* ==================================================
        반응형
        ================================================== */
    $(window).on('resize', () => {
        if ($(window).width() < 1023) {
            if ($(".gnb-menu li.active").length > 0) {
                $("#wrap > .blind").hide();
                //                $('body').css({'overflow': ''});
            }
            if ($(".main-allmenu").is(":visible")) {
                $(".main-allmenu").hide();
                $("#header .allmenu").removeClass('active');
                // $('body').css({ 'overflow': '' });
                $("#wrap > .blind").hide();
            }
            $('.sub-title').removeClass('mobile-active');
            $('.gnb-main-trigger').on('click', function (e) {
                $('.sub-title').removeClass('mobile-active');
                $('.sub-title').siblings('depth2').hide();
            })

            $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function () {
                $("#wrap").removeClass('mobile-open');
                $("#wrap > .blind").hide();
                $('body').css({ 'overflow': 'auto' });
                enableScroll()
            })

            // 0813 lyj 
            // header에 paddingRight 준 상태(header에 )에서 1023이하로 줄였을때 (모바일메뉴로 변경될때) resetHeaderScrollbarCompensation 줘야함.
            if ($scrollCompensationTargets.data('scroll-padding-right')) {

            }
        } else {
            $("#wrap").removeClass('mobile-open');
            gsap.set($("#header .main-menu"), { x: 0 });
            $("#header .main-menu").css({ transfrom: 'none' });
            // $('body').css({ 'overflow': '' });
            if ($(".gnb-menu li.active").length > 0) {
                $("#wrap > .blind").show();
            }
            $('.depth2').show();
            $('.sub-title.mobile-dep-menu').removeClass('mobile-active')
            $('.gnb-menu > li').removeClass('active');
            $('.sub-title').removeClass('mobile-active');
            $('.blind').hide();



            $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function () {
                $('.gnb-menu > li').removeClass('active');
                $('.blind').hide();
                $('body').css({ 'overflow': 'auto' });
                enableScroll()
            })

            // $('body').css('overflow', 'auto')
        }

        // syncHeaderScrollbarCompensation();
        enableScroll();
    });

    /* ==================================================
        알림
        ================================================== */
    $(function () {
        var btn = $('.popup-box .btn-navi.popup');
        var closeBtn = $('.popup-box .close-btn');
        var box = $('.popup-box .modal');

        btn.click(function () {
            var th = $(this);
            th.addClass('active');
        });

        closeBtn.click(function () {
            var th = $(this);
            box.hide();
            th.closest('.popup-box').find('.btn-navi.popup').removeClass('active');
        })
    });


    $(function () {
        //기본
        $(document).ready(function () {
            var seachInp = $('.wrap-search-area input');
            var deleteBtn = $('.wrap-search-area button.sch-delete');

            if (seachInp.val()) {
                deleteBtn.show();
            } else {
                deleteBtn.hide();
            }
        });

        //검색 입력할떄
        $(document).on('keyup', '.wrap-search-area input', function () {
            var deleteBtn = $('.wrap-search-area button.sch-delete');

            if ($(this).val() !== "") {
                deleteBtn.show();
                // console.log()           
            } else {
                deleteBtn.hide();
            }
        });

        //삭제버튼 클릭하면 내용삭제
        $(document).on('click', '.wrap-search-area button.sch-delete', function () {
            var closestBox = $('.wrap-search-area');
            var inputBox = $('.wrap-search-area input')


            $(this).closest(closestBox).find(inputBox).val('');
            $(this).hide();
        });
    });


    //언어 체크 checked => true
    window.addEventListener('load', () => {
        const kr = document.getElementById('kr');
        if (kr && kr.getAttribute('checked') !== null) {
            kr.checked = true;
            kr.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
});
