
class Datepicker {

    static DEFAULT_PROPS = {
        maxDate: new Date(),
        minInput: null,
        maxInput: null,
        target: '',
    }

    static MINIMUM_DATE = new Date('1930-01-01');
    static MAXIMUM_DATE = dayjs().add(30, 'year').month(11).endOf('month').toDate();

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.input = this.ele.find('input');
        this.btn = this.ele.find('.calendar-btn');
        this.today = new Date();
        this.selectDate = null;
        this.minDate = null;
        this.maxDate = null;
        this.isShow = false;
        this.currentYear = null;
        this.currentMonth = null;
        if(!this.props.maxDate) this.props.maxDate = Datepicker.MAXIMUM_DATE;
        else                    this.props.maxDate = new Date(this.props.maxDate);
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
            val = val.replace(/[^0-9-]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
            this.input.val(val);
        });

        this.input.on('change', () => {
            let val = this.input.val();

            if(val === '') {
                this.selectDate = null;
                return;
            }

            if(isNaN(Date.parse(val))) {
                alert('올바른 날짜 형식을 입력하세요. (YYYY-MM-DD)');
                this.input.val('').focus(); 
            } else {
                this.selectDate = new Date(this.input.val());
                if(dayjs(this.props.maxDate).format('YYYYMMDD') === dayjs(this.today).format('YYYYMMDD') && new Date(val) > this.props.maxDate) {
                    alert('오늘 날짜보다 큰 날짜를 입력 할 수없습니다.');
                    this.input.val('').focus(); 
                    return;
                }

                if(this.props.minInput && $(this.props.minInput).val()) {
                    this.minDate = new Date($(this.props.minInput).val());
                    if(this.selectDate < this.minDate) {
                        alert('시작날짜는 종료날짜보다 클 수 없습니다.');
                        this.input.val('').focus(); 
                    }
                }

                if(this.props.maxInput && $(this.props.maxInput).val()) {
                    this.maxDate = new Date($(this.props.maxInput).val());
                    if(this.selectDate > this.maxDate) {
                        alert('종료날짜는 시작날짜보다 작을 수 없습니다.');
                        this.input.val('').focus(); 
                    }
                }
            }
        });

        this.btn.on('click', () => {
            if(!this.isShow) {
                this.isShow = true;
                this.showCalendar();                                
            }
            this.btn.closest('.calendar-form').addClass('on');
        });
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
                        <button class=btn-month></button>
                        <button class="btn-next">다음</button>
                    </div>
                    <div class="calendar-content">
                        <div class="week-con">
                            <div>Su</div>
                            <div>Mo</div>
                            <div>Tu</div>
                            <div>We</div>
                            <div>Th</div>
                            <div>Fr</div>
                            <div>Sa</div>
                        </div>
                        <div class="day-con"></div>
                        <div class="year-con d-none"></div>
                        <div class="month-con d-none"></div>
                    </div>
                    <div class="calendar-footer">
                        <button type="button" class="btn tertiary small btn-cancel mr-8">취소</button>
                        <button type="button" class="btn primary small btn-enter">확인</button>
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
        $(window).on('resize.datepicker', () => {
            this.calendar.css({left: this.ele.offset().left, top: this.ele.offset().top + 50});
        });
        $("html, body").trigger('scroll.datepicker');
        this.calendar.find(".btn-cancel").on('click', () => {
            this.hideCalendar();
        });
        this.calendar.find(".btn-enter").on('click', () => {
            if(this.selectDate) {
                this.input.val(dayjs(this.selectDate).format('YYYY-MM-DD'));
            }
            this.hideCalendar();
        });
        this.calendar.find(".btn-prev").css({'pointer-events': ''}).on('click', () => {
            this.prevCalendar();
        });
        this.calendar.find(".btn-next").css({'pointer-events': ''}).on('click', () => {
            this.nextCalendar();
        });

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

        this.calendar.find(".btn-year").text(year+'년');
        this.calendar.find(".btn-month").text(month < 10 ? '0'+month+'월' : month+'월');

        this.calendar.find(".btn-next").removeAttr('disabled');
        this.calendar.find(".btn-prev").removeAttr('disabled');

        if(this.currentYear === this.props.maxDate.getFullYear()) {
            if(this.currentMonth === toDay.getMonth()+1) {
                this.calendar.find(".btn-next").attr('disabled', 'disabled');
            }
        }

        if(this.currentYear === Datepicker.MINIMUM_DATE.getFullYear()) {
            if(this.currentMonth === Datepicker.MINIMUM_DATE.getMonth()+1) {
                this.calendar.find(".btn-prev").attr('disabled', 'disabled');
            }
        }
        
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
            if(this.props.maxDate && new Date(x.year+'-'+x.month+'-'+x.day) > this.props.maxDate) {
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

        this.calendar.find('.day-con .day button').on('click', ( e ) => {
            const target = $(e.currentTarget).parent();
            this.selectDate = dayjs(target.data('date')).toDate();
            this.renderCalendar();
        });
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
            this.renderCalendar();
            $('.btn-year').removeClass('on');
        });
    }

    renderMonth () {
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
        this.calendar.find(".month-con button").on('click', (e) => {
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
        });
    }

    nextCalendar () {
        this.currentMonth++;
        if(this.currentMonth === 13) {
            this.currentYear++;
            this.currentMonth = 1;
        }
        
        this.renderCalendar();   
    }

    prevCalendar () {
        this.currentMonth--;
        if(this.currentMonth === 0) {
            this.currentYear--;
            this.currentMonth = 12;
        }
        this.renderCalendar();
    }

    hideCalendar () {
        $("html, body").off('scroll.datepicker');
        $(window).off('resize.datepicker');
        this.input.removeAttr('disabled');        
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