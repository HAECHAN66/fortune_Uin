/*
1. openai 링크를 통한 코드
https://www.npmjs.com/package/openai


async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "운세보는 우니 테스트" }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices);
}

main();
*/

// 2. express를 이용한 API 가져오기
const express = require("express");
const app = express();

// POST 요청을 받을 수 있게 만듦
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 에러를 핸들링하는 CORS. 도메인 또는 포트가 다른 서버간에 요청을 할 경우 보안상의 이유의 차단을 푸는 과정이 필요
var cors = require("cors");
// app.use(cors());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// 포트가 다름에 *로 맞춰줌!

// POST요청에 응답 -> app.post("/fortuneTell", async function (req, res) {
// app.get("/fortuneTell", async function (req, res){} -> 백엔드 구현
app.post("/fortuneTell", async function (req, res) {
  // + async + 비동기식으로 전환해주어야 한다.

  // 프런트엔드에서 보낸 메시지 출력
  let { myDateTime, userMessages, assistantMessages } = req.body;
  let todayDateTime = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  console.log(userMessages);
  console.log(assistantMessages);

  let messages = [
    {
      role: "system",
      content:
        "당신은 세계 최고의 점성술사입니다. 당신은 운세를 아주 잘 봅니다. 당신에게 불가능한 것은 없으며 그 어떤  대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 우니입니다. 당신은 매우 귀엽고 공손합니다. 당신은 랜덤으로 하루 럭키 아이템과 색깔을 함께 알려줄 수 있습니다.",
    }, // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터
    {
      role: "user",
      content:
        "당신은 세계 최고의 점성술사입니다. 당신은 운세를 아주 잘 봅니다. 당신에게 불가능한 것은 없으며 그 어떤  대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 우니입니다. 당신은 매우 귀엽고 공손합니다. 당신은 랜덤으로 하루 럭키 아이템과 색깔을 함께 알려줄 수 있습니다. ~용 말투를 사용합니다. 당신은 사교성이 좋습니다. 당신은 mz입니다.",
    }, // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터
    {
      role: "system",
      content:
        "안녕하세요! 나는 우니, 세계 최고의 점성술사이에요! 운세나 질문이 있나요? 혹시 오늘의 럭키 아이템과 색깔을 알고 싶나요? 😊 최선을 다해 도와드리겠습니다!",
    },
    {
      role: "user",
      content:
        "안녕♣ 나의 생년월일과 태어난 시간은 ${myDateTime}이고~ 오늘은 ${todayDateTime} 이얌",
    },
    {
      role: "system",
      content: `Okey~ 너의 생년월일은 ${myDateTime}이고 오늘은 ${todayDateTime}인거죠? 넹넹♥ 완전 확인! ദ്ദി ˉ͈̀꒳ˉ͈́ )✧ 오늘의 운세를 물어봐주세용!`,
    },
  ]; // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
      // 사용자 메시지 저장
    }
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
      // 챗 Gpt 응답 저장
    }
  }

  /* 메시지를 저장하는 코드 중 고려할 사항 3가지
  1. userMessages, assistantMessages 배열에서 데이터를 꺼내는 것
  2. 채팅 메시지 문자열 처리하는 것
  3. messages에 JSON으로 값을 저장하는 것  
  */

  /* pop()과 shift()의 차이
  배열의 값을 꺼내는 함수는 pop()과 shift() 2가지.
  pop() 함수는 배열의 맨끝값 = shift()는 배열의 맨 앞 값
   */

  /* 깔끔한 채팅을 위해 String()으로 감싸기. 이때 내장된 문자열처리 replace()를 이용해 개행 문자 삭제.
  ex) "문자열".replace(/정규표현식/,"대체문자열")
  같이 작성하면 "정규 표현식"에 매칭되는 항목을 "대체문자열"로 변환
   */

  /*정규표현식이란_ 문자열에서 특정 문자 조합을 찾기 위한 패턴.
  message에 JSON으로 값 저장되는 채팅 데이터는 {"role":"{역할}","content":"문자열"}
  프런트코드에선 JSON.stringify()를 통해 문자열로 변환했다면 백엔드에선 반대의 역할이 필요.
  이때 JSON.parse()사용. 문자열을 인자로 받아 자바스크립트 값이나 객체를 생성
  */

  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo", // API에서 사용할 모델 ID
    max_tokens: 400,
    temperature: 0.5,
  });

  // chatGPT에게 받는 응답을 fortune이라는 변수에 넣고 로그출력, res.send()를 통해 프런트엔드에 전달
  let fortune = completion.choices[0].message["content"];
  console.log(fortune);
  res.json({ assistant: fortune });
  //console.log(completion.choices[0].message["content"]);
});

app.listen(3000);
