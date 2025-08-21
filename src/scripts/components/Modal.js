
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
        this.ele.empty();
    }

    show () {
        this.ele.empty().append(this.copyHtml);
        this.ele.removeClass('d-none');
        
        // gsap.set(this.ele.find(".modal-wrap"), {scale: 0.9, opacity: 0});
        // gsap.to(this.ele.find(".modal-wrap"), 0.4, {delay:0.1, scale: 1, opacity: 1, ease: Back.easeOut, onComplete: () => {
            this.ele.trigger('modal-show');
            
            var seachInp = $('.wrap-search-area input');
            var deleteBtn = $('.wrap-search-area button.sch-delete');          
        
            if (seachInp.val()) {            
                deleteBtn.show();
            } else {            
                deleteBtn.hide();
            }
        // }});
        

        this.ele.find(".btn-close").on("click", () => {
            this.hide();
        });
        this.ele.find(".modal-close").on("click", () => {
            this.hide();
        });        

        if(this.ele.attr('id') === 'homepage' || this.ele.attr('id') === 'customs'){
            $("body").css({'overflow': 'auto'});            
        }else{
            $("body").css({'overflow': 'hidden'});            
        }
        
        this.ele.find(".btn-close").on("focusin", e => {
            $(document).on('keydown.modal', (e) => {
                if(e.key === 'Tab' && !e.shiftKey) {
                    this.ele.find(".modal-body").focus();
                    e.preventDefault();
                }
            });
        });
        this.ele.find(".modal-body").on("focusin", e => {
            $(document).on('keydown.modal', (e) => {
                if(e.key === 'Tab' && e.shiftKey) {
                    this.ele.find(".btn-close").focus();
                    e.preventDefault();
                }
            });
        });
        this.ele.find(".btn-close").on("focusout", e => {
            $(document).off('keydown.modal');
        });
        this.ele.find(".modal-body").on("focusout", e => {
            $(document).off('keydown.modal');
        });
        this.ele.find(".modal-body").attr("tabindex", 0).focus();        
    }
    
    hide () {
        this.ele.trigger('modal-hide');
        this.ele.addClass('d-none');
        this.ele.find(".btn-close").off("click");
        this.ele.find(".modal-close").off("click");
        $("#wrap, .guide-wrap").removeAttr('inert');
        $("body").css({'overflow': ''});
        $(document).off('keydown.modal');
        this.ele.empty();
        $(`*[data-modal-target="#${this.ele.attr('id')}"]`).focus();
    }

}

$.fn.modal = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('modal');
        var options =  $.extend({}, Modal.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('modal', (data = new Modal($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.modal.Constructor = Modal;