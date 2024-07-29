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

$(document).on("click", ".main>fa-clipboard", function () {
  // employees.html 파일 불러오기
  $("#sub-box").load("../employees.html", function () {
    // employees.js 스크립트 추가
    $.getScript("../employees.js");
  });
});

$(document).on("click", ".btn-light", function () {
  $("#sub-box").append(`
    <div id="modal" style="display: none;">
      <div id="modal_body">
        <div class="container mt-5">
          <h2 class="mb-4">강의 등록</h2>
          <form id="addCourseForm">
            <div class="mb-3">
              <label for="courseName" class="form-label">강의명</label>
              <input type="text" class="form-control" id="courseName" required />
            </div>
            <div class="mb-3">
              <label for="courseContent" class="form-label">강의 내용</label>
              <textarea class="form-control" id="courseContent" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label for="courseDetail" class="form-label">강의 상세 설명</label>
              <textarea class="form-control" id="courseDetail" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label for="courseRequirements" class="form-label">필요 조건</label>
              <input type="text" class="form-control" id="courseRequirements" required />
            </div>
            <div class="mb-3">
              <label for="totalEnrollment" class="form-label">총 수강 인원</label>
              <input type="number" class="form-control" id="totalEnrollment" required />
            </div>
            <div class="mb-3">
              <label for="courseImage" class="form-label">이미지 URL</label>
              <input type="text" class="form-control" id="courseImage" required />
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupFile02">첨부파일</label>
                <input type="file" class="form-control" id="inputGroupFile02">
              </div>
            <div class="mb-3">
              <label for="courseRating" class="form-label">평점</label>
              <input type="number" class="form-control" id="courseRating" step="0.1" min="0" max="5" required />
            </div>
            <button type="submit" class="btn btn-primary">강의 등록</button>
          </form>
        </div>
      </div>
    </div>
  `);

  $("#modal").fadeIn();
  $("#modal_body").fadeIn();
});

// 모달 외부 클릭 시 닫기
$(document).on("click", "#modal", function (e) {
  if (e.target.id === "modal") {
    // 모달 외부 클릭 시만 닫기
    $("#modal").fadeOut();
    $("#modal_body").fadeOut();
  }
});

// 모달 내부 클릭 시 이벤트 전파 방지
$(document).on("click", "#modal_body", function (e) {
  e.stopPropagation(); // 클릭 이벤트가 모달 외부로 전파되지 않도록 함
});

$(document).on("submit", "#addCourseForm", function (e) {
  e.preventDefault();
  const newCourse = {
    id: lectures.length + 1,
    name: $("#courseName").val(),
    content: $("#courseContent").val(),
    detail: $("#courseDetail").val(),
    requirements: $("#courseRequirements").val(),
    totalEnrollment: parseInt($("#totalEnrollment").val(), 10),
    img: $("#courseImage").val(),
    rating: parseFloat($("#courseRating").val()),
  };
  addCourse(newCourse);
});

// 강의 추가 함수
function addCourse(course) {
  $.ajax({
    url: "http://localhost:3009/lectures",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(course),
    success: function () {
      alert("강의가 성공적으로 등록되었습니다.");
      $("#modal").fadeOut();
      $("#modal_body").fadeOut();
    },
  });
}
