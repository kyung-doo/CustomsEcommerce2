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
        });
    });


    $("#wrap > .blind").on('click', function () {
        $(".gnb-menu li").removeClass('active');
        $("#wrap > .blind").hide();
        $('body').css({'overflow': ''});
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
            }
        } else if(moveArrow === 'up') {
            if($("#header").hasClass('hide')) {
                $("#header").removeClass('hide');
            }
        }
        oldTop = top;
    })
});