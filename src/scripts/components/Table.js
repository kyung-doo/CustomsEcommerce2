import $ from 'jquery';

class Table {

    static DEFAULT_PROPS = {
        apiPath: '',
        apiType: 'get',
        tableType: 'default',
        caption: '',
        noLimit: false,
        useResize: true,
        useHashParam: false,
        head: [],
        body: [],
        headCreaed: null,
        rowCreated: null,
        created: null
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        if(props.useHashParam) {
            this.page = this.getHashParam('page') ? this.getHashParam('page') : 1;
        } else {
            this.page = 1;
        }
        this.limit = this.getHashParam('limit') ? this.getHashParam('limit') : 10;
        this.data;
        this.startX = 0;
        this.startWidth = 0;
        this.touchIndex = 0;
        this.init();
    }

    async init () {
        if(this.props.useHashParam) {
            $(window).on("hashchange", async () => {
                this.onHashChange();
            });
        }
        this.setHead();

        try {
            await this.loadData();
            if(this.ele.find('.board-top').length > 0) {
                this.setBoardTop();
            }
            if(this.ele.find('.pagination').length > 0) {
                this.setPagination();
            }
            this.setBody();
        } catch(e) {}
    }

    async onHashChange  () {
        this.page = this.getHashParam("page");
        this.limit = this.getHashParam("limit");
        this.ele.find('.board-top select').val(this.limit);
        this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
        try {
            await this.loadData();
            this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
            this.setHead();
            this.setBody();
        } catch(e) {}
    }

    loadData () {
        return new Promise((resolve, reject) => {
            let data = null;
            if(!this.props.noLimit) {
                data = { 
                    page: this.page,
                    limit: this.limit
                }
            }
            $.ajax({
                type: this.props.apiType,
                url: this.props.apiPath,
                dataType: 'json',
                data: data,
                success: ( res ) => {
                    this.data = res;
                    resolve();
                },
                error: (request, status, error) => {
                    reject();
                }
            });
        });
    }

    getHashParam( key ) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return parseInt(params.get(key));
    }

    setBoardTop () {
        const boardTop = this.ele.find('.board-top');
        this.data.limitList.forEach(limit => {
            boardTop.find('select').append(`<option value="${limit}">${limit}개씩 보기</option>`);
        });
        boardTop.find('.tit strong').text(this.data.listLength)
        boardTop.find('select').val(this.limit);
        boardTop.find('select').on('change', async () => {
            this.limit = boardTop.find('select').val();
            this.page = 1;
            if(this.props.useHashParam) {
                location.href = `${location.href.split('#')[0]}#page=${this.page}&limit=${this.limit}`;
            } else {
                this.ele.find('.board-top select').val(this.limit);
                this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                try {
                    await this.loadData();
                    this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                    this.setHead();
                    this.setBody();
                } catch( e ) {}
            }
        });
    }

    setPagination () {
        const pagination = this.ele.find('.pagination');
        pagination.pagination({
            viewCount: this.data.pagingCount,
            totalPages: this.data.totalPages,
            initPage: this.page
        });
        pagination.on('change', async (e, page) => {
            this.page = page;
            if(this.props.useHashParam) {
                location.href = `${location.href.split('#')[0]}#page=${this.page}&limit=${this.limit}`;
            } else {
                this.ele.find('.board-top select').val(this.limit);
                this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                try {
                    await this.loadData();
                    this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                    this.setHead();
                    this.setBody();
                } catch( e ) {}
            }
        });
    }

    setHead () {
        
        const table = this.ele.find('.table-content');
        const tablePC = table.find('.table-wrap').eq(0);
        const tableM = table.find('.table-wrap').eq(1);

        const htmlPC = `
            <table class="tbl col crud">
                <caption>${this.props.caption}</caption> 
                <colgroup></colgroup>
                <thead></thead>
                <tbody></tbody>
            </table>
        `;
        tablePC.empty().html(htmlPC);
        tablePC.find('thead').append(`<tr></tr>`);
        if(this.props.tableType === 'crud') {
            tablePC.find('colgroup').append(`<col style="width: 52px;">`);
            tablePC.find('thead tr').append(`
                <th scope="col">
                    <div class="form-check medium">
                        <input type="checkbox" id="all-chk">
                        <label for="all-chk"><span class="sr-only">전체선택</span></label>
                    </div>
                </th>
            `);
        }

        this.props.head.forEach((head, i) => {
            tablePC.find('colgroup').append(`<col style="width: ${head.width};">`);
            if(head.sort) {
                tablePC.find('thead tr').append(`<th><span class="arr-ico">${head.name}<button class="th-turn"><i class="sr-only">내림차순</i></button></span></th>`);
            } else {
                tablePC.find('thead tr').append(`<th>${head.name}</th>`);
            }
            if(head.tooltip) {
                this.addToolTip(tablePC.find('thead tr th').eq(i+1), head.tooltip);
            }
        });

        // sorting
        const owner = this;
        tablePC.find('.th-turn').each(function ( i ) {
            $(this).off('click').on('click', function () {
                tablePC.find('.th-turn').each(function ( j ) {
                    if(i !== j) {
                        tablePC.find('.th-turn').eq(j).removeClass('active');
                    } else {
                        const idx = tablePC.find('.th-turn').eq(j).parent().parent().index();
                        if(!tablePC.find('.th-turn').eq(j).hasClass('active')) {
                            tablePC.find('.th-turn').eq(j).addClass('active');
                            if(owner.props.tableType === 'crud') {
                                owner.sortData('desc', owner.props.body[idx-1].label);
                            } else {
                                owner.sortData('desc', owner.props.body[idx].label);
                            }
                        } else {
                            tablePC.find('.th-turn').eq(j).removeClass('active');
                            if(owner.props.tableType === 'crud') {
                                owner.sortData('asc', owner.props.body[idx-1].label);
                            } else {
                                owner.sortData('asc', owner.props.body[idx].label);
                            }
                        }
                    }
                });
            });
        });

        if(tableM.length > 0) {
            let htmlM ='' 
            if(this.props.tableType === 'crud') {
                htmlM = `
                    <div class="header">
                        <div class="form-check medium">
                            <input type="checkbox" id="m-all-chk">
                            <label for="m-all-chk">전체선택</label>
                        </div>
                    </div>
                    <ul class="wrap-body"></ul>
                `;
            } 
            // else if(this.props.tableType === 'address') {
            //     htmlM = `<ul class="wrap-body box-line"></ul>`;
            // } 
            else {
                htmlM = `<ul class="wrap-body"></ul>`;
            }

            tableM.empty().html(htmlM);
        }

        if(this.props.headCreated) {
            this.props.headCreated(tablePC.find('thead tr')[0], tableM.length > 0 ? tableM.find('.wrap-body')[0] : null, this.props.head);
        }

        if(this.props.tableType === 'crud') {
            tablePC.find('th input[type="checkbox"]').on('change', function ( e ) {
                tablePC.find('td input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                if(tableM.length > 0) {
                    tableM.find('.header input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                    tableM.find('li input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                }
            });
            tableM.find('.header input[type="checkbox"]').on('change', function ( e ) {
                tablePC.find('th input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                if(tableM.length > 0)   tableM.find('li input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                tablePC.find('td input[type="checkbox"]').prop('checked', $(this).is(':checked'));
            });
        }

        if(this.props.useResize) {
            this.setResize(table);
        }
    }

    setBody () {
        const table = this.ele.find('.table-content');
        const tablePC = table.find('.table-wrap').eq(0);
        const tableM = table.find('.table-wrap').eq(1);

        tablePC.find('tbody').empty();
        if(tableM.length > 0)   tableM.find('.wrap-body').empty();
        this.data.data.forEach((data, i) => {
            const tr = $(`<tr></tr>`);
            tablePC.find('tbody').append(tr);
            const li = $('<li><ul class="body"></ul></li>');
            if(tableM.length > 0)   tableM.find('.wrap-body').append(li);

            if(this.props.tableType === 'crud') {
                tr.append(`
                    <td>
                        <div class="form-check medium">
                            <input type="checkbox" id="chk${i}">
                            <label for="chk${i}"><span class="sr-only">선택</span></label>
                        </div>
                    </td>  
                `);
                if(tableM.length > 0) {
                    li.find('ul').append(`
                        <li>
                            <div class="title">
                                <div class="form-check medium">
                                    <input type="checkbox" id="m-chk${i}">
                                    <label for="m-chk${i}"><span class="sr-only">선택</span></label>
                                </div>
                            </div>                                 
                        </li>
                    `);
                }
            }
            this.props.body.forEach((body, j) => {
                tr.append(`
                    <td class="${body.align === 'left' ? 'text-left' : body.align === 'right' ? 'text-right' : ''}">
                        ${body.fomatter ? body.fomatter(data[body.label], data, false) : data[body.label]}
                    </td>
                `);
                
                if(tableM.length > 0) {
                    if(this.props.head[j].mobileHidden) {
                        li.find('ul').append(`
                            <li>
                                ${body.fomatter ? body.fomatter(data[body.label], data, true) : data[body.label]}
                            </li> 
                        `); 
                    } else {
                        li.find('ul').append(`
                            <li>
                                <strong class="title">${this.props.head[j].name}</strong>
                                <span class="txt">${body.fomatter ? body.fomatter(data[body.label], data, true) : data[body.label]}</span>
                            </li> 
                        `);
                    }
                }

                if(this.props.head[j].tooltip) {
                    this.addToolTip(li.find('ul li').eq(j+1).find('.title'), this.props.head[j].tooltip, 'top right');
                }
            });

            if(this.props.rowCreated) {
                this.props.rowCreated(tr, tableM.length > 0 ? li : null, data, i);
            }

        });

        if(this.props.tableType === 'crud') {
            tablePC.find('td input[type="checkbox"]').off('change').on('change', ( e ) => {
                let idx = $(e.target).parent().parent().parent().index();
                if(tableM.length > 0)   tableM.find('li input[type="checkbox"]').eq(idx).prop('checked', $(e.target).is(':checked'));
                if(tablePC.find('td input[type="checkbox"]:checked').length === this.data.data.length) {
                    tablePC.find('th input[type="checkbox"]').prop('checked', true);
                    if(tableM.length > 0)   tableM.find('.header input[type="checkbox"]').prop('checked', true);
                } else {
                    tablePC.find('th input[type="checkbox"]').prop('checked', false);
                    if(tableM.length > 0)   tableM.find('.header input[type="checkbox"]').prop('checked', false);
                }
            });
            if(tableM.length > 0) {
                tableM.find('li input[type="checkbox"]').off('change').on('change', (e) => {
                    let idx = $(e.target).parent().parent().parent().parent().parent().index();
                    tablePC.find('td input[type="checkbox"]').eq(idx).prop('checked', $(e.target).is(':checked'));
                    if(tableM.find('li input[type="checkbox"]:checked').length === this.data.data.length) {
                        tablePC.find('th input[type="checkbox"]').prop('checked', true);
                        tableM.find('.header input[type="checkbox"]').prop('checked', true);
                    } else {
                        tablePC.find('th input[type="checkbox"]').prop('checked', false);
                        tableM.find('.header input[type="checkbox"]').prop('checked', false);
                    }
                });
            }
        }

        if(this.props.created) {
            this.props.created(this.ele[0], this.data.data, this.props.head, this.props.body);
        }
    }

    addToolTip ( target, data, arrow ) {
        const text = target.text();
        target.text('');
        const tooltip = $(`
            <div class="tooltip-tit tit">
                <div class="title">
                    <span>${text}</span>
                    <div class="contextual-help ${arrow ?? data.arrow}">
                        <div class="tooltip-btn-area">                                 
                            <button class="tooltip-ico">도움말</button>
                            <div class="tooltip-action">                  
                            <div class="tooltip-popover">
                            <strong class="tooltip-title">${data.title}</strong>
                            <div class="tooltip-contents">
                                <p>${data.content}</p>
                                <div class="btn-wrap">
                                    <a href="${data.link}" class="btn link">바로가기</a>
                                </div>
                            </div>
                            <button type="button" class="btn tooltip-close">
                                <span class="sr-only">닫기</span>                        
                            </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        tooltip.find('.contextual-help').tooltip();
        target.append(tooltip);
        
    }

    sortData (type, key) {
        if(!this.data) return;
        if(type === 'desc') {
            this.data.data.sort((a, b) => {
                return String(a[key]).localeCompare(String(b[key]));
            });
        } else {
            this.data.data.sort((a, b) => {
                return String(b[key]).localeCompare(String(a[key]));
            });
        }
        this.setBody();
    }

    setResize ( table ) {
        table.find('th:not(:last-child)').append(`<span class="resize-point"></span`);
        table.find('.resize-point').on('mousedown', ( e ) => {
            this.onResizeDown(e, table)
        });
    }

    onResizeDown ( e, table ) {
        table.find('colgroup col').each(function () {
            $(this).css('width', $(this).width());
        });
        this.touchIndex = $(e.target).parent().index();
        this.startX = e.clientX;
        this.startWidth = table.find('colgroup col').eq(this.touchIndex).width();
        $(window).on('mousemove.table', ( e ) => {
            this.onResizeMove(e, table);
        });
        $(window).on('mouseup.table', ( e ) => {
            this.onResizeUp(e)
        });
        e.preventDefault();
    }

    onResizeMove ( e, table ) {
        const moveX = e.clientX;
        const width = moveX - this.startX;
        const minWidth = 80;
        let cwidth = this.startWidth + width;
        if (cwidth < minWidth) cwidth = minWidth;
        let bwidth = table.find('colgroup col').eq(this.touchIndex+1).width() + (table.find('colgroup col').eq(this.touchIndex).width() - cwidth);
        if (bwidth < minWidth) bwidth = minWidth;
        table.find('colgroup col').eq(this.touchIndex).css('width', cwidth);
        table.find('colgroup col').eq(this.touchIndex+1).css('width',  bwidth);
        e.preventDefault();
    }

    onResizeUp ( e ) {
        $(window).off('mousemove.table');
        $(window).off('mouseup.table');
    }


    getCheckData ( callback ) {
        const tablePC = this.ele.find('.table-wrap').eq(0);
        const checked = [];
        const owner = this;
        tablePC.find('td input[type="checkbox"]').each(function () {
            if($(this).is(':checked')) {
                let idx = $(this).parent().parent().parent().index();
                checked.push(owner.data.data[idx]);
            }
        });
        callback(checked);
    }
}

$.fn.table = Plugin;
$.fn.table.Constructor = Table;

function Plugin (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('table');
        var options =  $.extend({}, Table.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('table', (data = new Table($this, options)));
        if(typeof option == 'string') data[option](params);
    });
}