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


function testtesttes(){
    $('.cont-area select,.cont-area input,.cont-area textarea').each(function(i){
        var title = $(this).attr('title');       
        var id = $(this).attr('id');   
        
        $('.form-group').eq(i).append('<div style="color:red;margin-top:10px;">타이틀 : '+title+'</div>')                    
        $('.cont-area label').eq(i).append('<div style="color:red;margin-top:10px;color:blue">아이디 : '+id+'</div>')        
    })

    $('.cont-area caption').each(function(i){        
        var caption = $(this).text();     

        $('.table-wrap').eq(i).append('<div style="color:red;width:100%:margin-top:10px;">'+caption+'</div>')                
    })

    $('.cont-area label').each(function(i){        
        var info = $(this).attr('for');     

        $('.cont-area label').eq(i).append('<div style="color:red;width:100%;">for정보 : '+info+'</div>')                        
    })
}


$(function(){
  //testtesttes()  
})