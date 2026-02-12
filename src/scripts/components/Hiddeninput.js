class Hiddeninput {
    static DEFAULT_PROPS = {
        showNum: 0,
        numberOnly: false,
        toggleBtn: false,
    }

    constructor(ele, props) {
        this.ele = ele;
        this.props = props;
        this.actualValue = '';
        this.regex = this.props.numberOnly ? /^[0-9]+$/ : /^[^\u3131-\u314E가-힣\s]+$/;
        this.toggleBtn = null;
        this.isVisible = false; // ← 표시 상태 관리 플래그
        this.init();
    }

    init() {
        this.actualValue = this.ele.val();
        this.onInput();
        this.ele.on('beforeinput', (e) => {
            this.onBeforeInput(e);
        });
        this.ele.on('input', () => {
            this.onInput();
        });
        if (this.props.toggleBtn) {
            this.toggleBtn = $(`<button type="button" title="비밀번호 표시" class="visibility"><i class="icon visibility medium"></i></button>`);
            this.ele.after(this.toggleBtn);

            this.toggleBtn.on('click', () => {
                const icon = this.toggleBtn.find('i');
                this.isVisible = !this.isVisible;

                if (this.isVisible) {
                    icon.removeClass('visibility').addClass('visibility-off');
                    this.toggleBtn.attr('title', '비밀번호 숨김');
                } else {
                    icon.removeClass('visibility-off').addClass('visibility');
                    this.toggleBtn.attr('title', '비밀번호 표시');
                }
                this.onInput();
            });
        }
    }

    onBeforeInput(e) {
        const input = this.ele[0];
        const { selectionStart, selectionEnd } = input;
        const inputType = e.originalEvent.inputType;
        let data = e.originalEvent.data;
        const maxLength = input.maxLength;

        if (data && !this.regex.test(data)) {
            e.preventDefault();
            return;
        }

        let newValue = this.actualValue;

        if (inputType === 'insertText' || inputType === 'insertCompositionText') {
            newValue = this.actualValue.slice(0, selectionStart) + data + this.actualValue.slice(selectionEnd);
            if (maxLength >= 0 && newValue.length > maxLength) {
                e.preventDefault();
                return;
            }
            this.actualValue = newValue;
        } else if (inputType === 'deleteContentBackward') {
            if (selectionStart !== selectionEnd) {
                this.actualValue = this.actualValue.slice(0, selectionStart) + this.actualValue.slice(selectionEnd);
            } else if (selectionStart > 0) {
                this.actualValue = this.actualValue.slice(0, selectionStart - 1) + this.actualValue.slice(selectionEnd);
            }
        } else if (inputType === 'deleteContentForward') {
            if (selectionStart !== selectionEnd) {
                this.actualValue = this.actualValue.slice(0, selectionStart) + this.actualValue.slice(selectionEnd);
            } else if (selectionStart < this.actualValue.length) {
                this.actualValue = this.actualValue.slice(0, selectionStart) + this.actualValue.slice(selectionStart + 1);
            }
        } else if (inputType === 'insertFromPaste') {
            navigator.clipboard.readText().then(pastedText => {
                const filtered = [...pastedText].filter(ch => this.regex.test(ch)).join('');
                const pastedValue = this.actualValue.slice(0, selectionStart) + filtered + this.actualValue.slice(selectionEnd);
                if (maxLength >= 0 && pastedValue.length > maxLength) return;
                this.actualValue = pastedValue;
                this.onInput();
            });
            e.preventDefault();
        }
    }

    onInput() {
        const input = this.ele[0];
        this.ele.data('value', this.actualValue);

        if (this.isVisible) {
            input.value = this.actualValue;
        } else {
            const visiblePart = this.actualValue.slice(0, this.props.showNum);
            const maskedPart = '*'.repeat(Math.max(0, this.actualValue.length - this.props.showNum));
            input.value = visiblePart + maskedPart;
        }
    }

    destroy() {
        this.ele.off('beforeinput input');
    }
}

$.fn.hiddeninput = function(option, params) {
    return this.each(function() {
        var $this = $(this);
        var data = $this.data('hiddeninput');
        var options = $.extend({}, Hiddeninput.DEFAULT_PROPS, typeof option === "object" && option);
        if (!data || typeof data === 'string') $this.data('hiddeninput', (data = new Hiddeninput($this, options)));
        if (typeof option === 'string') data[option](params);
    });
};

$.fn.hiddeninput.Constructor = Hiddeninput