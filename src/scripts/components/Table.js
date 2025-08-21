

class Table {

    static DEFAULT_PROPS = {
        apiPath: '',
        apiType: 'get',
        tableType: 'default',
        data: null,
        caption: '',
        noLimit: false,
        useResize: true,
        useHashParam: false,
        head: [],
        body: [],
        body1: [],
        body2: [],
        fileLabel: '',
        headCreaed: null,
        rowCreated: null,
        created: null,
        scrollTop: false,
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        if(props.useHashParam) {
            this.page = this.getHashParam('page') ? this.getHashParam('page') : 1;
        } else {
            this.page = this.props.data ? this.props.data.page ?? 1 : 1;
        }
        this.limit = this.getHashParam('limit') ? this.getHashParam('limit') : 10;
        this.data = this.props.data ?? {};
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
            this.scrollTop();
            this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
            this.setHead();
            this.setBody();
        } catch(e) {}
    }

    loadData () {
        return new Promise((resolve, reject) => {
            if(!this.props.data) {
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
            } else {
                resolve();
            }
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
                    this.scrollTop();
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
                    this.scrollTop();
                    this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                    this.setHead();
                    this.setBody();
                } catch( e ) {}
            }
        });
    }

    setHead () {
        
        const table = this.ele.find(this.props.tableType !== 'faq' ? '.table-content' : '.wrap-faq');
        if(this.props.tableType !== 'faq') {
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
                    this.addToolTip(tablePC.find('thead tr th').eq(this.props.tableType === 'crud' ? i+1 : i), head.tooltip);
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
                                    owner.sortData('desc', owner.props.body[idx-1].label, owner.props.head[idx-1].sort);
                                } else {
                                    owner.sortData('desc', owner.props.body[idx].label, owner.props.head[idx].sort);
                                }
                            } else {
                                tablePC.find('.th-turn').eq(j).removeClass('active');
                                if(owner.props.tableType === 'crud') {
                                    owner.sortData('asc', owner.props.body[idx-1].label, owner.props.head[idx-1].sort);
                                } else {
                                    owner.sortData('asc', owner.props.body[idx].label, owner.props.head[idx].sort);
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
                        <div class="wrap-body"></div>
                    `;
                } else {
                    htmlM = `<div class="wrap-body"></div>`;
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
        } else {
            const html = `
                <ul class="header"></ul>
                <div class="body"></div>
            `;
            table.empty().html(html);
            this.props.head.forEach((head, i) => {
                table.find('.header').append(`<li style="min-width: ${head.width};">${head.name}</li>`);
            });

            if(this.props.headCreated) {
                this.props.headCreated(table.find('.header'), null, this.props.head);
            }
        }
    }

    setBody () {
        const table = this.ele.find(this.props.tableType !== 'faq' ? '.table-content' : '.wrap-faq');
        if(this.props.tableType !== 'faq') {
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
                        this.addToolTip(li.find('ul li').eq(this.props.tableType === 'crud' ? j+1 : j).find('.title'), this.props.head[j].tooltip, 'top right');
                    }
                });

                if(this.props.rowCreated) {
                    this.props.rowCreated(tr, tableM.length > 0 ? li : null, data, i);
                }

            });

            if(this.props.created) {
                this.props.created(this.ele[0], this.data.data, this.props.head, this.props.body);
            }
            const owner = this;
            if(this.props.tableType === 'crud') {
                tablePC.find('td input[type="checkbox"]').each(function ( i ) {
                    $(this).off('change').on('change', ( e ) => {
                        if(tableM.length > 0)   tableM.find('li input[type="checkbox"]').eq(i).prop('checked', $(e.target).is(':checked'));
                        if(tablePC.find('td input[type="checkbox"]:checked').length === owner.data.data.length) {
                            tablePC.find('th input[type="checkbox"]').prop('checked', true);
                            if(tableM.length > 0)   tableM.find('.header input[type="checkbox"]').prop('checked', true);
                        } else {
                            tablePC.find('th input[type="checkbox"]').prop('checked', false);
                            if(tableM.length > 0)   tableM.find('.header input[type="checkbox"]').prop('checked', false);
                        }
                    });
                })
                
                if(tableM.length > 0) {
                    tableM.find('li input[type="checkbox"]').each(function (i) {
                        $(this).off('change').on('change', (e) => {
                            tablePC.find('td input[type="checkbox"]').eq(i).prop('checked', $(e.target).is(':checked'));
                            if(tableM.find('li input[type="checkbox"]:checked').length === owner.data.data.length) {
                                tablePC.find('th input[type="checkbox"]').prop('checked', true);
                                tableM.find('.header input[type="checkbox"]').prop('checked', true);
                            } else {
                                tablePC.find('th input[type="checkbox"]').prop('checked', false);
                                tableM.find('.header input[type="checkbox"]').prop('checked', false);
                            }
                        });
                    });
                }
            }
        } else {
            table.find('.body').empty();
            this.data.data.forEach((data, i) => {
                const li = $(`
                    <div class="accordion-wrap" data-ui="accordion" data-props="beforeClose: true;">
                        <div class="accordion-header"><ul></ul></div>
                        <div class="accordion-body d-none"></div>
                    </div
                `);
                table.find('.body').append(li);
                this.props.body1.forEach((body, j) => {
                    if(j === 0) {
                        li.find('.accordion-header ul').append(`
                            <li class="number" style="min-width: ${this.props.head[j].width}">
                                <strong class="txt">Q${data[body.label]}</strong>
                            </li>
                        `);
                    } else if(j === 1) {
                        li.find('.accordion-header ul').append(`
                            <li style="min-width: ${this.props.head[j].width}">
                                <span class="txt">${data[body.label]}</span>
                            </li>
                        `);
                    } else {
                        li.find('.accordion-header ul').append(`
                            <li style="min-width: ${this.props.head[j].width}">
                            <a href="javascript: void(0);" class="accordion-btn tb-title txt" title="열기">${data[body.label]}</a>
                            <i class="icon btn-arrow-down small"></i>
                            </li>
                        `);
                    }
                });
                li.find('.accordion-body').append(`
                    <strong class="number">A${data[this.props.body2[0].label]}</strong>
                    <div class="faq-box">
                        <strong class="title">${data[this.props.body2[1].label]}</strong>
                        <p class="txt">${data[this.props.body2[2].label]}</p>                              
                    </div>
                `);
                if(this.props.fileLabel) {
                    if(data[this.props.fileLabel].length > 0) {
                        li.find('.accordion-body').append(`
                            <h5 class="title-type3">첨부파일</h5>
                            <div class="file-upload line list">                              
                                <div class="file-list">                     
                                     <ul class="upload-list"></ul>
                                </div>
                            </div>
                        `);
                        data[this.props.fileLabel].forEach((file) => {
                            const fileList = $(`
                                <li>
                                    <div class="file-info m-column file-down">
                                        <div class="file-name">${file.name} [${file.format}, ${file.size}]</div>
                                        <div class="btn-wrap">
                                            <button type="button" class="btn text medium">
                                                <i class="icon download medium"></i> 다운로드
                                            </button>                                 
                                        </div>
                                    </div>
                                </li>
                            `);
                            li.find('.upload-list').append(fileList);
                            fileList.on('click', () => this.fileDown(file));
                        });
                    } else {
                        li.find('.faq-box').addClass('nofile');    
                    }

                } else {
                    li.find('.faq-box').addClass('nofile');
                }

                if(this.props.rowCreated) {
                    this.props.rowCreated(li, null, data, i);
                }

            });
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

    sortData (sort, key, type) {
        let sortType = 'string';
        if(type === 'number')  {
            sortType = 'number';
        }
        if(!this.data) return;
        if(sort === 'desc') {
            this.data.data.sort((a, b) => {
                if(sortType === 'string') {
                    return String(a[key]).localeCompare(String(b[key]));
                } else {
                    return parseInt(a[key].replace(/[^0-9]/g, "")) - parseInt(b[key].replace(/[^0-9]/g, ""));
                }
            });
        } else {
            this.data.data.sort((a, b) => {
                if(sortType === 'string') {
                    return String(b[key]).localeCompare(String(a[key]));
                } else {
                    return parseInt(b[key].replace(/[^0-9]/g, "")) - parseInt(a[key].replace(/[^0-9]/g, ""));
                }
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

    fileDown ( file ) {
        const element = document.createElement('a');
        element.setAttribute('href', file.url);
        element.setAttribute('download', file.name+'.'+file.format);
        element.click();
        $(element).remove();
    }

    scrollTop () {
        if(this.props.scrollTop) {
            $('html, body').scrollTop(this.ele.position().top + $("#header").height());
        }
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
    

    async update () {
        this.ele.find('.board-top select').val(this.limit);
        this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
        try {
            await this.loadData();
            this.scrollTop();
            this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
            this.setHead();
            this.setBody();
        } catch( e ) {}
    }
}

$.fn.table = function (option, params) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('table');
        var options =  $.extend({}, Table.DEFAULT_PROPS, typeof option == "object"  && option);
        if(!data || typeof data == 'string') $this.data('table', (data = new Table($this, options)));
        if(typeof option == 'string') data[option](params);
    });
};
$.fn.table.Constructor = Table;