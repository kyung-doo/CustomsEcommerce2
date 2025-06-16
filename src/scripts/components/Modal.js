import $ from 'jquery';

class Modal {

    static DEFAULT_PROPS = {
        
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.copyHtml = this.ele.html();
        this.init();
    }

    init () {
        $("body").append(this.ele);
    }

    show () {
        this.ele.empty().append(this.copyHtml);
        this.ele.removeClass('d-none');
    }
    
    hide () {
        this.ele.addClass('d-none');
    }

}

$.fn.modal = Plugin;
$.fn.modal.Constructor = Modal;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('modal');
        var options =  $.extend({}, Modal.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('modal', (data = new Modal($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}