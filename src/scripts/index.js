
$(() => {
    
    createUI();    
    setLogin();

    // dom 변경 시 UI 다시 생성
    const domObserver = new MutationObserver(() => {
        createUI();
    });
    domObserver.observe(document.body, {
        attributes: true, 
        childList: true, 
        characterData: true,
        subtree: true
    });

});

// 컴포넌트 UI 생성
function createUI () {
    // 탭메뉴
    $(`*[data-ui="tabmenu"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).tabmenu(props);
    });

    // 모달 타겟
    $(`*[data-modal-target]`).each(function () {
        const modalSelector = $(this).data('modal-target');
        $(this).off('click').on("click", function () {
            $(modalSelector).modal('show');
        });
    });

    // 모달
    $(`*[data-ui="modal"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).modal(props);
    });

    // 툴팁
    $(`*[data-ui="tooltip"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).tooltip(props);
    });

    // 데이트 피커
    $(`*[data-ui="datepicker"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).datepicker(props);
    });

    // 아코디언
    $(`*[data-ui="accordion"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).accordion(props);
    });

    // 패스워드 / 주민등록용 인풋
    $(`*[data-ui="hidden-input"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).hiddeninput(props);
    });

    // 페이지네이션
    $(`*[data-ui="pagination"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).pagination(props);
    });
}


function styleToJson (el, style) {
    let styles = style.split(";");
    
    if(styles[styles.length-1].split(':').length < 2) {
        styles = styles.slice(0, styles.length-1);
    }
    if(styles.length == 0){
        return {};
    }
    let json = "{ ";
    for(let i = 0; i<styles.length; i++)
    {
        let s = styles[i].split(':');
        s = [s.shift(), s.join(':')];
        let name = $.trim(s[0]);
        let val = $.trim(s[1]);
        if(val[1] == "$"){
            var v = val.replace("$", "").replace(/'/g, "");
            if(FrameWork.activity[v]){
                val = JSON.stringify(FrameWork.activity[v]);
            }
        }
        if(i < styles.length-1) {
            json += '"' + name +'" : ' + val.replace(/'/g, "\"") + ", ";
        } else {
            json += '"' + name +'" : ' + val.replace(/'/g, "\"") + " }";
        }
    }
    let obj;
    try{
        obj = $.parseJSON(json);
    } catch(e) {
        console.error("잘못된 옵션 형식. 옵션값이 제대로 들어가 있는지 확인해주세요.", el);
    }
    return obj;
}

// 로그인
function setLogin() {
    var loginSwitch = $('.wrap-login .title-top .left-box .form-toggle-switch input[type=checkbox]');
    var loginBtn = $('.wrap-login .title-top .left-box .form-toggle-switch label');
    var loginTxt = $('.wrap-login .title-top .left-box .form-toggle-switch label span');   
    var titHide = $('.wrap-login .title-top.hide');     
    var cerHide = $('.wrap-login .certification-list.hide');     

    loginBtn.click(function(){
        if (loginSwitch.is(":checked")) {
            loginTxt.text('미사용');
            titHide.show();
            cerHide.show();
        } else {
            loginTxt.text('사용');
            titHide.hide();
            cerHide.hide();
        } 
    });

    loginSwitch.keyup(function(e){        
        if (event.keyCode  == 32) {            
            if (loginSwitch.is(":checked")) {
                loginTxt.text('미사용');
                titHide.show();
                cerHide.show();
            } else {
                loginTxt.text('사용');
                titHide.hide();
                cerHide.hide();
            }    
        }        
    });
}