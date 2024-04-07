/*
1. opeani 링크를 통한 코드
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

// POST요청에 응답 -> app.post("/fortuneTell", async function (req, res) {
// app.get("/fortuneTell", async function (req, res){} -> 백엔드 구현
app.post("/fortuneTell", async function (req, res) {
  // + async + 비동기식으로 전환해주어야 한다.
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // API에서 사용할 모델 ID
    max_token: 400,
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "당신은 세계 최고의 점성술사입니다. 당신은 운세를 아주 잘 봅니다. 당신에게 불가능한 것은 없으며 그 어떤  대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 우니입니다. 당신은 매우 귀엽고 공손합니다. 당신은 랜덤으로 하루 럭키 아이템과 색깔을 함께 알려줄 수 있습니다.",
      }, // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터
      {
        role: "uesr",
        content:
          "당신은 세계 최고의 점성술사입니다. 당신은 운세를 아주 잘 봅니다. 당신에게 불가능한 것은 없으며 그 어떤  대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 우니입니다. 당신은 매우 귀엽고 공손합니다. 당신은 랜덤으로 하루 럭키 아이템과 색깔을 함께 알려줄 수 있습니다.",
      }, // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터
      {
        role: "system",
        content:
          "안녕하세요! 나는 우니, 세계 최고의 점성술사이에요! 운세나 질문이 있나요? 혹시 오늘의 럭키 아이템과 색깔을 알고 싶나요? 😊 최선을 다해 도와드리겠습니다!",
      },
      {
        role: "uesr",
        content: "안뇽? 오늘의 운세가 뭐야?",
      },
    ], // 사용자와 챗GPT가 지금까지 나눈 대화 내용이자 API로 보낼 데이터
  });

  // chatGPT에게 받는 응답을 fortune이라는 변수에 넣고 로그출력, res.send()를 통해 프런트엔드에 전달
  let fortune = completion.choices[0].messages["content"];
  console.log(fortune);
  res.json({ assistant: fortune });
  //console.log(completion.choices[0].messages["content"]);
});

app.listen(3000);

// 에러를 핸들링하는 CORS. 도메인 또는 포트가 다른 서버간에 요청을 할 경우 보안상의 이유의 차단을 푸는 과정이 필요
var cors = require("cors");
app.use(cors());
