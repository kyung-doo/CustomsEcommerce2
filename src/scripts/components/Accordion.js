import $ from 'jquery';


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
                if(this.props.beforeClose) {
                    //다른 버튼 클릭하면 나머지 닫기
                    target.siblings('*[data-ui="accordion"]').find('.accordion-body').slideUp(100);
                    target.siblings('*[data-ui="accordion"]').removeClass('active');                    
                }
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
    $(window).resize(function() {
        if($(window).width() <= 480) {
            $('.accordion-wrap').removeClass('active');
            $('.accordion-body').removeAttr('style');                
            $('.accordion-header .accordion-btn').attr('title','열기')
        }
    });
});


$.fn.accordion = Plugin;
$.fn.accordion.Constructor = Accordion;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('accordion');
        var options =  $.extend({}, Accordion.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('accordion', (data = new Accordion($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}