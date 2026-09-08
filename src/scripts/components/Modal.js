class Modal {
    static DEFAULT_PROPS = {};

    constructor(ele, props) {
        this.ele = ele;
        this.props = props;
        this.init();
        this.scrollWidth = 0;
    }

    init() {
        this.ele.find(".modal-wrap").append(
            `<button type="button" class="btn-close" id="popup-default-close" title="레이어팝업 닫기">
                <i class="icon close"></i>
                <span class="sr-only">닫기</span>                     
            </button>`
        );
        this.copyHtml = this.ele.html();
        $("body").append(this.ele);
        this.ele.empty();
    }

    lockBodyScroll() {
        /**
         * , allmenu 열렸을때 || body에 스크롤 있을때 && body에 overflow auto 걸려있을때 header에 패딩줘야함.
         */

        if (!scW) scW = getScrollBarWidth();

        const $body = $("body");

        const headPdCon1 = $(".allmenu").hasClass("active");

        // 전체메뉴 펼쳤을때
        if (headPdCon1) {
            $body.css("padding-right", 0);
            $("body,html").css({ overflow: "hidden" });
            $("#header").css("padding-right", scW);

            return;
        }

        $body.css("padding-right", scW);
        $body.data("modal-padding-right", $body.css("padding-right"));

        $("body,html").css({ overflow: "hidden" });
    }

    unlockBodyScroll() {
        if (!scW) scW = getScrollBarWidth();

        const $body = $("body");

        const headPdCon1 = $(".allmenu").hasClass("active");
        const headPdCon2 = $("body").css("overflow") === "auto" && window.innerWidth - document.body.getBoundingClientRect().width > 0;

        // 전체메뉴 펼쳐져있는상태
        if (headPdCon1) {
            $body.css("padding-right", 0);
            $("#header").css("padding-right", scW);

            return;
        }

        // 전체메뉴 펼치지 않고 body에 스크롤 있는 상태
        if (!headPdCon1 && headPdCon2) {
            $body.css("padding-right", 0);
            $body.data("modal-padding-right", $body.css("padding-right"));
            $("#header").css("padding-right", 0);
        }

        $("body,html").css({ overflow: "auto" });
    }

    show() {
        this.ele.empty().append(this.copyHtml);
        this.ele.removeClass("d-none");

        this.lockBodyScroll();

        const modalWidth = this.ele.find(".modal-wrap").outerWidth();

        if (modalWidth <= 766) {
            // 767 미만
            this.ele.find(".board-top div.top-txt").hide();
        } else {
            // 767 이상
            this.ele.find(".board-top div.top-txt").show();
        }

        // gsap.set(this.ele.find(".modal-wrap"), {scale: 0.9, opacity: 0});
        // gsap.to(this.ele.find(".modal-wrap"), 0.4, {delay:0.1, scale: 1, opacity: 1, ease: Back.easeOut, onComplete: () => {
        this.ele.trigger("modal-show");

        var seachInp = $(".wrap-search-area input");
        var deleteBtn = $(".wrap-search-area button.sch-delete");

        if (seachInp.val()) {
            deleteBtn.show();
        } else {
            deleteBtn.hide();
        }
        // }});

        this.ele.find(".btn-close").on("click", () => {
            this.hide();
            //아이디 modalAlert가 있을경우 실행되는 이벤트
            $("#modalAlert").remove();
        });
        this.ele.find(".modal-close").on("click", () => {
            this.hide();
        });

        if (this.ele.attr("id") === "homepage" || this.ele.attr("id") === "customs" || this.ele.attr("id") === "in-search") {
            // $("body").css({ 'overflow': 'auto' });
            $("#homepage,#customs").hide();
            //this.ele.show();
            this.ele.removeClass("d-none");
            this.ele.removeAttr("style");
        }

        if (this.ele.attr("id") === "in-search") {
            $("body").css({ overflow: "hidden" });
            // $(window).resize(function(){
            //     $("body").css({'overflow': 'hidden'});
            // })
        }

        //관련누리집, 세관 바로가기 클릭하면 닫기
        $(".footer-quick-pop a").click(function () {
            $("body").css({ overflow: "auto" });
            $("#homepage,#customs").hide();
            //this.ele.show();
            this.ele.removeClass("d-none");
            this.ele.removeAttr("style");
        });

        this.ele.find(".btn-close").on("focusin", (e) => {
            $(document).on("keydown.modal", (e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                    this.ele.find(".modal-wrap").focus();
                    e.preventDefault();
                }
            });
        });
        this.ele.find(".modal-wrap").on("focusin", (e) => {
            $(document).on("keydown.modal", (e) => {
                if (e.key === "Tab" && e.shiftKey) {
                    if ($(document.activeElement).is(this.ele.find(".modal-wrap"))) {
                        this.ele.find(".btn-close").focus();
                        e.preventDefault();
                    }
                }
            });
        });
        this.ele.find(".btn-close").on("focusout", (e) => {
            $(document).off("keydown.modal");
        });
        this.ele.find(".modal-wrap").on("focusout", (e) => {
            $(document).off("keydown.modal");
        });
        this.ele.find("*").removeAttr("tabindex");
        this.ele.find(".modal-wrap").attr("tabindex", 0).focus();
    }

    hide() {
        this.ele.trigger("modal-hide");
        this.ele.addClass("d-none");
        this.ele.find(".btn-close").off("click");
        this.ele.find(".modal-close").off("click");
        $("#wrap, .guide-wrap").removeAttr("inert");
        this.unlockBodyScroll();
        $(document).off("keydown.modal");
        this.ele.empty();
        $(`*[data-modal-target="#${this.ele.attr("id")}"]`).focus();

        $("body").removeData("modal-padding-right");
        $("body").css("padding-right", "0");
    }
}

$.fn.modal = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data("modal");
        var options = $.extend({}, Modal.DEFAULT_PROPS, typeof option == "object" && option);
        if (!data || typeof data == "string") $this.data("modal", (data = new Modal($this, options)));
        if (typeof option == "string") data[option](params);
    });
};
$.fn.modal.Constructor = Modal;