$(() => {
    var isEn = document.documentElement.lang === "en";

    //공지사항
    $(function () {
        var btn = $(".main .box2 .notice-box .area .tit");

        btn.click(function () {
            var th = $(this);
            var box = $(".main .box2 .notice-box .area");
            box.removeClass("on");
            btn.removeAttr("title");
            th.closest(box).addClass("on");
            th.attr("title", "선택됨");
        });
    });

    $(function () {
        var btn = $(".main .box1 .cont-box .wrap-mobile-list .more button");

        if ($(".main .box1 .cont-box .wrap-mobile-list ul li").length <= 6) {
            $(".main .box1 .cont-box .wrap-mobile-list .more").hide();
        } else {
            $(".main .box1 .cont-box .wrap-mobile-list .more").show();
        }

        btn.click(function () {
            if ($(this).hasClass("close")) {
                $(this).closest(".wrap-mobile-list").addClass("active");
                $(this).removeClass("close");
                $(this).addClass("open");

                if (isEn === true) {
                    $(this).attr("title", "Open Menu");
                    $(this).attr("aria-label", "Open Menu");
                    $(this).text("Show More");
                } else {
                    $(this).attr("title", "메뉴열기");
                    $(this).attr("aria-label", "메뉴열기");
                    $(this).text("더보기");
                }
            } else {
                // console.log('열기');
                $(this).closest(".wrap-mobile-list").removeClass("active");
                $(this).removeClass("open");
                $(this).addClass("close");

                if (isEn === true) {
                    $(this).attr("title", "Close Menu");
                    $(this).attr("aria-label", "Close Menu");
                    $(this).text("Show Less");
                } else {
                    $(this).attr("title", "메뉴닫기");
                    $(this).attr("aria-label", "메뉴닫기");
                    $(this).text("접기");
                }
            }
        });
    });

    //개인통관고유부호 복사
    $(function () {
        var btn = $(".main .box1 .cont-box .login-box.logout[class*=-chtxt] .txt-box .txt-area a");

        btn.click(function () {
            if (lang == "kr") {
                var html = `<p class="copy-txt">개인통관고유부호가 복사되었습니다</p>`;
            } else {
                var html = `<p class="copy-txt">PCCC has been copied</p>`;
            }

            $(this).after(html);

            setTimeout(function () {
                $(".copy-txt").remove();
            }, 3000);
        });
    });

    var slideSpeed = 3000;
    const listSlideEl = document.querySelector("#list-slide");
    const imageSlideEl = document.querySelector("#images-slide");
    let swiper1 = null;
    let swiper2 = null;
    let originalCount = 0;
    let shouldCloneSlides = false;
    let canUseLoop = false;
    let canUseImageLoop = false;
    let smallListActiveIndex = 0;
    let smallListAutoplayTimer = null;
    let $wrapper = null;
    let $slides = null;

    function isSlideAreaVisible() {
        const $slideArea = $('.main .box1 .cont-box .wrap-slide-box');
        return $slideArea.length > 0 && $slideArea.is(':visible');
    }

    //화면 리사이즈 했을때 액션 슬라이드 꼬임 방지
    function syncToActiveSlide() {
        if (!swiper1 || swiper1.destroyed) return;

        const $slides = $(".slide-area1 .swiper-slide");
        let $activeSlide = $slides.filter(".on").first();

        if ($activeSlide.hasClass("swiper-slide-duplicate")) {
            const realIndex = $activeSlide.attr("data-swiper-slide-index");
            $activeSlide = $slides
                .not(".swiper-slide-duplicate")
                .filter('[data-swiper-slide-index="' + realIndex + '"]')
                .first();
        }

        if (!$activeSlide.length) {
            $activeSlide = $slides.eq(0);
        }

        const slideIndex = $activeSlide.attr("data-swiper-slide-index");
        const index = slideIndex !== undefined ? Number(slideIndex) : $activeSlide.index();
        const tabBtn = $activeSlide.attr("data-btn");
        const box = $(".main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont");

        // Swiper 위치 동기화
        swiper1.slideToLoop(index, 0, true);
        swiper1.update();

        // UI 정리
        $slides.removeClass("on").removeAttr("title");
        $activeSlide.addClass("on").attr("title", "선택됨");

        box.removeClass("on");
        $("#" + tabBtn).addClass("on");
    }

    //액션 슬라이드 리스트 클릭
    var tabBox = $(".slide-area1 .swiper-slide-active").attr("data-btn");

    $("#" + tabBox).addClass("on");
    $(".slide-area1 .swiper-slide-active").addClass("on");
    $(".slide-area1").attr("tabindex", "0");

    $(document).on("click focus", ".slide-area1 .swiper-slide", function () {
        var slideIndex = $(this).attr("data-swiper-slide-index");
        var slideLoop = slideIndex !== undefined ? Number(slideIndex) : $(this).index();
        if (originalCount <= 3) smallListActiveIndex = slideLoop;
        var tabBtn = $(this).attr("data-btn");
        var box = $(".main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont");

        $(".main .box1 .cont-box .wrap-slide-box .slide-box .swiper-slide").removeAttr("title");
        $(this).attr("title", "선택됨");

        $(".slide-area1 .swiper-slide").removeClass("on");
        $(this).addClass("on");

        box.removeClass("on");
        $("#" + tabBtn).addClass("on");

        swiper1.slideToLoop(slideLoop, 0, true);
        stopSwiper1Autoplay();
        $(".slide-area1 .swiper-stop").addClass("on");
    });

    $(".slide-area1 .swiper").on("mouseenter", function () {});

    // $('.slide-area1 .swiper').on('mouseleave', function() {
    //     console.log('마우스 벗어남');
    //     swiper1.autoplay.start();
    //     $('.slide-area1 .swiper-stop').removeClass('on')
    // });

    // Tab 키로 슬라이드 제어
    $(document).on("keydown", function (e) {
        if (e.key === "Tab") {
            // 현재 포커스가 slide-area1 내부 요소인지 확인
            if ($(":focus").closest(".slide-area1").length) {
                // 슬라이드 정지
                stopSwiper1Autoplay();
                $(".slide-area1 .swiper-stop").addClass("on").text("재생");
            } else {
                // slide-area1 벗어나면 재생
                startSwiper1Autoplay();
                $(".slide-area1 .swiper-stop").removeClass("on").text("정지");
            }
        }
    });

    if (listSlideEl) {
        $wrapper = $(listSlideEl).find(".swiper-wrapper");
        $slides = $wrapper.children(".swiper-slide");
        originalCount = $slides.length;
        shouldCloneSlides = originalCount > 3 && originalCount <= 7;
        canUseLoop = originalCount > 3 && isSlideAreaVisible();

        // 4~7개일 때만 한 번 복제해 loop에 필요한 개수를 확보
        if (shouldCloneSlides) {
            for (let i = 0; i < originalCount; i++) {
                $wrapper.append($slides.eq(i).clone());
            }
        }
    }

    // 모든 항목이 화면에 보이는 경우 위치는 고정하고 활성 항목만 순환
    function moveSmallListActiveSlide(step = 1) {
        if (originalCount <= 1 || originalCount > 3) return;

        smallListActiveIndex = (smallListActiveIndex + step + originalCount) % originalCount;

        const $activeSlide = $slides.eq(smallListActiveIndex);
        const tabBtn = $activeSlide.attr("data-btn");
        const $tabContents = $(".main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont");

        $slides.removeClass("on").removeAttr("title");
        $activeSlide.addClass("on").attr("title", "선택됨");
        $tabContents.removeClass("on");
        $("#" + tabBtn).addClass("on");
    }

    // 3개 이하는 위치를 움직이지 않고 활성 항목만 일정 시간마다 변경
    function startSwiper1Autoplay() {
        if (!swiper1 || swiper1.destroyed || !isSlideAreaVisible()) return;

        if (canUseLoop) {
            swiper1.autoplay.start();
            return;
        }

        if (originalCount <= 1 || smallListAutoplayTimer) return;

        smallListAutoplayTimer = window.setInterval(function () {
            moveSmallListActiveSlide();
        }, slideSpeed);
    }

    function stopSwiper1Autoplay() {
        if (!swiper1 || swiper1.destroyed) return;

        if (!isSlideAreaVisible()) {
            window.clearInterval(smallListAutoplayTimer);
            smallListAutoplayTimer = null;
            return;
        }

        if (canUseLoop) {
            swiper1.autoplay.stop();
            return;
        }

        window.clearInterval(smallListAutoplayTimer);
        smallListAutoplayTimer = null;
    }

    $(document).on("click", ".slide-area1 .swiper-button-next", function () {
        moveSmallListActiveSlide(1);
    });

    $(document).on("click", ".slide-area1 .swiper-button-prev", function () {
        moveSmallListActiveSlide(-1);
    });

    setTimeout(function () {
        $(".swiper-wrapper > .swiper-slide-active").addClass("on");
        $(".swiper-wrapper > .swiper-slide-active").attr("title", "선택됨");
    }, 1);

    //액션 슬라이드
    if (listSlideEl) {
        swiper1 = new Swiper(listSlideEl, {
            slidesPerView: "auto",
            spaceBetween: 14,
            direction: "vertical",
            autoHeight: true,
            loop: canUseLoop,
            observer: true,
            observeParents: true,
            watchOverflow: false,
            loopAdditionalSlides: 1,
            watchSlidesProgress: true,
            // loopedSlides: originalCount * 2,
            resizeObserver: true,
            autoplay: isSlideAreaVisible()
                ? {
                      delay: slideSpeed,
                      disableOnInteraction: false
                  }
                : false,
            pagination: {
                el: ".slide-area1 .swiper-pagination",
                clickable: false,
                type: "bullets"
            },
            navigation: {
                nextEl: ".slide-area1 .swiper-button-next",
                prevEl: ".slide-area1 .swiper-button-prev"
            },
            on: {
                slideNextTransitionStart: function () {
                    var tabBtn = $(".slide-area1 .swiper-slide.swiper-slide-active").attr("data-btn");
                    var box = $(".main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont");

                    $(".slide-area1 .swiper-slide").removeAttr("title");
                    $(".slide-area1 .swiper-slide").removeClass("on");
                    $(".slide-area1 .swiper-slide.swiper-slide-active").addClass("on");
                    $(".slide-area1 .swiper-slide.swiper-slide-active").attr("title", "선택됨");
                    box.removeClass("on");
                    $("#" + tabBtn).addClass("on");

                    const slides = swiper1.slides;
                    const positions = [0]; // 첫 슬라이드 위치

                    for (let i = 1; i < slides.length; i++) {
                        const prevSlide = slides[i - 1];
                        const style = window.getComputedStyle(prevSlide);
                        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
                        positions[i] = positions[i - 1] + prevSlide.offsetHeight + margin - 0.5;
                    }

                    swiper1.wrapperEl.style.transform = `translate3d(0px, -${positions[swiper1.activeIndex]}px, 0px)`;
                },
                slidePrevTransitionEnd: function () {
                    var tabBtn = $(".slide-area1 .swiper-slide.swiper-slide-active").attr("data-btn");
                    var box = $(".main .box1 .cont-box .wrap-slide-box .slide-show-box .tab-cont");

                    $(".slide-area1 .swiper-slide").removeAttr("title");
                    $(".slide-area1 .swiper-slide").removeClass("on");
                    $(".slide-area1 .swiper-slide.swiper-slide-active").addClass("on");
                    $(".slide-area1 .swiper-slide.swiper-slide-active").attr("title", "선택됨");
                    box.removeClass("on");
                    $("#" + tabBtn).addClass("on");
                }
            }
        });
    }

    let resizeTimer = null;

    $(window).on("resize orientationchange", function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            syncToActiveSlide();

            // 리사이즈 끝나면 다시 자동재생
            startSwiper1Autoplay();
        }, 1);
    });

    $(window).on("load", function () {
        $(".swiper-wrapper > .swiper-slide.swiper-slide-active").addClass("on");
        $(".swiper-wrapper > .swiper-slide.swiper-slide-active").attr("title", "선택됨");
    });

    if (swiper1) {
        swiper1.on("init", function () {
            syncToActiveSlide();
        });
    }

    //이미지슬라이드
    let imageSlideCount = 0;

    if (imageSlideEl) {
        imageSlideCount = imageSlideEl.querySelectorAll(".swiper-slide").length;
        const $imageSlideArea = $(imageSlideEl).closest(".wrap-slide-area");
        canUseImageLoop =
            imageSlideCount > 1 &&
            !$imageSlideArea.hasClass("no-image") &&
            !$imageSlideArea.hasClass("main-no-image") &&
            $imageSlideArea.is(":visible");

        swiper2 = new Swiper(imageSlideEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: canUseImageLoop,
            a11y: true,
            observer: true,
            observeParents: true,
            watchOverflow: false,
            autoplay:
                canUseImageLoop
                    ? {
                          delay: slideSpeed,
                          disableOnInteraction: false
                      }
                    : false,
            pagination:
                canUseImageLoop
                    ? {
                          el: ".slide-area2 .swiper-pagination",
                          clickable: true,
                          type: "fraction"
                      }
                    : false,
            navigation: {
                nextEl: ".slide-area2 .swiper-button-next",
                prevEl: ".slide-area2 .swiper-button-prev"
            },
            on: {
                init: function () {
                    $(".slide-area2").attr("tabindex", "0");

                    // Tab 키로 slide-area2 제어
                    $(document).on("keydown", function (e) {
                        if (e.key === "Tab") {
                            // 현재 포커스가 slide-area2 내부 요소인지 확인
                            if ($(":focus").closest(".slide-area2").length) {
                                // 슬라이드 정지
                                this.autoplay.stop();
                                $(".slide-area2 .swiper-stop").addClass("on").text("재생");
                            } else {
                                // slide-area2 벗어나면 재생
                                this.autoplay.start();
                                $(".slide-area2 .swiper-stop").removeClass("on").text("정지");
                            }
                        }
                    });

                    // slide-area2 내부 슬라이드 항목 포커스 이동 시 해당 슬라이드로 이동
                    $(".slide-area2 .swiper-slide").on("focus", function () {
                        if (window.event && window.event instanceof KeyboardEvent) {
                            // 키보드 입력인지 확인
                            var slideIndex = $(this).attr("data-swiper-slide-index");
                            this.slideToLoop(Number(slideIndex), 0, true);
                        }
                    });
                }
            }
        });
    }

    // 화면 최초 로드 시 자동 슬라이드
    setTimeout(function(){
        if (swiper1) {
            swiper1.update();
            startSwiper1Autoplay();
        }
    },300)

    // 공통 play/pause 처리
    $(".swiper-stop").click(function () {
        const $btn = $(this);
        const isFirstSlide = $btn.closest(".slide-area1").length > 0;
        const targetSwiper = isFirstSlide ? swiper1 : swiper2;

        if (!isFirstSlide && !targetSwiper) return;

        if ($btn.hasClass("on")) {
            // 현재 정지 상태 → 재생 시작
            $btn.removeClass("on").text("정지").attr("title", "슬라이드 정지");
            if (isFirstSlide) {
                startSwiper1Autoplay();
            } else {
                targetSwiper.autoplay.start();
            }
        } else {
            // 현재 재생 상태 → 정지
            $btn.addClass("on").text("재생").attr("title", "슬라이드 재생");
            if (isFirstSlide) {
                stopSwiper1Autoplay();
            } else {
                targetSwiper.autoplay.stop();
            }
        }
    });

    $(".swiper-stop").attr({
        title: "슬라이드 정지"
    });

    $(".swiper-button-next").attr({
        title: "다음 슬라이드"
    });
    $(".swiper-button-prev").attr({
        title: "이전 슬라이드"
    });
});
