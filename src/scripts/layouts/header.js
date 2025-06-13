import $ from 'jquery';


$(() => {
    let moveArrow = '';
    let oldTop = 0;
    let timer = null;

    $("#wrap").append('<div class="blind d-none"></div>');

    // 메인 네비
    $(".gnb-menu li").each(function () {
        const btn = $(this).find("button");
        btn.on('click', function (){
            $(".gnb-menu li").removeClass('active');
            $(this).parent().addClass('active');
            $("#wrap > .blind").show();
            clearTimeout(timer);
            $(".krds-main-menu").off('mouseleave').on('mouseleave', function () {
                timer = setTimeout(() => {
                    $(".gnb-menu li").removeClass('active');
                    $(".krds-main-menu").off('mouseleave');
                    $("#wrap > .blind").hide();
                }, 600);
            });
        });
    });

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
                $(".gnb-menu li").removeClass('active');
                $("#wrap > .blind").hide();
            }
        } else if(moveArrow === 'up') {
            if($("#header").hasClass('hide')) {
                $("#header").removeClass('hide');
                $(".gnb-menu li").removeClass('active');
                $("#wrap > .blind").hide();
            }
        }
        oldTop = top;
    })
});