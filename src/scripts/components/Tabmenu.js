import $ from 'jquery';


class Tabmenu {

    static DEFAULT_PROPS = {
        vote: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.scrollFlag;
        this.scrollSpeed = 10;
        this.timer = null;
        this.init();
    }

    init () {
        var owner = this;
        this.ele.append(`<div class="tabmenu-wrap"></div>`);
        this.ele.find('.tab-menu').each(function ( i ) {
            $(this).on('click', () => {
                if(!owner.props.vote) {
                    owner.ele.find('.tab-menu').removeClass('active');
                    owner.ele.find('.tab-menu').removeAttr('title');
                    $(this).addClass('active');
                    $(this).attr('title','선택됨')
                    owner.ele.trigger('change', [i]);
                } else {
                    owner.clickVote(i);
                }
            });
            owner.ele.find('.tabmenu-wrap').append($(this));
        });

        this.ele.append(`
            <a href="javascript: void(0);" class="btn-prev">
                <i class="icon btn-arrow-left small"></i>
            </a>
            <a href="javascript: void(0);" class="btn-next">
                <i class="icon btn-arrow-right small"></i>
            </a>
        `);

        this.ele.find('.btn-next').hide();
        this.ele.find('.btn-prev').hide();

        this.ele.find('.btn-prev').on('touchstart', ( e ) => {
            this.timer = setInterval(() => {
                this.moveScroll(-this.scrollSpeed);
            }, 1000 / 60);
            e.preventDefault();
        });
        this.ele.find('.btn-prev').on('touchend', ( e ) => {
            clearInterval(this.timer);
            e.preventDefault();
        });

        this.ele.find('.btn-next').on('touchstart', ( e ) => {
            this.timer = setInterval(() => {
                this.moveScroll(this.scrollSpeed);
            }, 1000 / 60);
            e.preventDefault();
        });
        this.ele.find('.btn-next').on('touchend', ( e ) => {
            clearInterval(this.timer);
            e.preventDefault();
        });

        this.ele.find('.btn-prev').hide().on('mousedown', ( e ) => {
            this.timer = setInterval(() => {
                this.moveScroll(-this.scrollSpeed);
            }, 1000 / 60);
            e.preventDefault();
            $(window).one('mouseup', ( e ) => {
                clearInterval(this.timer);
                e.preventDefault();
            });
        });

        this.ele.find('.btn-next').hide().on('mousedown', ( e ) => {
            this.timer = setInterval(() => {
                this.moveScroll(this.scrollSpeed);
            }, 1000 / 60);
            e.preventDefault();
            $(window).one('mouseup', ( e ) => {
                clearInterval(this.timer);
                e.preventDefault();
            });
        });
        

        this.scrollFlag = this.getWrapWidth() === this.getScrollWidth();
        owner.ele.find('.tabmenu-wrap').scrollLeft(this.ele.find('.tab-menu.active').position().left - 15);
        $(window).on('resize.tabmenu', () => this.onResize());
        this.onResize();
    }

    onResize () {
        if(this.getWrapWidth() === this.getScrollWidth()) {
            if(this.scrollFlag) {
                this.ele.find('.tabmenu-wrap').off('scroll');
                this.ele.find('.btn-next').hide();
                this.ele.find('.btn-prev').hide();
            }
            this.scrollFlag = false;
        } else {
            if(!this.scrollFlag) {
                if(parseInt(this.ele.find('.tabmenu-wrap').scrollLeft()) <= 2) {
                    this.ele.find('.btn-next').show();
                } else if(parseInt(this.ele.find('.tabmenu-wrap').scrollLeft()) >= parseInt(this.getScrollWidth() - this.ele.width()) - 2) {
                    this.ele.find('.btn-prev').show();
                } else {
                    this.ele.find('.btn-next').show();
                    this.ele.find('.btn-prev').show();
                }
                this.ele.find('.tabmenu-wrap').on('scroll', () => this.onScroll());
            }
            this.scrollFlag = true;
        }
    }

    onScroll () {
        if(parseInt(this.ele.find('.tabmenu-wrap').scrollLeft()) <= 2) {
            this.ele.find('.btn-prev').hide();
        } else if(parseInt(this.ele.find('.tabmenu-wrap').scrollLeft()) >= parseInt(this.getScrollWidth() - this.ele.width()) - 2) {
            this.ele.find('.btn-next').hide();
        } else {
            this.ele.find('.btn-next').show();
            this.ele.find('.btn-prev').show();
        }
    }

    moveScroll ( val ) {
        let left = this.ele.find('.tabmenu-wrap').scrollLeft();
        this.ele.find('.tabmenu-wrap').scrollLeft(left + val);
    }

    getScrollWidth () {
        let owner = this;
        let width = 0;
        this.ele.find('.tab-menu').each(function () {
            if(owner.ele.hasClass('tabmenu-bg1')) {
                width += $(this)[0].getBoundingClientRect().width-1;
            } else {
                width += $(this)[0].getBoundingClientRect().width;
            }
        })
        return Math.round(width);
    }

    getWrapWidth () {
        return Math.round(this.ele.find('.tabmenu-wrap')[0].getBoundingClientRect().width);
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
        this.ele.find('.btn-prev').off('mousedown touchstart mouseup touchend');
        this.ele.find('.btn-next').off('mousedown touchstart mouseup touchend');
        this.ele.find('.tabmenu-wrap').off('scroll');
        $(window).on('resize.tabmenu');
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