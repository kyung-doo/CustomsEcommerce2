
$(() => {
    
    createUI();        

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

    //마우스 올렸을떄 툴팁(title 적용) 
    $('.copy').each(function() {    
        let buttonText = $(this).text().trim();    
        $(this).attr('title', `${buttonText} 복사하기`);
    });

    $('.tooltip-tit').each(function() {
        let $tooltipBtn = $(this).find('.tooltip-ico');

        if ($tooltipBtn.length === 0) return; // 버튼 없으면 패스

        // strong 값이 있으면 strong 사용
        let strongTitle = $(this).find('.title > strong').text().trim();
        
        // h5 값이 있으면 h5 사용 (예: title-type3 구조)
        let h5Title = $(this).closest('.title-type3').find('h5').text().trim();

        // 조건에 따라 버튼 title 설정
        if (h5Title) {
            $tooltipBtn.attr('title', `${h5Title} 툴팁이 열립니다`);
        } else if (strongTitle) {
            $tooltipBtn.attr('title', `${strongTitle} 툴팁이 열립니다`);
        }
    });

    $('i.icon.copy.small').removeAttr('title');

    function setTitles(context) {
        $(context).find('button.sch-delete').attr('title', '검색어 삭제하기');
        $(context).find('button.pages-sch, button.sach').attr('title', '검색');
    }

    // 초기 적용
    setTitles(document);

    // 동적 추가 버튼 처리
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => n.nodeType===1 && setTitles(n))))
    .observe(document.body, { childList:true, subtree:true });  

    // document.querySelectorAll(".purchased-item").forEach(wrapper => {
    //     const button = wrapper.querySelector(".purchased-btn button");
    //     const area = wrapper.querySelector(".purchased-area");
    //     const links = wrapper.querySelectorAll(".purchased-list li a");

    //     function openDropdown() {
    //     wrapper.classList.add("open");

    //     // 위치 초기화
    //     wrapper.classList.remove("up", "down");

    //     // 버튼 위치 정보
    //     const buttonRect = button.getBoundingClientRect();
    //     const areaHeight = area.offsetHeight;
    //     const viewportHeight = window.innerHeight;

    //     const spaceBelow = viewportHeight - buttonRect.bottom;
    //     const spaceAbove = buttonRect.top;

    //     if (spaceBelow < areaHeight && spaceAbove > areaHeight) {
    //         wrapper.classList.add("up");
    //     } else {
    //         wrapper.classList.add("down");
    //     }
    //     }

    //     // 버튼 클릭
    //     button.addEventListener("click", e => {
    //     e.stopPropagation();

    //     if (wrapper.classList.contains("open")) {
    //         wrapper.classList.remove("open", "up", "down");
    //     } else {
    //         // 다른 드롭다운 닫기
    //         document.querySelectorAll(".purchased-item.open").forEach(item => {
    //         item.classList.remove("open", "up", "down");
    //         });
    //         openDropdown();
    //     }
    //     });

    //     // 내부 클릭 방지
    //     area.addEventListener("click", e => e.stopPropagation());

    //     // 리스트 클릭 시 닫기
    //     // links.forEach(link => {
    //     //     link.addEventListener("click", () => {
    //     //         wrapper.classList.remove("open", "up", "down");
    //     //     });
    //     // });
    // });

    // 배경 클릭 시 닫기
    document.addEventListener("click", () => {
        document.querySelectorAll(".purchased-item.open").forEach(item => {
        item.classList.remove("open", "up", "down");
        });
    });

    // 배경(html, body) 클릭 → 닫기
    document.addEventListener("click", () => {
        document.querySelectorAll(".purchased-item.open").forEach(item => {
        item.classList.remove("open");
        });
    });
    
    
    
    //파비콘
    // const favicon = document.getElementById("favicon");
    // favicon.href = "../assets/icons/favicon-icon.svg";


    // $('.testtest').remove();
    // $('.testtest > button').removeAttr('style');

    // 표시는 필수 입력 사항입니다.    
    // $('.compulsory-txt .compulsory').remove();
    // $('.compulsory-txt').text('');
    // $('.compulsory-txt').append(`<i class="compulsory">필수</i> 표시는 필수 입력 사항입니다.`)
    

    //화면 넓이
    // $(document).ready(function() {        
    //     function updateWidth() {                      
    //         var width = $(window).width();
    //         $('#wrap').append(`<div id="width-display" style="position: fixed;top: 0px;right: 0px;background: #333;color: #fff;padding: 5px 10px;border-radius: 5px;z-index:9999">${width}</div>`)
    //     }
    //     updateWidth();

    //     $(window).resize(function() {
    //         updateWidth();
    //     });        
    // });    



    // function createHorizontalGuides(options = {}) {
    //     const lineCount = options.count || 2;
    //     const color = options.color || 'rgba(255,0,0,0.7)';
    //     const thickness = options.thickness || 2;
    //     const spacing = options.spacing || 50;

    //     const lines = [];
    //     let activeLine = null; // 키보드 이동용 현재 선택된 가이드

    //     for (let i = 0; i < lineCount; i++) {
    //         const $line = $('<div class="guide-line horizontal"></div>');
    //         $('body').append($line);

    //         $line.css({
    //             position: 'absolute',
    //             width: '100%',
    //             height: thickness + 'px',
    //             top: (50 + i * spacing) + 'px',
    //             left: 0,
    //             background: color,
    //             zIndex: 9999,
    //             cursor: 'move',
    //             outline: 'none'
    //         });

    //         // 포커스 가능하게 tabindex 추가
    //         $line.attr('tabindex', 0);

    //         // --------------------------
    //         // 마우스 드래그 이동
    //         // --------------------------
    //         let isDragging = false;
    //         let startMouse = 0;
    //         let startTop = 0;

    //         $line.on('mousedown', function (e) {
    //             isDragging = true;
    //             activeLine = $line; // 현재 선택된 라인
    //             startMouse = e.pageY;
    //             startTop = parseInt($line.css('top'));
    //             e.preventDefault();
    //             $line.focus(); // 키보드 이동을 위해 포커스
    //         });

    //         $(document).on('mousemove', function (e) {
    //             if (!isDragging) return;
    //             const delta = e.pageY - startMouse;
    //             $line.css('top', startTop + delta + 'px');
    //         });

    //         $(document).on('mouseup', function () {
    //             isDragging = false;
    //         });

    //         // --------------------------
    //         // 키보드 이동 (↑ ↓)
    //         // --------------------------
    //         $line.on('keydown', function (e) {
    //             const step = e.shiftKey ? 10 : 1; // shift 누르면 10px 이동
    //             let currentTop = parseInt($line.css('top'));

    //             switch (e.key) {
    //                 case "ArrowUp":
    //                     $line.css('top', currentTop - step + 'px');
    //                     break;
    //                 case "ArrowDown":
    //                     $line.css('top', currentTop + step + 'px');
    //                     break;
    //             }
    //         });

    //         // --------------------------
    //         // 더블클릭 → 화면 중앙 정렬
    //         // --------------------------
    //         $line.on('dblclick', function () {
    //             $line.css('top', '50%');
    //         });

    //         lines.push($line);
    //     }

    //     return lines;
    // }


    // 사용 예시
    // $(function() {
    //     // const horizontalLines = createHorizontalGuides({
    //     //     count: 2,       
    //     //     color: 'rgba(255,0,0,0.5)',
    //     //     thickness: 30,
    //     //     spacing: 40     
    //     // });        
    // });



// $('#myCheckbox').on('click', function() { 
//     if ($(this).is(':checked')) {
//         $('.wrap-login .certification-list.any-box').css({"display":"flex"});
//         $('.wrap-login .certification-list.unipass-box').css({"display":"none"});
//         $('.wrap-login .title-top:not(.sign-up) .right-box .user-box').css({"display":"flex"});
//         $('.wrap-login .title-top:not(.sign-up) .left-box .title-type').text('Any 로그인')
//     } else {
//         console.log("체크되지 않음");
//         $('.wrap-login .certification-list.any-box').css({"display":"none"});
//         $('.wrap-login .certification-list.unipass-box').css({"display":"flex"});
//         $('.wrap-login .title-top:not(.sign-up) .right-box .user-box:not(.tooltip)').css({"display":"none"});
//         $('.wrap-login .title-top:not(.sign-up) .left-box .title-type').text('유니패스 로그인')
//     }
// });

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
        //console.error("잘못된 옵션 형식. 옵션값이 제대로 들어가 있는지 확인해주세요.", el);

        /* 스패로우 이슈(빈 catch 블록) */
        var ignored = true;
    }
    return obj;
}