class Tabmenu {

    static DEFAULT_PROPS = {
        vote: false
    }

    constructor(ele, props) {
        this.ele = ele;
        this.props = props;
        this.scrollSpeed = 10;
        this.timer = null;
        this.scrollFlag = false;

        this.init();
    }

    init() {
        const owner = this;

        // 이미 tabmenu-wrap이 있으면 새로 만들지 않음
        if (this.ele.find('.tabmenu-wrap').length === 0) {
            this.ele.append(`<div class="tabmenu-wrap"></div>`);
        }
        const wrap = this.ele.find('.tabmenu-wrap');

        // 탭 이동
        this.ele.find('.tab-menu').each(function (i) {
            $(this).off('click').on('click', () => {
                owner.ele.find('.tab-menu').removeClass('active').removeAttr('title');
                $(this).addClass('active').attr('title','선택됨');
                owner.showTabContent($(this).data('tab'));
                owner.ele.trigger('change', [i]);
            });

            if (!$.contains(wrap[0], this)) {
                wrap.append(this);
            }
        });

        // 버튼 생성 (한 번만)
        if (!this.ele.find('.btn-prev').length) {
            this.ele.append(`
                <a href="javascript:void(0);" class="btn-prev">
                    <i class="icon btn-arrow-left small"></i>
                </a>
                <a href="javascript:void(0);" class="btn-next">
                    <i class="icon btn-arrow-right small"></i>
                </a>
            `);
        }

        this.ele.find('.btn-next, .btn-prev').hide();
        this.bindScrollButtons();

        // 초기 스크롤 위치 세팅
        const activeTab = this.ele.find('.tab-menu.active').position();
        if (activeTab) wrap.scrollLeft(activeTab.left - 15);

        // 초기 탭 콘텐츠 숨기고 active만 보여주기
        this.hideAllTabContents();
        const firstActive = this.ele.find('.tab-menu.active').data("tab");
        if (firstActive) this.showTabContent(firstActive);

        // 리사이즈 이벤트
        $(window).off('resize.tabmenu').on('resize.tabmenu', () => this.onResize());
        // 모바일 렌더링 오차 대비
        setTimeout(() => this.onResize(), 50);
        this.onResize();
    }

    bindScrollButtons() {
        const startScroll = (val) => { this.timer = setInterval(() => this.moveScroll(val), 1000 / 60); };
        const endScroll = () => clearInterval(this.timer);

        this.ele.find('.btn-prev').off('mousedown touchstart').on('mousedown touchstart', e => {
            startScroll(-this.scrollSpeed);
            e.preventDefault();
        });
        this.ele.find('.btn-next').off('mousedown touchstart').on('mousedown touchstart', e => {
            startScroll(this.scrollSpeed);
            e.preventDefault();
        });

        $(window).off('mouseup touchend').on('mouseup touchend', endScroll);
    }

    hideAllTabContents() {
        this.ele.find('.tab-menu').each(function () {
            const tabName = $(this).data("tab");
            $(`.${tabName}`).hide();
        });
    }

    showTabContent(tabName) {
        this.hideAllTabContents();
        $(`.${tabName}`).show();
    }

    onResize() {
        const wrapW = this.getWrapWidth();
        const scrollW = this.getScrollWidth();
        const isScrollable = scrollW > wrapW + 2;

        if (!isScrollable) {
            this.ele.find('.btn-prev, .btn-next').hide();
            this.ele.find('.tabmenu-wrap').off('scroll');
            this.scrollFlag = false;
            return;
        }

        if (!this.scrollFlag) {
            this.ele.find('.tabmenu-wrap').on('scroll', () => this.onScroll());
        }

        this.onScroll();
        this.scrollFlag = true;
    }

    onScroll() {
        const wrap = this.ele.find('.tabmenu-wrap');
        const left = wrap.scrollLeft();
        const max = this.getScrollWidth() - this.getWrapWidth();

        if (left <= 2) {
            this.ele.find('.btn-prev').hide();
            this.ele.find('.btn-next').show();
        } else if (left >= max - 2) {
            this.ele.find('.btn-next').hide();
            this.ele.find('.btn-prev').show();
        } else {
            this.ele.find('.btn-prev, .btn-next').show();
        }
    }

    moveScroll(val) {
        const wrap = this.ele.find('.tabmenu-wrap');
        wrap.scrollLeft(wrap.scrollLeft() + val);
    }

    getScrollWidth() {
        let width = 0;
        this.ele.find('.tab-menu').each((i, el) => { width += el.offsetWidth; });
        return width;
    }

    getWrapWidth() {
        return this.ele.find('.tabmenu-wrap')[0].offsetWidth;
    }

    clickVote(idx) {
        this.ele.find('.tab-menu').removeClass('active').each(function(i){
            if(i<=idx) $(this).addClass('active');
        });
    }

    destroy() {
        this.ele.find('.tab-menu').off('click');
        this.ele.find('.btn-prev, .btn-next').off();
        this.ele.find('.tabmenu-wrap').off('scroll');
        $(window).off('resize.tabmenu');
    }
}

$.fn.tabmenu = function(option, params) {
    return this.each(function () {
        var $this = $(this);
        var instance = $this.data('tabmenu');
        var options = $.extend({}, Tabmenu.DEFAULT_PROPS, typeof option === "object" && option);

        if (!instance || typeof instance === 'string') {
            $this.data('tabmenu', (instance = new Tabmenu($this, options)));
        }

        if (typeof option === 'string') instance[option](params);
    });
};
$.fn.tabmenu.Constructor = Tabmenu;