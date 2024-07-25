// $(function () {
//   $("body").empty();
//   // login.html 파일 불러오기
//   $.get("../login.html", function (data) {
//     $("body").html(data); // body 내용을 login.html로 변경
//     $("body").css("padding", "0");
//     $("body").css("margin", "0");
//     // login.js 스크립트 추가
//     $.getScript("./login.js");
//   });
// });

$(function () {
  // employees.html 파일 불러오기
  $("#sub-box").load("../employees.html", function () {
    // employees.js 스크립트 추가
    $.getScript("./employees.js");
  });
});
