import $ from 'jquery';


class Tabmenu {

    static DEFAULT_PROPS = {
        vote: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.init();
    }

    init () {
        var owner = this;
        this.ele.find('.tab-menu').each(function ( i ) {
            $(this).on('click', () => {
                if(!owner.props.vote) {
                    owner.ele.find('.tab-menu').removeClass('active');
                    $(this).addClass('active');
                    owner.ele.trigger('change', [i]);
                } else {
                    owner.clickVote(i);
                }
            });
        });
    }

    clickVote ( idx ) {
        this.ele.find('.tab-menu').removeClass('active').each(function ( i ) {
            if(i <= idx) {
                $(this).addClass('active');
            }
        });
    }
    
    destroy () {
        this.ele.find('.tab-menu').off('click');
    }

}

$.fn.tabmenu = Plugin;
$.fn.tabmenu.Constructor = Tabmenu;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('tabmenu');
        var options =  $.extend({}, Tabmenu.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('tabmenu', (data = new Tabmenu($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}