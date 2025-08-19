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
      key4 : String(parseInt(Math.abs(Math.random() * 10000000 - 500000))).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      key5 : String(parseInt(Math.abs(Math.random() * 10000000 - 500000))).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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


const data6 = () => Array.from({ length: 12 }, (_, i) => (
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
        data: data6(),
    });
});


const data7 = Array.from({ length: listLength }, (_, i) => (
    { 
      uid: `id-${i+1}`,
      no : i+1,
      key1 : '개인통관고유부호-'+(i+1),
      key2 : '개인통관고유부호 신청 방법이 궁금합니다'+(i+1),
      key3 : '개인통관고유부호 신청 방법은 아래의 게시글을 확인하시고 본인인증 후 서비스를 이용하시기 바랍니다.',
      key4: '소학교 때 책상을 같이 했던 아이들의 이름과 패, 경, 옥 이런 이국소녀들의 이름과 벌써 아기 어머니된 계집애들의 이름과, 가난한 이웃 사람들의 이름과, 비둘기, 강아지, 토끼, 노새, 노루, 프랑시스 잠, 라이너 마리아 릴케 이런 시인의 이름을 불러 봅니다. 가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아침이 오는 까닭이요, 내일 밤이 남은 까닭이요, 아직 나의 청춘이 다하지 않은 까닭입니다.',
      files: i % 2 === 0 ? [
        {
          name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
          format: 'hwp',
          size: '17KB',
          url: '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp'
        },
        {
          name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
          format: 'hwp',
          size: '17KB',
          url: '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp'
        }
      ] : []
    }
));

app.get("/faq", (req, res) => {
  const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data7.slice(startIndex, endIndex);
    res.json({
        page,
        limit,
        limitList: [10, 20, 30],
        listLength: listLength,
        totalPages: Math.ceil(data7.length / limit),
        pagingCount: 9,
        data: results,
    });
});

app.listen(PORT, () => {
  console.log(`Dummy API server running on http://localhost:${PORT}`);
});
