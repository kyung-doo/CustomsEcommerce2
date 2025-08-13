import $ from "jquery";
import '@/styles/index.scss';
import styleToJson from './utils/styleToJson';
import './components/Tabmenu';
import './components/Modal';
import './components/Tooltip';
import './components/Datepicker';
import './components/Accordion';
import './components/Hiddeninput';
import './components/Pagination';
import './components/Table';
import './layouts/header';
import './layouts/main';

// 전역변수
global.isMobile = false;
if('ontouchstart' in window){
    global.isMobile = true;
}
global.$ = $;

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