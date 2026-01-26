
class Datepicker {

    static DEFAULT_PROPS = {
        maxDate: new Date(),
        minDate: null,
        minInput: null,
        maxInput: null,
        isMonth: false,
        target: '',
    }

    static MINIMUM_DATE = new Date('1930-01-01');
    static MAXIMUM_DATE = dayjs().add(30, 'year').month(11).endOf('month').toDate();

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.input = this.ele.find('input');
        this.btn = this.ele.find('.calendar-btn');
        this.btn.attr('type', 'button');
        this.today = new Date();
        this.selectDate = null;
        this.minDate = null;
        this.maxDate = null;
        this.isShow = false;
        this.currentYear = null;
        this.currentMonth = null;

        if(!this.props.maxDate)                     this.props.maxDate = Datepicker.MAXIMUM_DATE;
        else if(this.props.maxDate === 'today')     this.props.maxDate = new Date();
        else                                        this.props.maxDate = new Date(this.props.maxDate);
        
        if(!this.props.minDate) this.props.minDate = Datepicker.MINIMUM_DATE;
        else if(this.props.minDate === 'today')     this.props.minDate = new Date();
        else                    this.props.minDate = new Date(this.props.minDate);        

        this.init();
    }

    init () {

        if(this.input.val()) {
            this.selectDate = new Date(this.input.val());
            this.currentYear = this.selectDate.getFullYear();
            this.currentMonth = this.selectDate.getMonth() + 1;
        } else {
            this.currentYear = new Date().getFullYear();
            this.currentMonth = new Date().getMonth() + 1;
        }

        this.input.on('input', () => {
            let val = this.input.val();
            if(!this.props.isMonth) {
                val = val.replace(/[^0-9-]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
            } else {
                val = val.replace(/[^0-9-]/g, '').replace(/(\d{4})(\d{2})/g, '$1-$2');
            }
            this.input.val(val);
        });

        this.input.on('change', () => {
            //let val = this.input.val();
            let val = this.input.val().replace(/[^0-9]/g, ""); // 숫자만 남김

            if (!this.props.isMonth) {
                // YYYYMMDD (8자리)
                if (val.length === 8) {
                    val = val.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                }
                // YYYYMM  (6자리) → 기본일자 01 삽입
                else if (val.length === 6) {
                    val = val.replace(/(\d{4})(\d{2})/, "$1-$2-01");
                }
            } else {
                // 월 선택 모드(YYYYMM → YYYY-MM)
                if (val.length === 6) {
                    val = val.replace(/(\d{4})(\d{2})/, "$1-$2");
                }
            }

            // input에 반영
            this.input.val(val);

            if (val === '') {
                this.selectDate = null;
                return;
            }

            var title = $('.head-tit').text();            

            if(val === '') {
                this.selectDate = null;
                return;
            }

            var title = $('.head-tit').text();

            if(!this.isValidDate(val)) {
                //alert('올바른 날짜 형식을 입력하세요. (YYYY-MM-DD)');
                //this.input.val('').focus();
                
                ecp_alert(title,ECP_MSG.err_ecp_ko_00031,this.input.val(''));
            } else {
                this.selectDate = new Date(this.input.val());
                if(this.props.isMonth) {
                    this.selectMonth = parseInt(dayjs(this.selectDate).format('YYYYMM'));
                    if(parseInt(dayjs(this.props.maxDate).format('YYYYMM')) < parseInt(dayjs(new Date(val)).format('YYYYMM'))) {
                        // alert('오늘 날짜보다 큰 날짜를 입력 할 수없습니다.');
                        //this.input.val('').focus(); 
                        ecp_alert(title,ECP_MSG.err_ecp_ko_00032,this.input.val(''));
                        return;
                    }
                    
                    if(this.props.minInput && $(this.props.minInput).val()) {
                        this.minMonth = parseInt(dayjs(new Date($(this.props.minInput).val())).format('YYYYMM'));
                        if(this.selectMonth < this.minMonth) {
                            // alert('시작월은 종료월보다 클 수 없습니다.');
                            //this.input.val('').focus(); 
                            ecp_alert(title,ECP_MSG.err_ecp_ko_00033,this.input.val(''));
                        }
                    }

                    if(this.props.maxInput && $(this.props.maxInput).val()) {
                        this.maxMonth = parseInt(dayjs(new Date($(this.props.maxInput).val())).format('YYYYMM'));                        
                        if(this.selectMonth > this.maxMonth) {
                            // alert('종료월은 시작월보다 작을 수 없습니다.');
                            //this.input.val('').focus(); 
                            ecp_alert(title,ECP_MSG.err_ecp_ko_00034,this.input.val(''));
                        }
                    }
                } else {
                    
                    if (dayjs(this.props.maxDate).isSame(dayjs(this.today), 'day') && dayjs(val).isAfter(dayjs(this.props.maxDate), 'day')
                    ) {
                        // alert('오늘 날짜보다 큰 날짜를 입력할 수 없습니다.');
                        // this.input.val('').focus();
                        ecp_alert(title, ECP_MSG.err_ecp_ko_00032, this.input.val(''));
                        return;
                    }

                    if (dayjs(this.props.minDate).isSame(dayjs(this.today), 'day') && dayjs(val).isBefore(dayjs(this.props.minDate), 'day')) {
                        alert('오늘 날짜보다 작은 날짜를 입력할 수 없습니다.');
                        this.input.val('').focus();
                        // ecp_alert(title, ECP_MSG.err_ecp_ko_00035, this.input.val(''));
                        return;
                    }


                    if(this.props.minInput && $(this.props.minInput).val()) {
                        this.minDate = new Date($(this.props.minInput).val());
                        if(this.selectDate < this.minDate) {
                            //alert('시작날짜는 종료날짜보다 클 수 없습니다.');
                            //this.input.val('').focus(); 
                            ecp_alert(title,ECP_MSG.err_ecp_ko_00033,this.input.val(''));
                        }
                    }

                    if(this.props.maxInput && $(this.props.maxInput).val()) {
                        this.maxDate = new Date($(this.props.maxInput).val());
                        if(this.selectDate > this.maxDate) {
                            //alert('종료날짜는 시작날짜보다 작을 수 없습니다.');
                            //this.input.val('').focus(); 
                            ecp_alert(title,ECP_MSG.err_ecp_ko_00034,this.input.val(''));
                        }
                    }
                }
            }
        });            

        this.btn.on('click', (e) => {            
            if(!this.isShow) {                
                this.isShow = true;                
                this.showCalendar();                                
                
            }   
            this.btn.closest('.calendar-form').addClass('on');                             
            
            $('.calendar-blind').show();
        });    
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    isValidDate( dateStr ) {
        if(isNaN(Date.parse(dateStr))) return false;
        if(this.props.isMonth) {
            const [year, month] = dateStr.split('-').map(Number);
            return month >= 1 && month <= 12;
        } else {
            const [year, month, day] = dateStr.split('-').map(Number);
            const maxDays = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return day <= maxDays[month - 1];
        }
    }



    showCalendar () {       
        
        $('*[data-ui="datepicker"]').each(function () {
            $(this).datepicker('hideCalendar');
        });

        this.calendar = $(`
            <div class="datepicker">
                <div class="calendar-wrap">
                    <div class="calendar-header">
                        <button class="btn-prev" tabindex="0">이전</button>
                        <button class=btn-year></button>
                        ${!this.props.isMonth ? '<button class=btn-month></button>': ''}
                        <button class="btn-next">다음</button>
                    </div>
                    <div class="calendar-content" style="min-height: 288px;">
                        ${!this.props.isMonth 
                            ? 
                                `<div class="week-con">
                                <div>일</div>
                                <div>월</div>
                                <div>화</div>
                                <div>수</div>
                                <div>목</div>
                                <div>금</div>
                                <div>토</div>
                                </div>
                                <div class="day-con"></div>` 
                            : 
                                ''
                        }
                        <div class="year-con d-none"></div>
                        <div class="month-con d-none"></div>
                    </div>
                    <div class="calendar-footer">
                        <button type="button" class="btn tertiary medium btn-cancel mr-8">취소</button>
                        <button type="button" class="btn primary medium btn-enter">확인</button>
                    </div>
                </div>
            </div>
        `);

        this.input.attr('disabled', 'disabled');
        
        if(!this.props.target) {
            $("body").append(this.calendar);
        } else {
            $(this.props.target).append(this.calendar);
        }

        this.calendar.find(".year-con").hide();
        this.calendar.find(".month-con").hide();

        $("html, body").on('scroll.datepicker', () => {
            this.calendar.css({left: this.ele.offset().left, top: this.ele.offset().top + 50});
        });
        // $(window).on('resize.datepicker', () => {
        //     this.calendar.css({left: this.ele.offset().left, top: this.ele.offset().top + 50});            
        // });        

        this.setCalendarPosition = () => {
            const offset = this.ele.offset();
            const calendarWidth = this.calendar.outerWidth();
            const calendarHeight = this.calendar.outerHeight();
            const windowWidth = $(window).width();
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const scrollLeft = $(window).scrollLeft();

            let left = offset.left;
            let top = offset.top + this.ele.outerHeight(); // 버튼 밑으로 기본 위치

            // 오른쪽 화면 밖으로 나가지 않게
            if (left + calendarWidth > windowWidth + scrollLeft) {
                left = windowWidth + scrollLeft - calendarWidth - 10; // 10px 여유
            }
            if (left < scrollLeft) left = scrollLeft + 10;

            // 아래 화면 밖으로 나가지 않게
            if (top + calendarHeight > windowHeight + scrollTop) {
                top = offset.top - calendarHeight; // 버튼 위로 위치
            }
            if (top < scrollTop) top = scrollTop + 10;

            this.calendar.css({left: left, top: top});
        };

        // 달력 처음 열 때
        this.setCalendarPosition();

        // 리사이즈 시
        $(window).on('resize.datepicker', this.setCalendarPosition);
        $("html, body").on('scroll.datepicker', this.setCalendarPosition);


        
        $("html, body").trigger('scroll.datepicker');                        

        this.calendar.find(".btn-cancel").on('click', () => {
            this.hideCalendar();
            $('.calendar-blind').hide();
        });
        this.calendar.find(".btn-enter").on('click', () => {                        
            if(this.selectDate) {
                if(!this.props.isMonth) {
                    this.input.val(dayjs(this.selectDate).format('YYYY-MM-DD'));
                } else {
                    this.input.val(dayjs(this.selectDate).format('YYYY-MM'));
                }
            }
            this.hideCalendar();
            $('.calendar-blind').hide();
        });

       

        this.calendar.find(".btn-prev").css({'pointer-events': ''}).on('click', () => {
            this.prevCalendar();
        });
        this.calendar.find(".btn-next").css({'pointer-events': ''}).on('click', () => {
            this.nextCalendar();
        });

        // const exceptions = ['.calendar-form','.calendar-wrap','button'];

        // $(document).on('click', function(e) {
        //     let isInsideException = exceptions.some(selector =>
        //         $(e.target).closest(selector).length > 0
        //     );

        //     if (!isInsideException) {
        //         $('.datepicker').hide();
        //         $('.calendar-form').removeClass('on')
        //         $('.calendar-form input').removeAttr('disabled')
        //     }           
        // });     

        this.calendar.find(".day-con button").attr('disabled', '');

        this.calendar.find(".btn-year").on('click', () => {
            this.calendar.find(".year-con").show();
            this.calendar.find(".month-con").hide();
            this.calendar.find(".btn-prev").css({'pointer-events': 'none'});
            this.calendar.find(".btn-next").css({'pointer-events': 'none'});
            this.calendar.find(".day-con button").attr('disabled', 'disabled');
            const top = parseInt(this.calendar.find(".year-con button").eq(0).css('height')) * this.calendar.find(".year-con button.active").index();
            this.calendar.find(".year-con").scrollTop(top);
            $('.btn-month').removeClass('on');            
            $('.btn-year').addClass('on'); 
            this.calendar.find(".year-con button.active").focus();
        });

        this.calendar.find(".btn-month").on('click', () => {
            this.calendar.find(".month-con").show();
            this.calendar.find(".year-con").hide();
            this.calendar.find(".btn-prev").css({'pointer-events': 'none'});
            this.calendar.find(".btn-next").css({'pointer-events': 'none'});
            this.calendar.find(".day-con button").attr('disabled', 'disabled');
            $('.btn-year').removeClass('on'); 
            $('.btn-month').addClass('on');
            this.calendar.find(".month-con button").eq(0).focus();
        });

        this.calendar.find(".btn-prev").focus();
        this.calendar.find(".btn-enter").on("focusin", e => {
            $(document).on('keydown.datepicker', (e) => {
                if(e.key === 'Tab' && !e.shiftKey) {
                    this.calendar.find(".btn-prev").focus();
                    e.preventDefault();
                }
            });
        });
        this.calendar.find(".btn-prev").on("focusin", e => {
            $(document).on('keydown.datepicker', (e) => {
                if(e.key === 'Tab' && e.shiftKey) {
                    this.calendar.find(".btn-enter").focus();
                    e.preventDefault();
                }
            });
        });
        this.calendar.find(".btn-enter").on("focusout", e => {
            $(document).off('keydown.datepicker');
        });
        this.calendar.find(".btn-prev").on("focusout", e => {
            $(document).off('keydown.datepicker');
        });

        if(this.input.val()) {
            this.selectDate = new Date(this.input.val());
            this.currentYear = this.selectDate.getFullYear();
            this.currentMonth = this.selectDate.getMonth() + 1;
        } else {
            this.currentYear = new Date().getFullYear();
            this.currentMonth = new Date().getMonth() + 1;
        }
        this.renderCalendar();

        // 달력 외 영역 클릭 시 닫기
        this.outsideClickHandler = (e) => {
            // 달력 내부 클릭
            if ($(e.target).closest('.datepicker').length) return;

            // 달력 버튼(input + calendar-btn) 클릭
            if ($(e.target).closest(this.ele).length) return;

            // 그 외 영역 클릭 → 닫기
            this.hideCalendar();
            $('.calendar-blind').hide();
        };

        $(document).on('mousedown.datepickerOutside', this.outsideClickHandler);
    }

    renderCalendar () {

        const year = this.currentYear ?? new Date().getFullYear();
        const month = this.currentMonth ?? new Date().getMonth()+1;

        const prevLast = new Date(year, month-1, 0);
        const thisLast = new Date(year, month, 0);

        const PLDate = prevLast.getDate();
        const PLDay = prevLast.getDay();

        const TLDate = thisLast.getDate();
        const TLDay = thisLast.getDay();
        
        let dates = [];
        const prevDates = [];
        const thisDates = [];
        const nextDates = [];

        const toDay = new Date();

        if(!this.props.isMonth) {
            this.calendar.find(".month-con").hide();
        } else {
            this.calendar.find(".month-con").show();
        }

        this.calendar.find(".btn-year").text(year+'년');
        this.calendar.find(".btn-month").text(month < 10 ? '0'+month+'월' : month+'월');

        this.calendar.find(".btn-next").removeAttr('disabled');
        this.calendar.find(".btn-prev").removeAttr('disabled');

        if(!this.props.isMonth) {
            if(this.currentYear === this.props.maxDate.getFullYear()) {
                if(this.currentMonth === this.props.maxDate.getMonth()+1) {
                    this.calendar.find(".btn-next").attr('disabled', 'disabled');
                }
            }

            if(this.currentYear === this.props.minDate.getFullYear()) {
                if(this.currentMonth === this.props.minDate.getMonth()+1) {
                    this.calendar.find(".btn-prev").attr('disabled', 'disabled');
                }
            }

            if(this.currentYear === Datepicker.MINIMUM_DATE.getFullYear()) {
                if(this.currentMonth === Datepicker.MINIMUM_DATE.getMonth()+1) {
                    this.calendar.find(".btn-prev").attr('disabled', 'disabled');
                }
            }
        } else {
            if(this.currentYear === this.props.maxDate.getFullYear()) {
                this.calendar.find(".btn-next").attr('disabled', 'disabled');
            }

            if(this.currentYear === this.props.minDate.getFullYear()) {
                this.calendar.find(".btn-prev").attr('disabled', 'disabled');
            }

            if(this.currentYear === Datepicker.MINIMUM_DATE.getFullYear()) {
                this.calendar.find(".btn-prev").attr('disabled', 'disabled');
            }
        }

        if(!this.props.isMonth) {
            for(let i=0; i<TLDate; i++) {
                if(year === toDay.getFullYear() && month === toDay.getMonth()+1  && i + 1 === toDay.getDate()){
                    thisDates.push({year:year, month: month, day: i+1, type: 'normal today'});
                } else {
                    thisDates.push({year:year, month: month, day: i+1, type: 'normal'});
                }
            }
            if (PLDay !== 6) {
                for (let i = 0; i < PLDay + 1; i++) {
                    prevDates.unshift({year:month === 1 ? year-1 : year, month: month === 1 ? 12 : month, day: PLDate - i, type: 'prev'});
                }
            }
            for (let i = 1; i < 7 - TLDay; i++) {
                nextDates.push({year:month === 12 ? year+1 : year , month: month === 12 ? 1 : month+1, day: i, type: 'next'})
            }

            this.calendar.find('.day-con .day').off('click');
            this.calendar.find('.day-con').empty();
            dates = [...prevDates, ...thisDates, ...nextDates];
            
            dates.forEach((x, i) => {
                if(this.selectDate) {
                    if(x.year === this.selectDate.getFullYear() && x.month === this.selectDate.getMonth()+1 && x.day === this.selectDate.getDate()) {
                        x.type += ' active';
                    }
                }

                if (this.props.maxDate && dayjs(`${x.year}-${x.month}-${x.day}`).isAfter(dayjs(this.props.maxDate), 'day')) {
                    x.type += ' disabled';
                }

                if (this.props.minDate && dayjs(`${x.year}-${x.month}-${x.day}`).isBefore(dayjs(this.props.minDate), 'day')) {
                    x.type += ' disabled';
                }

                if(this.props.maxInput && $(this.props.maxInput).val()) {
                    if(new Date(x.year+'-'+x.month+'-'+x.day) > new Date($(this.props.maxInput).val())) {
                        x.type += ' disabled';
                    }
                }
                if(this.props.minInput && $(this.props.minInput).val()) {
                    const minDate = new Date($(this.props.minInput).val());
                    if(new Date(x.year+'-'+x.month+'-'+x.day) <= new Date($(this.props.minInput).val())) {
                        if(!(x.year === minDate.getFullYear() && x.month === minDate.getMonth() +1 && x.day === minDate.getDate())) {
                            x.type += ' disabled';
                        }
                    }
                }
            });
            
            dates.forEach(x => {            
                this.calendar.find('.day-con').append(
                    `<div class="day ${x.type}" data-date=${x.year+'-'+x.month+'-'+x.day}>
                        <button class="btn text">${x.day}</button>
                    </div>`
                );
            });

            this.calendar.find('.day-con .day').each(function () {
                if($(this).hasClass('disabled')) {
                    $(this).find("button").attr('disabled', 'disabled');
                }
            });

            this.doubleClickDelay = false;
            this.calendar.find('.day-con .day button').on('click', ( e ) => {
                const target = $(e.currentTarget).parent();
                if(!this.doubleClickDelay) {
                    this.selectDate = dayjs(target.data('date')).toDate();
                    this.renderCalendar();
                    this.doubleClickDelay = true;
                    this.doubleClickTimeout = setTimeout(() => {
                        this.doubleClickDelay = false;
                    }, 500);
                } else {
                    if(dayjs(this.selectDate).format('YYYYMMDD') === dayjs(target.data('date')).format('YYYYMMDD')) {
                        this.selectDate = dayjs(target.data('date')).toDate();
                        this.calendar.find(".btn-enter").trigger('click');
                    } else {
                        this.doubleClickDelay = false;
                        clearTimeout(this.doubleClickTimeout);
                        $(e.currentTarget).trigger('click');
                    }
                }
            });
        }
        this.renderYear();
        this.renderMonth();
    }

    renderYear () {
        this.calendar.find(".year-con").empty();
        for(let i = new Date().getFullYear(); i >= Datepicker.MINIMUM_DATE.getFullYear(); i--) {
            if(this.currentYear === i) {
                this.calendar.find(".year-con").append(`<button class="btn-year-select active" data-year="${i}">${i}</button>`)
            } else {
                this.calendar.find(".year-con").append(`<button class="btn-year-select" data-year="${i}">${i}</button>`)
            }
        }
        for(let i = new Date().getFullYear()+1; i <= this.props.maxDate.getFullYear(); i++) {
            this.calendar.find(".year-con").prepend(`<button class="btn-year-select" data-year="${i}">${i}</button>`)
        }
        this.calendar.find(".year-con button").on('click', (e) => {
            this.currentYear = $(e.currentTarget).data('year');
            this.calendar.find(".year-con").hide();                        
            this.calendar.find(".btn-prev").css({'pointer-events': ''});
            this.calendar.find(".btn-next").css({'pointer-events': ''});
            this.calendar.find('.day-con .day').each(function () {
                if(!$(this).hasClass('disabled')) {
                    $(this).find("button").attr('disabled', '');
                }
            });
            if(this.props.isMonth) {
                this.currentMonth = null;
            }
            this.renderCalendar();
            $('.btn-year').removeClass('on');
        });
    }

    renderMonth () {
        var owner = this;
        this.calendar.find(".month-con").empty();
        for(let i = 1; i <= 12; i++) {
            if(this.currentMonth === i) {
                this.calendar.find(".month-con").append(`<button class="btn-month-select active" data-month="${i}">${i}월</button>`)
            } else {
                this.calendar.find(".month-con").append(`<button class="btn-month-select" data-month="${i}">${i}월</button>`)
            }
        }
        if(dayjs(this.props.maxDate).format('YYYYMMDD') === dayjs(this.today).format('YYYYMMDD') && this.currentYear === new Date().getFullYear()) {
            this.calendar.find(".month-con button").each(function () {
                if($(this).data('month') > new Date().getMonth() +1) {
                    $(this).attr('disabled', 'disabled');
                }
            });
        }

        if(this.props.isMonth) {
            if(this.props.maxInput && $(this.props.maxInput).val()) {
                this.calendar.find(".month-con button").each(function () {
                    if(parseInt(dayjs(new Date(owner.currentYear+'-'+$(this).data('month'))).format('YYYYMM')) > parseInt(dayjs(new Date($(owner.props.maxInput).val())).format('YYYYMM'))) {
                        $(this).attr('disabled', 'disabled');
                    }
                });
            }
            if(this.props.minInput && $(owner.props.minInput).val()) {
                this.calendar.find(".month-con button").each(function () {
                    if(parseInt(dayjs(new Date(owner.currentYear+'-'+$(this).data('month'))).format('YYYYMM')) < parseInt(dayjs(new Date($(owner.props.minInput).val())).format('YYYYMM'))) {
                        $(this).attr('disabled', 'disabled');
                    }
                });
            }
        }
        
        this.calendar.find(".month-con button").on('click', (e) => {
            if(!this.doubleClickDelay) {
                this.doubleClickDelay = true;
                this.currentMonth = $(e.currentTarget).data('month');
                this.calendar.find(".month-con").hide();
                this.calendar.find(".btn-prev").css({'pointer-events': ''});
                this.calendar.find(".btn-next").css({'pointer-events': ''});
                this.calendar.find('.day-con .day').each(function () {
                    if(!$(this).hasClass('disabled')) {
                        $(this).find("button").attr('disabled', '');
                    }
                });
                this.renderCalendar();
                $('.btn-month').removeClass('on');
                if(this.props.isMonth) {
                    this.selectDate = dayjs(`${this.currentYear}-${this.currentMonth}-01`).toDate();
                }
                this.doubleClickTimeout = setTimeout(() => {
                    this.doubleClickDelay = false;
                }, 200);
            } else {
                if(dayjs(this.selectDate).format('YYYYMM') === dayjs(`${this.currentYear}-${$(e.currentTarget).data('month')}`).format('YYYYMM')) {
                    this.calendar.find(".btn-enter").trigger('click');
                } else {
                    this.doubleClickDelay = false;
                    clearTimeout(this.doubleClickTimeout);
                    $(e.currentTarget).trigger('click');
                }
            }
        });
    }

    nextCalendar () {
        if(!this.props.isMonth) {
            this.currentMonth++;
            if(this.currentMonth === 13) {
                this.currentYear++;
                this.currentMonth = 1;
            }
        } else {
            this.currentYear++;
            this.currentMonth = null;
        }
        
        this.renderCalendar();   
    }

    prevCalendar () {
        if(!this.props.isMonth) {
            this.currentMonth--;
            if(this.currentMonth === 0) {
                this.currentYear--;
                this.currentMonth = 12;
            }
        } else {
            this.currentYear--;
            this.currentMonth = null;
        }
        this.renderCalendar();
    }

    hideCalendar () {
        //$(document).on('mousedown.datepickerOutside', this.outsideClickHandler);
        //$("html, body").off('scroll.datepicker');
        $(window).off('resize.datepicker');

        // input 활성화 조건: 달력 버튼이 disabled가 아니면
        if (!this.btn.is(':disabled')) {
            this.input.removeAttr('disabled');
        }        
        
        $('.calendar-form').removeClass('on');   
        $(document).off('keydown.datepicker');     
        if(this.calendar) {                        
            this.calendar.find(".btn-cancel").off('click');
            this.calendar.find(".btn-enter").off('click');
            this.calendar.find(".btn-next").off('click');
            this.calendar.find(".btn-prev").off('click');
            this.calendar.find(".btn-year").off('click');
            this.calendar.find(".btn-month").off('click');
            this.calendar.find('.day-con .day').off('click');
            this.calendar.find(".year-con button").off('click');
            this.calendar.find(".month-con button").off('click');
            this.calendar.find(".btn-enter").off("focusin focusout");
            this.calendar.find(".btn-prev").off("focusin focusout");
            this.calendar.remove();            
        }
        this.btn.focus();
        this.isShow = false;
        this.selectDate = null;
        
        this.input.trigger('change')
    }    
}



$.fn.datepicker = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('datepicker');
        var options =  $.extend({}, Datepicker.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('datepicker', (data = new Datepicker($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.datepicker.Constructor = Datepicker;


 $(document).ready(function () {       

      
});