import $ from 'jquery';


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
            $("#wrap > .blind").show();
            $('body').css({'overflow': 'hidden'});
            $(".main-allmenu").hide();
            $("#header .allmenu").removeClass('active');
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
    })

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
    })
});