import $ from 'jquery';

class Hiddeninput {

    static DEFAULT_PROPS = {
        showNum: 0,
        numberOnly: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.actualValue = '';
        this.regex = this.props.numberOnly ? /^[0-9]+$/ : /^[^\u3131-\u314E가-힣\s]+$/;
        this.init();
    }

    init () {
        this.actualValue = this.ele.val();
        this.onInput();
        this.ele.on('beforeinput', (e) => {
            this.onBeforeInput(e);
        });
        this.ele.on('input', (e) => {
            this.onInput();
        });
    }

    onBeforeInput( e ) {
        const input = this.ele[0];
        const { selectionStart, selectionEnd } = input;
        const inputType = e.originalEvent.inputType;
        let data = e.originalEvent.data;
        if(data) {
            if(!this.regex.test(data)) {
                e.preventDefault();
                return;
            }
        }
        
        if (inputType === 'insertText' || inputType === 'insertCompositionText') {
            this.actualValue = this.actualValue.slice(0, selectionStart) + data + this.actualValue.slice(selectionEnd);
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
                this.actualValue = this.actualValue.slice(0, selectionStart) + pastedText + this.actualValue.slice(selectionEnd);
                this.onInput();
            });
            e.preventDefault();
        }
    }

    onInput () {
        const input = this.ele[0];
        this.ele.data('value', this.actualValue);
        const visiblePart = this.actualValue.slice(0, this.props.showNum);
        const maskedPart = '*'.repeat(Math.max(0, this.actualValue.length - this.props.showNum));
        const display = visiblePart + maskedPart;
        input.value = display;
    }

    destroy () {
        this.ele.off('beforeinput input');
    }
}

$.fn.hiddeninput = Plugin;
$.fn.hiddeninput.Constructor = Hiddeninput;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('hiddeninput');
        var options =  $.extend({}, Hiddeninput.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('hiddeninput', (data = new Hiddeninput($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}