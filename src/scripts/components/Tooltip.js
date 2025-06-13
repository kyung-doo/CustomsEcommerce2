import $ from 'jquery';

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
        this.ele.find(".tooltip-btn-area button").on("click", function () {
            if(!owner.ele.find(".tooltip-action").hasClass("active")) {
                owner.ele.find(".tooltip-action").addClass("active");
            } else {
                owner.ele.find(".tooltip-action").removeClass("active");
            }
        });
        this.ele.find(".tooltip-close").on("click", function () {
            owner.ele.find(".tooltip-action").removeClass("active");
        });
    }
}

$.fn.tooltip = Plugin;
$.fn.tooltip.Constructor = Tooltip;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('tooltip');
        var options =  $.extend({}, Tooltip.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('tooltip', (data = new Tooltip($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}