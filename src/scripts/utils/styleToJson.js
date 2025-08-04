import $ from 'jquery';

export default function (el, style) {
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
$(function(){
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
})

//반응형 확인
function windowR(){
    $(window).on('resize load', function(){   
        var w = $(this).width();
        var h = $(this).height();        
        $('.windowR').remove()
        $('#wrap').append(`<div class="windowR" style="position: fixed;bottom:0;left:0;width:100px;font-size:20px;background-color: red;z-index: 99999;">${w}<br>${h}</div>`);                

        if(w <= 390){
            $('#wrap').css({"border":"3px solid blue"})
        }else{
            $('#wrap').css({"border":"0"})
        }
    });
}

$(function(){  
  windowR()   
})