const express = require("express");
const app = express();
const PORT = 9001;

const listLength = 500;

function getRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

const data = Array.from({ length: listLength }, (_, i) => ([
    { uid: i + 1, useCheckbox: true },
    { text : i + 1, align: 'center', width: '80px'},
    { text : getRandomDate(new Date("2020-01-01"), new Date("2023-12-31")), align: 'center', width: '131px' },
    { text : '1234123412-123456789101', align: 'center', width: '20.7031%', link: '/pages/pages_7-2.html' },
    { text : 'Abc123456789 외 1건', align: 'center', width: '16.4062%' },
    { text : '판매자명이들어갑니다', align: 'center', width: '14.8437%' },
    { text : '물품명이들어갑니다', align: 'center', width: '14.8437%' },
    { text : '반출완료', align: 'center', width: '12.5%' }
]));

module.exports = data;


app.get("/board1", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data.slice(startIndex, endIndex);
    res.json({
        page,
        limit,
        limitList: [10, 20, 30],
        listLength: listLength,
        totalPages: Math.ceil(data.length / limit),
        pagingCount: 9,
        head: [
            {text: 'NO'},
            {text: '신고일자', useSort: true},
            {text: '운송장번호(H.B/L)'},
            {text: '주문번호'},
            {text: '판매자명'},
            {text: '물품명'},
            {text: '처리상태'},
        ],
        body: results,
    });
});

app.listen(PORT, () => {
  console.log(`Dummy API server running on http://localhost:${PORT}`);
});
