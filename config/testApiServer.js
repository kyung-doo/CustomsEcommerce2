const express = require("express");
const app = express();
const PORT = 9001;

const listLength = 500;

function getRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

const data1 = Array.from({ length: listLength }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      no : i+1,
      date : getRandomDate(new Date("2020-01-01"), new Date("2023-12-31")),
      key1 : '1234123412-123456789101'+i,
      key2 : 'Abc123456789 외 1건'+i,
      key3 : '판매자명이들어갑니다'+i,
      key4 : '/pages/pages_7-2.html',
      key5 : '조회'+i
    }
));

app.get("/board1", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data1.slice(startIndex, endIndex);
    res.json({
        page,
        limit,
        limitList: [10, 20, 30],
        listLength: listLength,
        totalPages: Math.ceil(data1.length / limit),
        pagingCount: 9,
        data: results,
    });
});

const data2 = Array.from({ length: listLength }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      key1 : i < 10 ? "00" + i : i < 100 ? "0" + i : i.toString(),
      key2 : 'TELEVISION 1234567890 TELEVISION 1234567890'+i,
      key3 : '434124231M'+i,
      key4 : '113,421',
      key5 : '113,421',
      key6 : i
    }
));

app.get("/board2", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data2.slice(startIndex, endIndex);
    res.json({
        page,
        limit,
        limitList: [10, 20, 30],
        listLength: listLength,
        totalPages: Math.ceil(data2.length / limit),
        pagingCount: 9,
        data: results,
    });
});


const data3 = Array.from({ length: 15 }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      no : i+1,
      key1 : '우리집'+i,
      key2 : '35351',
      key3 : '대전광역시 서구 월평동123-'+i,
      key4 : `우리집빌라 30${i}호`,
    }
));

app.get("/board3", (req, res) => {
    res.json({
        listLength: data3.length,
        data: data3,
    });
});

const data4 = Array.from({ length: listLength }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      no : i+1,
      key1 : i+'_개인통관고유부호 갱신 안내개인통관고유부호 갱신 안내개인통관고유부호 갱신 안내개인통관고유부호 갱신 안내개인통관고유부호 갱신 안내',
      key2 : '2025-05-30',
      key3 : '접수대기',
    }
));

app.get("/board4", (req, res) => {
  const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data4.slice(startIndex, endIndex);
    res.json({
        page,
        limit,
        limitList: [10, 20, 30],
        listLength: listLength,
        totalPages: Math.ceil(data4.length / limit),
        pagingCount: 9,
        data: results,
    });
});


const data5 = Array.from({ length: 5 }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      key1 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key2 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key3 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key4 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key5 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key6 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key7 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key8 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    }
));

app.get("/board5", (req, res) => {
    res.json({
        listLength: data5.length,
        data: data5,
    });
});


const data6 = Array.from({ length: 12 }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      key1 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key2 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key3 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key4 : String(parseInt(Math.random() * 10000000)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    }
));

app.get("/board6", (req, res) => {
    res.json({
        listLength: data6.length,
        data: data6,
    });
});


app.listen(PORT, () => {
  console.log(`Dummy API server running on http://localhost:${PORT}`);
});
