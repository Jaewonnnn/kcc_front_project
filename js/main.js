// employees.html 삽입
$(function () {
  fetch("../employees.html") // 불러올 HTML 파일
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("sub-box").innerHTML = data; // 내용을 삽입

      const script = document.createElement("script");
      script.src = "./employees.js";
      document.body.appendChild(script);
    });
});
