const form = document.querySelector("#signup-form");

//비밀번호, 비밀번호 확인 일치 확인 함수
const checkPassword = () => {
  const formData = new FormData(form);
  const password = formData.get("password");
  const password2 = formData.get("password2");
  if (password === password2) {
    return true;
  } else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  //비밀번호 암호화
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const infoDiv = document.querySelector("#info");

  if (checkPassword()) {
    const res = await fetch("/signup", {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    if (data === "200") {
      // infoDiv.innerText = "회원가입에 성공했습니다.";
      // infoDiv.style.color = "blue";
      alert("회원가입에 성공했습니다!");
      window.location.pathname = "/login.html";
    }
  } else {
    infoDiv.innerText = "비밀번호가 같지 않습니다.";
    infoDiv.style.color = "red";
  }
};

form.addEventListener("submit", handleSubmit);
