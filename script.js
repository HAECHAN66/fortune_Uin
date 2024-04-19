// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myDateTime = "";

function start() {
  const date = document.getElementById("date").value;
  const hour = document.getElementById("hour").value;
  if (date === "") {
    alert("생년월일을 입력해주라긔!ᕙ( ︡’︡益’︠)ง");
    return;
  }
  myDateTime = date + hour;
  document.getElementById("intro").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

async function sendMessage() {
  // 사용자의 메시지를 가져오기
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (message !== "") {
    displayMessage("익명이", message);

    //userMessage에 사용자의 메시지 저장
    userMessages.push(messageInput.value);

    // 입력 필드 초기화
    messageInput.value = "";

    // 운세 요청 보내기
    // 백엔드 서버에 메시지를 보내고 응답 출력
    async function sendFortuneRequest() {
      try {
        const response = await fetch("http://localhost:3000/fortuneTell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            myDateTime: myDateTime,
            userMessages: userMessages,
            assistantMessages: assistantMessages,
          }),
        });
        // JSON.stringify() 함수의 역할 프런트와 백엔드가 JSON 형태의 데이터를 주고 받을 때 활용. 문자열로 변환해주는 역할

        if (!response.ok) {
          throw new Error("Requset failed whit status" + response.status);
        }

        const data = await response.json();
        console.log("Response:", data);
        // assistantMessages에 챗 GPT의 메시지 저장
        assistantMessages.push(data.assistant);
        return data;
      } catch (error) {
        console.error("Error fetching fortune:", error);
        throw error;
      }
    }

    try {
      const fortuneData = await sendFortuneRequest();
      if (fortuneData && fortuneData.assistant) {
        displayMessage("우니", fortuneData.assistant);
        /*
        
        if (fortuneData && fortuneData.fortune) {
        displayMessage("우니", fortuneData.fortune);
        이었을땐 계속 console창에만 떴는데 assistant로 바꾸니까
        displace에도 드디어 뜸 ㅜㅜ!! 오류해결!
        
        */
      } else {
        displayMessage(
          "우니",
          "미아내~ 우니 운세를 못 봤어! 우니 대패닉(๑•́o•̀๑)"
        );
      }
    } catch (error) {
      console.error("운세 요청 에러:", error);
      displayMessage(
        "우니",
        "미아내~ 우니가 운세를 가져오는 데 문제가 생겨서 실패했어(ㅡㅅㅜ)"
      );
    }
  }
}

function displayMessage(sender, message) {
  const chatBody = document.getElementById("chat-body");
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.textContent = `${sender}: ${message}`;
  chatBody.appendChild(messageElement);
  // 스크롤을 아래로 이동
  chatBody.scrollTop = chatBody.scrollHeight;
}
