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
        this.ele.find(".modal-wrap").append(
            `<button type="button" class="btn-close">
                <i class="icon close"></i>
                <span class="sr-only">닫기</span>                     
            </button>`
        );
        this.copyHtml = this.ele.html();
        $("body").append(this.ele);
    }

    show () {
        this.ele.empty().append(this.copyHtml);
        this.ele.removeClass('d-none');

        gsap.from(this.ele.find(".modal-wrap"), 0.4, {scale: 0.9, opacity: 0, ease: Back.easeOut})

        this.ele.find(".btn-close").on("click", () => {
            this.hide();
        });
        this.ele.find(".modal-close").on("click", () => {
            this.hide();
        });
        $("#wrap, .guide-wrap").attr('inert', ' ');
        $("body").css({'overflow': 'hidden'});
        setTimeout(() => {
            this.ele.find(".modal-body").attr("tabindex", 0).focus();
        }, 50);
    }
    
    hide () {
        this.ele.addClass('d-none');
        this.ele.find(".btn-close").off("click");
        this.ele.find(".modal-close").off("click");
        $("#wrap, .guide-wrap").removeAttr('inert');
        $("body").css({'overflow': ''});
        this.ele.empty();
        setTimeout(() => {
            $(`*[data-modal-target="#${this.ele.attr('id')}"]`).focus();
        }, 50);
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