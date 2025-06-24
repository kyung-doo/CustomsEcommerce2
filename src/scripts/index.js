import $ from 'jquery';
import '@/styles/index.scss';
import styleToJson from './utils/styleToJson';
import './components/Tabmenu';
import './components/Modal';
import './components/Tooltip';
import './components/Datepicker';
import './layouts/header';


// 전역변수
window.isMobile = false;
if('ontouchstart' in window){
    window.isMobile = true;
}
window.$ = $;



// 컴포넌트 UI 생성
$(() => {

    // 탭메뉴
    $(`*[data-ui="tabmenu"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).tabmenu(props);
    });

    // 모달 타겟
    $(`*[data-modal-target]`).each(function () {
        const modalSelector = $(this).data('modal-target');
        $(this).on("click", function () {
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
    
});