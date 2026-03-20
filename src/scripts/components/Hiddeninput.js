class Hiddeninput {
    static DEFAULT_PROPS = {
        showNum: 0,
        numberOnly: false,
        toggleBtn: false,
        maskLast: 0
    }

    constructor(ele, props) {
        this.ele = ele;
        this.props = props;
        this.actualValue = '';
        this.regex = this.props.numberOnly ? /^[0-9]+$/ : /^[^\u3131-\u318E\u1100-\u11FF가-힣\u00B7\u2022\s]+$/;
        this.toggleBtn = null;
        this.isVisible = false;
        this.isComposing = false;
        this.backspaceHandled = false;
        this.isMobile = 'ontouchstart' in window;
        this.init();
    }

    //

    init() {
        this.actualValue = this.ele.val();
        this.onInput();

        this.ele.on('keydown', () => {
            this.backspaceHandled = false;
        });

        this.ele.on('compositionstart', () => {
            this.isComposing = true;
        });

        this.ele.on('compositionend', (e) => {
            this.isComposing = false;
            this.onInput(); 
        });

        this.ele.on('beforeinput', (e) => {
            if (e.originalEvent.inputType === 'deleteContentBackward') {
                this.backspaceHandled = true;
            }
            if(this.isMobile) {
                this.onBeforeInput(e);    
            } else {
                if (this.isComposing) return;
                this.onBeforeInput(e);
            }
        });
        this.ele.on('input keyup', (e) => {
            if(this.isMobile) {
                this.onInput();
            } else {
                const hangulRegex = /[\u3131-\u318E\u1100-\u11FF가-힣]/g;
                const currentVal = this.ele.val();
                if (hangulRegex.test(currentVal)) {
                    setTimeout(() => {
                        this.isComposing = false;
                        this.onInput();
                    }, 300);
                    return;
                }
                if (!this.isComposing) {
                    this.onInput();
                }
            }
        });

        this.ele.on('keyup', (e) => {
            if (e.key === 'Backspace' || e.keyCode === 8) {
                
                if (!this.backspaceHandled) {
                    const input = this.ele[0];
                    const { selectionStart, selectionEnd } = input;
                    
                    if (selectionStart !== selectionEnd) {
                        this.actualValue = this.actualValue.slice(0, selectionStart) + this.actualValue.slice(selectionEnd);
                    } else if (selectionStart > 0) {
                        this.actualValue = this.actualValue.slice(0, selectionStart - 1) + this.actualValue.slice(selectionEnd);
                    }
                    
                    this.isComposing = false;
                    this.onInput();
                }
            }
        });

        if (this.props.toggleBtn) {
            this.toggleBtn = $(`<button type="button" title="비밀번호 표시" class="visibility-btn"><i class="icon visibility medium"></i></button>`);
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

        if (inputType === 'insertText') {
            newValue = this.actualValue.slice(0, selectionStart) + data + this.actualValue.slice(selectionEnd);
            if (maxLength >= 0 && newValue.length > maxLength) {
                e.preventDefault();
                return;
            }
            this.actualValue = newValue;
        } else if(inputType === 'insertCompositionText') {
            if(this.isMobile) {
                newValue = this.actualValue.slice(0, selectionStart) + data + this.actualValue.slice(selectionEnd);
                if (maxLength >= 0 && newValue.length > maxLength) {
                    e.preventDefault();
                    return;
                }
                this.actualValue = newValue;
            } else {
                return;
            }
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

            // maskLast가 설정된 경우 → 뒤에서 마스킹
            if (this.props.maskLast > 0) {
                const maskCount = Math.min(this.props.maskLast, this.actualValue.length);
                const visiblePart = this.actualValue.slice(0, this.actualValue.length - maskCount);
                const maskedPart = '*'.repeat(maskCount);

                input.value = visiblePart + maskedPart;

            } else {
                // 기존 로직 유지
                const visiblePart = this.actualValue.slice(0, this.props.showNum);
                const maskedPart = '*'.repeat(Math.max(0, this.actualValue.length - this.props.showNum));

                input.value = visiblePart + maskedPart;
            }
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