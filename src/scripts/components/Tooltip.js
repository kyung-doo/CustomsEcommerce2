
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
        const startY = owner.ele.hasClass('top') ? 20 : -20;
        this.ele.find(".tooltip-btn-area button").on("click", function () {
            if(!tooltipAct.hasClass("active")) {
                tooltipAct.addClass("active");
                gsap.from(owner.ele.find(".tooltip-action"), 0.6, {y: startY, opacity: 0, ease: Cubic.easeOut})
            } else {
                tooltipAct.removeClass("active");
            }
        });
        this.ele.find(".tooltip-close").on("click", function () {
            tooltipAct.removeClass("active");
        });
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