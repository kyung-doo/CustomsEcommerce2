import $ from 'jquery';
import '@/styles/index.scss';
import styleToJson from './utils/styleToJson';
import './components/Tabmenu';
import './components/Modal';
import './layouts/header';


// 전역변수
window.isMobile = false;
if('ontouchstart' in window){
    window.isMobile = true;
}
window.$ = $;


// 모달 오픈
window.openModal = ( selector ) => {
    $(selector).modal('show');
}

// 모달 닫기
window.closeModal = ( selector ) => {
    $(selector).modal('hide');
}


// 컴포넌트 UI 생성
$(() => {

    // 탭메뉴
    $(`*[data-ui="tabmenu"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).tabmenu(props);
    });

    // 모달
    $(`*[data-ui="modal"]`).each(function () {
        const props = $(this).data('props') ? styleToJson($(this)[0], $(this).data('props')) : {};
        $(this).modal(props);
    });
    
});