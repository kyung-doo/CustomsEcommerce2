
$(() => {
    let moveArrow = '';
    let oldTop = 0;
          

    $("#wrap").append('<div class="blind d-none"></div>');    


    //스크롤 막기
    function preventDefault(e) {
        e.preventDefault();
    }    

    function disableScroll() {
        document.addEventListener('wheel', preventDefault, { passive: false });
        document.addEventListener('touchmove', preventDefault, { passive: false });        
    }

    function enableScroll() {
        document.removeEventListener('wheel', preventDefault, { passive: false });
        document.removeEventListener('touchmove', preventDefault, { passive: false });        
    }

    // 메인 네비
    $(".gnb-menu li").each(function () {
        const btn = $(this).find("button.gnb-main-trigger");
        btn.on('click', function (){            
            $(".gnb-menu li").removeClass('active');
            $(this).parent().addClass('active');
            $('body').addClass('no-scroll')
            $(".main-allmenu").hide();
            $('body').css({'overflow': 'auto'});
            $("#header .allmenu").removeClass('active');
            $(".mobile-dep-menu").removeClass('mobile-active');
            if($(window).width() >= 1023) {
                $("#wrap > .blind").show();
                disableScroll();
            }              
        });
    });

    $("#header .allmenu").on("click", function () {
        if(!$(".main-allmenu").is(":visible")) {
            $(".main-allmenu").show().scrollTop(0);
            $(".gnb-menu li").removeClass('active');
            $("#wrap > .blind").hide();
            $('body').css({'overflow': 'hidden'});
            $("#header .allmenu").addClass('active');
            $(window).on('resize', () => {
                if($("#header .allmenu").hasClass('active')){                    
                    $('body').css({'overflow': 'hidden'});                    
                }else{
                    $('body').css({'overflow': 'auto'});
                }
            }); 
            $(this).attr('title','전체메뉴 닫기')
        } else {
            $(".main-allmenu").hide();
            $('body').css({'overflow': ''});
            $("#header .allmenu").removeClass('active');
            $(this).attr('title','전체메뉴 열기')
            
        }
        enableScroll();
    });
    
    $("#wrap > .blind").on('click', function () {
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').removeClass('no-scroll')       
        enableScroll();
    });

    $('#header .main-menu .allmenu').on('focus',function(){
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').css({'overflow': ''});     
        enableScroll();   
    });


    // 모바일 네비
    $(".mobile-all-menu").on('click', function (e) {
        $("#wrap").addClass('mobile-open');
        gsap.set($("#header .main-menu"), {x: 390});
        gsap.to($("#header .main-menu"), 0.6, {x: 0, ease: Expo.easeInOut}); 
        $('.gnb-menu > li').removeClass('active')
        $('.dep1').addClass('active');        
        $('.sub-title').removeClass('mobile-dep-menu');
        $('.sub-title').siblings('ul').hide();
        $('body,html').css({"overflow":"hidden"});

        $(window).on('resize',function(){
            if($("#wrap").hasClass('mobile-open')){
                $('body,html').css({"overflow":"hidden"});
            }else{
                $('body,html').css({"overflow":"auto"});
            }
            
        }) 
    });
    $(".mobile-close").on('click', function (e) {
        gsap.to($("#header .main-menu"), 0.6, {x: 390, ease: Expo.easeOut, onComplete: () => {
            $("#wrap").removeClass('mobile-open');
            $('.sub-title').removeClass('mobile-active');
        }});
        $('body,html').css({"overflow":"auto"});        
        $(window).on('resize',function(){
            $('body,html').css({"overflow":"auto"});
        }) 
    });
    $(".mobile-dep-menu").on('click', function () {
        if(!$(this).parent().find('.depth2').is(':visible')) {
            $('.depth2').slideUp(300);            
            $(this).parent().find('.depth2').slideDown(300);            
            $('.sub-title').removeClass('mobile-active');
            $(this).addClass('mobile-active');                                    
            $('.sub-title').attr('title','메뉴열기')
            $(this).attr('title','메뉴닫기');            
        } else {
            $(this).parent().find('.depth2').slideUp(300);
            $(this).removeClass('mobile-active');
            $('.sub-title').attr('title','메뉴열기');
        }
    });   
    

    // 스크롤 이벤트
    $("html, body").on("scroll", (e) => {
        const top = $('body').scrollTop();
        if(oldTop < top) {
            moveArrow = 'down';
        } else {
            moveArrow = 'up';
        }
        if(moveArrow === 'down' && top > 200) {
            if(!$("#header").hasClass('hide')) {
                $("#header").addClass('hide');
            }
        } else if(moveArrow === 'up') {
            if($("#header").hasClass('hide')) {
                $("#header").removeClass('hide');
            }
        }

        if(top >= 32) {
            if(!$(".main-allmenu").hasClass("large")) {
                $(".main-allmenu").addClass("large");
            }
        } else {
            if($(".main-allmenu").hasClass("large")) {
                $(".main-allmenu").removeClass("large");
            }
        }
    
        oldTop = top;
    });

    if($(window).width() < 1023) {
        $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function(){
            $("#wrap").removeClass('mobile-open');
            $("#wrap > .blind").hide();
            $('body').css({'overflow': 'auto'});
            enableScroll()
        })
    } else {
        $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function(){
            $('.gnb-menu > li').removeClass('active');
            $('.blind').hide();
            $('body').css({'overflow': 'auto'});
            enableScroll()
        })
    }
    // 리사이즈 이벤트        
    $(window).on('resize', () => {
        if($(window).width() < 1023) {
            if($(".gnb-menu li.active").length > 0) {
                $("#wrap > .blind").hide();
                $('body').css({'overflow': ''});
            }
            if($(".main-allmenu").is(":visible")) {
                $(".main-allmenu").hide();
                $("#header .allmenu").removeClass('active');
                $('body').css({'overflow': ''});
                $("#wrap > .blind").hide();
            }            
            $('.sub-title').removeClass('mobile-active');            
            $('.gnb-main-trigger').on('click',function(e){
                $('.sub-title').removeClass('mobile-active');
                $('.sub-title').siblings('depth2').hide();                
            })    
            
            $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function(){
                $("#wrap").removeClass('mobile-open');
                $("#wrap > .blind").hide();
                $('body').css({'overflow': 'auto'});
                enableScroll()
            })
        } else {
            $("#wrap").removeClass('mobile-open');
            gsap.set($("#header .main-menu"), {x: 0});
            $("#header .main-menu").css({transfrom: 'none'});
            $('body').css({'overflow': ''});
            if($(".gnb-menu li.active").length > 0) {
                $("#wrap > .blind").show();
            }
            $('.depth2').show();
            $('.sub-title.mobile-dep-menu').removeClass('mobile-active')            
            $('.gnb-menu > li').removeClass('active');
            $('.sub-title').removeClass('mobile-active');
            $('.blind').hide();

            $('#header .main-menu .gnb-main-list .gnb-list .depth2 a').click(function(){
                $('.gnb-menu > li').removeClass('active');
                $('.blind').hide();
                $('body').css({'overflow': 'auto'});
                enableScroll()
            })
            
        }

        enableScroll();
    });    

    // 팝업
    $(function(){
        var btn = $('.popup-box .btn-navi.popup');        
        var closeBtn = $('.popup-box .close-btn');        
        var box = $('.popup-box .modal');

        btn.click(function(){
            var th = $(this);            
            th.addClass('active');            
        });

        closeBtn.click(function(){
            var th = $(this);            
            box.hide();
            th.closest('.popup-box').find('.btn-navi.popup').removeClass('active');            
        })
    });


    $(function(){        
        //기본
        $(document).ready(function() {        
            var seachInp = $('.wrap-search-area input');
            var deleteBtn = $('.wrap-search-area button.sch-delete');          
        
            if (seachInp.val()) {            
                deleteBtn.show();
            } else {            
                deleteBtn.hide();
            }
        });

        //검색 입력할떄
        $(document).on('keyup','.wrap-search-area input',function(){       
            var deleteBtn = $('.wrap-search-area button.sch-delete');        
            
            if($(this).val() !== ""){            
                deleteBtn.show(); 
                console.log()           
            }else{
                deleteBtn.hide();            
            }        
        });    

        //삭제버튼 클릭하면 내용삭제
        $(document).on('click','.wrap-search-area button.sch-delete',function(){        
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