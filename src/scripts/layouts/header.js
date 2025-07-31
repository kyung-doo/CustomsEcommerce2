import $ from 'jquery';
import gsap, { Expo } from 'gsap';
import { divide } from 'lodash';


$(() => {
    let moveArrow = '';
    let oldTop = 0;
          

    $("#wrap").append('<div class="blind d-none"></div>');    

    // 메인 네비
    $(".gnb-menu li").each(function () {
        const btn = $(this).find("button");
        btn.on('click', function (){
            $(".gnb-menu li").removeClass('active');
            $(this).parent().addClass('active');
            $('body').css({'overflow': 'hidden'});
            $(".main-allmenu").hide();
            $("#header .allmenu").removeClass('active');
            $(".mobile-dep-menu").removeClass('mobile-active');
            if($(window).width() >= 1023) {
                $("#wrap > .blind").show();
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
        } else {
            $(".main-allmenu").hide();
            $('body').css({'overflow': ''});
            $("#header .allmenu").removeClass('active');
        }
    });
    
    $("#wrap > .blind").on('click', function () {
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').css({'overflow': ''});        
    });

    $('#header .main-menu .allmenu').on('focus',function(){
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').css({'overflow': ''});        
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
            $('body,html').css({"overflow":"hidden"});
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
        }
    });    


    // 팝업
    $(function(){
        var btn = $('.popup-box .btn-navi.popup');        
        var closeBtn = $('.popup-box .close-btn');        
        var box = $('.popup-box .modal');

        btn.click(function(){
            var th = $(this);            
            th.addClass('active');
            /*
            $('body,html').css({"overflow":"hidden"});
            $(window).on('resize',function(){
                $('body,html').css({"overflow":"hidden"});
            })
                */
        });

        closeBtn.click(function(){
            var th = $(this);            
            box.hide();
            th.closest('.popup-box').find('.btn-navi.popup').removeClass('active');
            /*
            $('body,html').css({"overflow":"auto"});
            $(window).on('resize',function(){
                $('body,html').css({"overflow":"auto"});
            })
                */            
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
    })
    
});




