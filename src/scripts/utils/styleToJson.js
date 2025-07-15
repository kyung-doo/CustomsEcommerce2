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

//접근성
function accessibility(){
    $('input,select').each(function(i){
        var title = $(this).attr('title');               
        
        $('.form-group').eq(i).append('<div style="color:red;margin-top:10px;">타이틀 : '+title+'</div>')                            
    })
    
     $('label').each(function(i){        
        var info = $(this).attr('for');     
        $(this).eq(i).append('<div style="color:red;width:100%;">for정보 : '+info+'</div>')                        
    })
    /*
    $('.cont-area caption').each(function(i){        
        var caption = $(this).text();     

        $('.table-wrap').eq(i).append('<div style="color:red;width:100%:margin-top:10px;">'+caption+'</div>')                
    })

   
        */
}

//리스트 타입 제일큰 넓이값 구하기
function formList() {
    var title = $(".wrap-form-area .inp-form .txt-list .tit");
    var width_array = title.map(function () {
        return $(this).width();
    }).get();

    var max_width = Math.max.apply(Math, width_array);
    
    if(max_width >= 180){
        title.css({"width":"180px"})
    }else{
        title.width(max_width);
    }        
}

//반응형 확인
function windowR(){
    $(window).on('resize load', function(){   
        var w = $(this).width();
        var h = $(this).height();        
        $('.windowR').remove()
        $('#wrap').append(`<div class="windowR" style="position: fixed;top:0;left:0;width:100px;font-size:20px;background-color: red;z-index: 99999;">${w}<br>${h}</div>`);                

        if(w <= 390){
            $('#wrap').css({"border":"3px solid blue"})
        }else{
            $('#wrap').css({"border":"0"})
        }
    });
}

$(function(){
  //accessibility()  
  //formList() 
  windowR()
 // passwordInput()
  
})