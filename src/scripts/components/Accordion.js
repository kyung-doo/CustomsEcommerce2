
class Accordion {

    static DEFAULT_PROPS = {
        beforeClose: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.init();
    }

    init () {
        this.ele.find('.accordion-header .accordion-btn').on('click', ( e ) => {            
            const target = $(e.currentTarget).closest('.accordion-wrap');                           
            if(!target.hasClass('active')) {
                console.log(this.props.beforeClose)
                if(this.props.beforeClose) {
                    //다른 버튼 클릭하면 나머지 닫기                    
                    $('[data-ui="accordion"]').find('.accordion-body').slideUp(100);
                    $('[data-ui="accordion"]').removeClass('active');                    
                }
                console.log(2)
                //열기
                target.addClass('on'); 
                target.find(".accordion-body").slideDown(100);
                target.addClass('active');                
                target.find('.accordion-btn').attr('title','닫기');                
            } else {                
                //닫기
                target.find(".accordion-body").slideUp(100);                
                target.removeClass('active');
                target.find('.accordion-btn').attr('title','열기');                
            }
        });
    }
    
    destroy () {
        this.ele.find('.accordion-header > a').off('click');
    }
}

$(() => {
    //아코디언 타입2
    $(function(){
        $('.accordion-wrap-box').hide();
        $('.acc-btn').click(function(){            
            if(!$(this).hasClass('active')) {                
                //열기                
                $(this).closest('.inp-form.type1').find('.accordion-wrap-box').slideDown(100);
                $(this).addClass('active');                
                $(this).attr('title','닫기');                
            } else {                
                //닫기
                $(this).closest('.inp-form.type1').find('.accordion-wrap-box').slideUp(100);
                $(this).removeClass('active');
                $(this).attr('title','열기');                
            }
        })
    })    

    $(window).resize(function() {
        if($(window).width() <= 480) {
            $('.accordion-wrap').removeClass('active');
            $('.accordion-body').removeAttr('style');                
            $('.accordion-header .accordion-btn').attr('title','열기')
        }
    });
});


$.fn.accordion = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('accordion');
        var options =  $.extend({}, Accordion.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('accordion', (data = new Accordion($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.accordion.Constructor = Accordion;