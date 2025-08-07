import $ from 'jquery';

class Table {

    static DEFAULT_PROPS = {
        apiPath: '',
        apiType: 'get',
        tableType: 'default1',
        caption: '',
        noLimit: false,
        useHashParam: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.page = this.getHashParam('page') ? this.getHashParam('page') : 1;
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
        await this.loadData();
        if(this.ele.find('.board-top').length > 0) {
            this.setBoardTop();
        }
        if(this.ele.find('.pagination').length > 0) {
            this.setPagination();
        }
        if(this.props.tableType === 'crud') {
            this.setCrudTable();
        }
    }

    async onHashChange  () {
        this.page = this.getHashParam("page");
        this.limit = this.getHashParam("limit");
        this.ele.find('.board-top select').val(this.limit);
        this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
        await this.loadData();
        this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
        if(this.props.tableType === 'crud') {
            this.setCrudTable();
        }
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
                await this.loadData();
                this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                if(this.props.tableType === 'crud') {
                    this.setCrudTable();
                }
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
                await this.loadData();
                this.ele.find('.pagination').pagination('setPage', [this.page, this.data.totalPages]);
                if(this.props.tableType === 'crud') {
                    this.setCrudTable();
                }
            }
        });
    }

    setCrudTable (onlyBody) {
        const table = this.ele.find('.wrap-crud-tbl');
        const tablePC = table.find('.table-wrap.pc');
        const tableM = table.find('.table-wrap.mo');
        
        if(!onlyBody) {
            const htmlPC = `
                <table class="tbl col crud">
                <caption>${this.props.caption}</caption> 
                <colgroup></colgroup>
                <thead></thead>
                <tbody></tbody>
                </table>
            `;
            tablePC.empty().html(htmlPC);
            tablePC.find('colgroup').append(`<col style="width: 52px;">`);
            tablePC.find('thead').append(`<tr></tr>`);
            tablePC.find('thead tr').append(`
                <th scope="col">
                    <div class="form-check medium">
                        <input type="checkbox" id="all-chk">
                        <label for="all-chk"><span class="sr-only">전체선택</span></label>
                    </div>
                </th>
            `);
            this.data.head.forEach((head, i) => {
                tablePC.find('colgroup').append(`<col style="width: ${head.width};">`);
                if(head.useSort) {
                    tablePC.find('thead tr').append(`<th style="${head.style ?? ''}"><span class="arr-ico">${head.text}<button class="th-turn"><i class="sr-only">내림차순</i></button></span></th>`);
                } else {
                    tablePC.find('thead tr').append(`<th style="${head.style ?? ''}">${head.text}</th>`);
                }
                if(head.tooltip) {
                    this.addToolTip(tablePC.find('thead tr th').eq(i+1), head.tooltip);
                }
            });
            const owner = this;
            tablePC.find('.th-turn').each(function ( i ) {
                $(this).off('click').on('click', function () {
                    tablePC.find('.th-turn').each(function ( j ) {
                        if(i !== j) {
                            tablePC.find('.th-turn').eq(j).removeClass('active');
                        } else {
                            if(!tablePC.find('.th-turn').eq(j).hasClass('active')) {
                                tablePC.find('.th-turn').eq(j).addClass('active');
                                owner.sortData('desc', tablePC.find('.th-turn').eq(j).parent().parent().index());
                            } else {
                                tablePC.find('.th-turn').eq(j).removeClass('active');
                                owner.sortData('asc', tablePC.find('.th-turn').eq(j).parent().parent().index());
                            }
                        }
                    });
                });
            });

            tablePC.find('th input[type="checkbox"]').on('change', function ( e ) {
                tablePC.find('td input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                tableM.find('.header input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                tableM.find('li input[type="checkbox"]').prop('checked', $(this).is(':checked'));
            });

            const htmlM = `
                <div class="header">
                    <div class="form-check medium">
                        <input type="checkbox" id="m-all-chk">
                        <label for="m-all-chk">전체선택</label>
                    </div>
                </div>
                <ul class="wrap-body"></ul>
            `;
            tableM.empty().html(htmlM);
            tableM.find('.header input[type="checkbox"]').on('change', function ( e ) {
                tablePC.find('th input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                tableM.find('li input[type="checkbox"]').prop('checked', $(this).is(':checked'));
                tablePC.find('td input[type="checkbox"]').prop('checked', $(this).is(':checked'));
            });

            this.setReisze(table);
        } else {
            tablePC.find('th input[type="checkbox"]').prop('checked', false);
            tableM.find('.header input[type="checkbox"]').prop('checked', false);
        }

        tablePC.find('tbody').empty();
        this.data.body.forEach((body, i) => {
            const tr = $(`<tr></tr>`)
            tablePC.find('tbody').append(tr);
            
            body.forEach((data, j) => {
                if(j === 0) {
                    tr.append(`
                        <td>
                            <div class="form-check medium">
                                <input type="checkbox" id="chk${i}">
                                <label for="chk${i}"><span class="sr-only">선택</span></label>
                            </div>
                        </td>  
                    `);
                } else {
                    if(data.button) {
                        tr.append(`<td style="${data.style ?? ''}"><button class="${data.class}" onclick="location.href='${data.link}'">${data.button}</button></td>`);
                    } else if(data.image) {
                        if(data.link) {
                            tr.append(`<td style="${data.style ?? ''}"><a href="${data.link}"><i class="${data.image}"></i></a></td>`);
                        } else {
                            tr.append(`<td style="${data.style ?? ''}"><i class="${data.image}"></i></td>`);
                        }
                    } else {
                        if(data.link) {
                            tr.append(`<td style="${data.style ?? ''}"><a class="cl-7" href="${data.link}">${data.text}</a></td>`);
                        } else {
                            tr.append(`<td style="${data.style ?? ''}">${data.text}</td>`);
                        }
                    }
                }
            });
        });

        tablePC.find('td input[type="checkbox"]').off('change').on('change', ( e ) => {
            let idx = $(e.target).parent().parent().parent().index();
            tableM.find('li input[type="checkbox"]').eq(idx).prop('checked', $(e.target).is(':checked'));
            if(tablePC.find('td input[type="checkbox"]:checked').length === this.data.body.length) {
                tablePC.find('th input[type="checkbox"]').prop('checked', true);
                tableM.find('.header input[type="checkbox"]').prop('checked', true);
            } else {
                tablePC.find('th input[type="checkbox"]').prop('checked', false);
                tableM.find('.header input[type="checkbox"]').prop('checked', false);
            }
        });

        tableM.find('tbody').empty();
        this.data.body.forEach((body, i) => {
            const li = $('<li><ul class="body"></ul></li>');
            tableM.find('.wrap-body').append(li);
            body.forEach((data, j) => {
                if(j === 0) {
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
                } else {
                    if(data.button) {
                        li.find('ul').append(`
                            <li>
                                <strong class="title">${this.data.head[j-1].text}</strong>
                                <span class="txt" style="${data.style}"><button onclick="location.href='${data.link}'" class="${data.class}">${data.button}</button></span>
                            </li> 
                        `);
                    } else if(data.image) {
                        if(data.link) {
                            li.find('ul').append(`
                                <li>
                                    <strong class="title">${this.data.head[j-1].text}</strong>
                                    <span class="txt" style="${data.style}"><a href="${data.link}"><i class="${data.image}"></i></a></span>
                                </li> 
                            `);
                        } else {
                            li.find('ul').append(`
                            <li>
                                <strong class="title">${this.data.head[j-1].text}</strong>
                                <span class="txt" style="${data.style}"><i class="${data.image}"></i></span>
                            </li> 
                        `);
                        }
                    } else {
                        if(data.link) {
                            li.find('ul').append(`
                                <li>
                                    <strong class="title">${this.data.head[j-1].text}</strong>
                                    <span class="txt" style="${data.style}"><a class="cl-7" href="${data.link}">${data.text}</a></span>
                                </li> 
                            `);
                        } else {
                            li.find('ul').append(`
                                <li>
                                    <strong class="title">${this.data.head[j-1].text}</strong>
                                    <span class="txt" style="${data.style}">${data.text}</span>
                                </li> 
                            `);
                        }
                    }
                    if(this.data.head[j-1].tooltip) {
                        this.addToolTip(li.find('ul li').eq(j).find('.title'), this.data.head[j-1].tooltip, 'top right');
                    }
                }
            });
        });

        tableM.find('li input[type="checkbox"]').off('change').on('change', (e) => {
            let idx = $(e.target).parent().parent().parent().parent().parent().index();
            tablePC.find('td input[type="checkbox"]').eq(idx).prop('checked', $(e.target).is(':checked'));
            if(tableM.find('li input[type="checkbox"]:checked').length === this.data.body.length) {
                tablePC.find('th input[type="checkbox"]').prop('checked', true);
                tableM.find('.header input[type="checkbox"]').prop('checked', true);
            } else {
                tablePC.find('th input[type="checkbox"]').prop('checked', false);
                tableM.find('.header input[type="checkbox"]').prop('checked', false);
            }
        });
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

    sortData (type, index) {
        if(type === 'desc') {
            this.data.body.sort((a, b) => {
                return a[index].text.localeCompare(b[index].text);
            });
        } else {
            this.data.body.sort((a, b) => {
                return b[index].text.localeCompare(a[index].text);
            });
        }
        if(this.props.tableType === 'crud') {
            this.setCrudTable(true);
        }
    }

    setReisze ( table ) {
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
        const tablePC = this.ele.find('.table-wrap.pc');
        const checked = [];
        const owner = this;
        tablePC.find('td input[type="checkbox"]').each(function () {
            if($(this).is(':checked')) {
                let idx = $(this).parent().parent().parent().index();
                checked.push(owner.data.body[idx][0].uid)
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