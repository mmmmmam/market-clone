const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  //비밀번호 암호화
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });

  const data = await res.json();
  const accessToken = data.access_token;
  window.localStorage.setItem("token", accessToken); //localStorage: 브라우저를 닫았다 다시 켜도 저장
  //window.sessionStorage.setItem("token", accessToken); //sessionStorage: 브라우저를 닫으면 삭제

  if (res.status === 200) {
    alert("로그인에 성공했습니다!");
    // const infoDiv = document.querySelector("#info");
    // infoDiv.innerText = "로그인 성공";

    window.location.pathname = "/";

    // const btn = document.createElement("button");
    // btn.innerText = "상품";
    // btn.addEventListener("click", async () => {
    //   //HTTP 요청의 Header에 Access Token 담아서 요청하기
    //   const res = await fetch("/items", {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    //   const data = await res.json;
    //   console.log(data);
    // });
    // infoDiv.appendChild(btn);
  } else if (res.status === 401) {
    alert("id 혹은 password가 틀렸습니다.");
  }
};

form.addEventListener("submit", handleSubmit);
