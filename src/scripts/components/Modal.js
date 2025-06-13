import $ from 'jquery';
import gsap, { Back } from 'gsap';

class Modal {

    static DEFAULT_PROPS = {
        
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.init();
    }

    init () {
        $("body").append(this.ele);
    }

    show () {
        this.ele.removeClass('d-none');
        gsap.from(this.ele.find('.modal-wrap'), {scale: 0.9, opacity: 0, ease: Back.easeOut.config(1)});
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