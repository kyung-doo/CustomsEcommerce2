
class Pagination {

    static DEFAULT_PROPS = {
        viewCount: 9,
        totalPages: 1,
        initPage: 1,
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.page = this.props.initPage;
        this.viewCount = $(window).width() > 767 ? this.props.viewCount : 3;
        this.mode = $(window).width() > 767 ? 'pc' : 'mobile';
        this.init();
    }

    init () {
        this.ele.append(`
            <button class="page-navi prev">이전</button>
            <div class="page-links"></div>
            <button class="page-navi next">다음</button>
        `);
        this.ele.find('.page-navi.prev').on('click', () => {
            if(this.page > 1) {
                this.page--;
                this.renderPage ();
                this.ele.trigger('change', [this.page]);
            }
        });
        this.ele.find('.page-navi.next').on('click', () => {
            if(this.page < this.props.totalPages) {
                this.page++;
                this.renderPage ();
                this.ele.trigger('change', [this.page]);
            }
        });
        $(window).on('resize.pagination', () => {
            if(this.mode === 'pc') {
                if($(window).width() < 767) {
                    this.mode = 'mobile';
                    this.viewCount = 3;
                    this.renderPage();
                }
            } else {
                if($(window).width() > 767) {
                    this.mode = 'pc';
                    this.viewCount = this.props.viewCount;
                    this.renderPage();
                }
            }   
        });
        this.renderPage();
    }

    renderPage () {
        this.ele.find('.page-link').off('click');
        this.ele.find('.page-links').empty();
        if(this.page === 1) {
            this.ele.find('.page-navi.prev').attr('disabled', 'disabled');
            this.ele.find('.page-navi.next').removeAttr('disabled');
        } else if(this.page === this.props.totalPages) {
            this.ele.find('.page-navi.prev').removeAttr('disabled');
            this.ele.find('.page-navi.next').attr('disabled', 'disabled');
        } else {
            this.ele.find('.page-navi.prev').removeAttr('disabled');
            this.ele.find('.page-navi.next').removeAttr('disabled');
        }
        if(this.props.totalPages < this.viewCount) {
            for(let i = 1; i<=this.props.totalPages; i++) {
                if(i === this.page) {
                    this.ele.find('.page-links').append(`<a class="page-link active" data-page="${i}" href="javascript: void(0);"><span class="sr-only">현재페이지 </span>${i}</a>`)
                } else {
                    this.ele.find('.page-links').append(`<a class="page-link" data-page="${i}" href="javascript: void(0);">${i}</a>`)
                }
            }
        } else {
            const count = Math.min(this.viewCount, this.props.totalPages);
            if(this.page <= Math.ceil(count/2)) {
                for(let i = 1; i<=count; i++) {
                    if(i === this.page) {
                        this.ele.find('.page-links').append(`<a class="page-link active" data-page="${i}" href="javascript: void(0);"><span class="sr-only">현재페이지 </span>${i}</a>`)
                    } else {
                        this.ele.find('.page-links').append(`<a class="page-link" data-page="${i}" href="javascript: void(0);">${i}</a>`)
                    }
                }
                this.ele.find('.page-links').append(`<span class="page-link link-dot"></span>`);
                this.ele.find('.page-links').append(`<a class="page-link" data-page="${this.props.totalPages}" href="javascript: void(0);">${this.props.totalPages}</a>`);
            } else if(this.page > this.props.totalPages - Math.ceil(count/2)) {
                this.ele.find('.page-links').append(`<a class="page-link" data-page="1" href="javascript: void(0);">1</a>`);
                this.ele.find('.page-links').append(`<span class="page-link link-dot"></span>`);
                for(let i = this.props.totalPages - this.viewCount + 1; i<=this.props.totalPages; i++) {
                    if(i === this.page) {
                        this.ele.find('.page-links').append(`<a class="page-link active" data-page="${i}" href="javascript: void(0);"><span class="sr-only">현재페이지 </span>${i}</a>`)
                    } else {
                        this.ele.find('.page-links').append(`<a class="page-link" data-page="${i}" href="javascript: void(0);">${i}</a>`)
                    }
                }
            } else {
                const minusNum = this.page - Math.ceil(count/2) + 1
                this.ele.find('.page-links').append(`<a class="page-link" data-page="1" href="javascript: void(0);">1</a>`);
                this.ele.find('.page-links').append(`<span class="page-link link-dot"></span>`);
                for(let i = minusNum; i<count+minusNum; i++) {
                    if(i === this.page) {
                        this.ele.find('.page-links').append(`<a class="page-link active" data-page="${i}" href="javascript: void(0);"><span class="sr-only">현재페이지 </span>${i}</a>`)
                    } else {
                        this.ele.find('.page-links').append(`<a class="page-link" data-page="${i}" href="javascript: void(0);">${i}</a>`)
                    }
                }
                this.ele.find('.page-links').append(`<span class="page-link link-dot"></span>`);
                this.ele.find('.page-links').append(`<a class="page-link" data-page="${this.props.totalPages}" href="javascript: void(0);">${this.props.totalPages}</a>`);
            } 
        }
        const owner = this;
        this.ele.find('.page-link:not(.link-dot)').each(function () {
            if(owner.mode === 'mobile') {
                $(this).addClass('mobile-link');
            }
        });
        this.ele.find('.page-link:not(.link-dot)').off('click').on('click', function () {
            owner.page = $(this).data('page');
            owner.renderPage();
            owner.ele.trigger('change', [owner.page]);
        });
    }

    setPage( value ) {
        this.page = value[0];
        this.props.totalPages = value[1];
        this.renderPage();
    }
}

$.fn.pagination = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('pagination');
        var options =  $.extend({}, Pagination.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('pagination', (data = new Pagination($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.pagination.Constructor = Pagination;