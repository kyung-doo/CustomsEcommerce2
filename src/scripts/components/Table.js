import $ from 'jquery';

class Table {

    static DEFAULT_PROPS = {
        apiPath: '',
        tableType: 'default1',
        caption: '',
        noLimit: false
    }

    constructor( ele, props ) {
        this.ele = ele;
        this.props = props;
        this.page = this.getHashParam('page') ? this.getHashParam('page') : 1;
        this.limit = this.getHashParam('limit') ? this.getHashParam('limit') : 10;
        this.data;
        this.init();
    }

    async init () {
        $(window).on("hashchange", async () => {
            this.onHashChange();
        });
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
        boardTop.find('select').on('change', () => {
            this.limit = boardTop.find('select').val();
            this.page = 1;
            location.href = `${location.href.split('#')[0]}#page=${this.page}&limit=${this.limit}`;
        });
    }

    setPagination () {
        const pagination = this.ele.find('.pagination');
        pagination.pagination({
            viewCount: this.data.pagingCount,
            totalPages: this.data.totalPages,
            initPage: this.page
        });
        pagination.on('change', (e, page) => {
            this.page = page;
            location.href = `${location.href.split('#')[0]}#page=${this.page}&limit=${this.limit}`;
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
            this.data.head.forEach(head => {
                tablePC.find('colgroup').append(`<col style="width: ${head.width};">`);
                if(head.useSort) {
                    tablePC.find('thead tr').append(`<th><span class="arr-ico">${head.text}<button class="th-turn"><i class="sr-only">내림차순</i></button></span></th>`);
                } else {
                    tablePC.find('thead tr').append(`<th>${head.text}</th>`);
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
                tablePC.find('td input[type="checkbox"]').prop('checked', $(this).is(':checked'))
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
                    if(data.link) {
                        tr.append(`<td><a href="${data.link}">${data.text}</a></td>`);
                    } else {
                        tr.append(`<td>${data.text}</td>`);
                    }
                }
            });
        });
        tablePC.find('td input[type="checkbox"]').off('change').on('change', () => {
            if(tablePC.find('td input[type="checkbox"]:checked').length === this.data.body.length) {
                tablePC.find('th input[type="checkbox"]').prop('checked', true);
            } else {
                tablePC.find('th input[type="checkbox"]').prop('checked', false);
            }
        });

        tableM.find('tbody').empty();
        this.data.body.forEach((body, i) => {
            const li = $('<li></li>')
        });
        
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