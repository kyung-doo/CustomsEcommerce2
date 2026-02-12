class Tooltip {

    static DEFAULT_PROPS = {
        
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.init();
    }

    init () {
        const owner = this;
        const tooltipAct = owner.ele.find(".tooltip-action");
        const tooltipIco = owner.ele.find(".tooltip-ico");
        const startY = owner.ele.hasClass('top') ? 20 : -20;
        const contArea = $('.cont-area');        
        
        this.ele.find(".tooltip-btn-area button").on("click", function () {
            

            if(!tooltipAct.hasClass("active")) {
                if(contArea.find('.tooltip-action').hasClass('active')){
                    contArea.find('.tooltip-action').removeClass('active');
                    contArea.find('.tooltip-ico').removeClass('active');
                    tooltipAct.css({"left":-60})
                }
                tooltipAct.addClass("active");
                tooltipIco.addClass("active");   
                
                if($(window).width() <= 480){
                    var tb = tooltipIco.closest('.tooltip-tit').find('.title > span').width()
                    var list = tooltipIco.closest('.tooltip-tit').find('.title > strong').width()
                    
                    tooltipAct.css({"left":-tb})
                    tooltipAct.css({"left":-list})
                }
                

                // 툴팁 윈도우 너비에 따라 left 위치 변경
                if(tooltipAct.offset().left + tooltipAct.outerWidth() >= $(window).width()){
                    const IsOverflow = tooltipAct.offset().left + tooltipAct.outerWidth() - $(window).outerWidth() + 100                   
                    tooltipAct.css({"left":-IsOverflow})

                    if($(window).width() >= 481){
                        if(IsOverflow >= -326){
                            tooltipAct.css({"left":-326})
                        }                                       
                    }
                }

            } else {
                tooltipAct.removeClass("active");
                tooltipIco.removeClass("active");                
            }
        });
        this.ele.find(".tooltip-close").on("click", function () {
            tooltipAct.removeClass("active");
            tooltipIco.removeClass("active");            
        });   
        
        // 툴팁 외부 클릭 시 닫기
        $(document).on("click.tooltip", function (e) {
            // 클릭한 요소가 현재 툴팁 내부가 아니면 닫기
            if (tooltipAct.hasClass("active") && $(e.target).closest(owner.ele).length === 0) {
                tooltipAct.removeClass("active");
                tooltipIco.removeClass("active");                
            }
        });

        // 툴팁 내부 클릭 시 이벤트 버블링 막기
        owner.ele.on("click", function (e) {
            e.stopPropagation();            
        });


        // 윈도우 리사이징하면 툴팁 닫기
        $(window).on('resize', function() {
            tooltipAct.css({"left":-60})  
            if (tooltipAct.hasClass('active')) {
                tooltipAct.removeClass('active');
                tooltipIco.removeClass("active");                                             
            }
        })
    }
}

$.fn.tooltip = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('tooltip');
        var options =  $.extend({}, Tooltip.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('tooltip', (data = new Tooltip($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.tooltip.Constructor = Tooltip;
