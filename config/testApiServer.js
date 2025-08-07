const express = require("express");
const app = express();
const PORT = 9001;

const listLength = 500;

function getRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

const data = Array.from({ length: listLength }, (_, i) => ([
    { uid: `id-${i+1}` },
    { text : i+1, style: 'text-align: center;'},
    { text : getRandomDate(new Date("2020-01-01"), new Date("2023-12-31")), style: 'text-align: center;' },
    { text : '1234123412-123456789101', link: '/pages/pages_7-2.html', style: 'text-align: center;' },
    { text : 'Abc123456789 외 1건', style: 'text-align: left;color: green;font-weight: bold;' },
    { text : '판매자명이들어갑니다', style: 'text-align: center;' },
    { image : 'icon download large', link: '/pages/pages_7-2.html', style: 'text-align: center;' },
    { button : '조회', class: 'btn tertiary small', link: '/pages/pages_7-2.html', style: 'text-align: center;' },
]));

module.exports = data;


app.get("/board1", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
            {text: 'NO', width: '80px'},
            {text: '신고일자', width: '131px', useSort: true},
            {text: '운송장번호(H.B/L)', width: '20.7031%', style: 'text-align: left;color: red'},
            {text: '주문번호', width: '16.4062%', tooltip: {title: '이메일 주소', content: 'hong123@naver.com', link: '/pages/pages_7-2.html', arrow: 'bottom left'}},
            {text: '판매자명', width: '18.8437%'},
            {text: '물품명', width: '10.8437%'},
            {text: '처리상태', width: '12.5%'},
        ],
        body: results,
    });
});

app.listen(PORT, () => {
  console.log(`Dummy API server running on http://localhost:${PORT}`);
});
