const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault();
  const body = new FormData(form);

  //insertAt이라는 컬럼에 new Date().getTime()이라는 값 넣음, new Date().getTime() = timestamp
  body.append("insertAt", new Date().getTime());

  //try 안에 있는 로직에서 에러가 발생하면 catch 안의 로직이 실행됨
  try {
    const res = await fetch("/items", {
      method: "POST",
      body: body,
    });
    // 글 작성 후 메인 페이지로 다시 보내주기 위한 코드
    const data = await res.json();
    // location이라는 객체를 참고해서 pathname을 바꿔줌
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error(e); //에러 메시지 출력
  }
};

form.addEventListener("submit", handleSubmitForm);
