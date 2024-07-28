$(function () {
  const courseList = [];
  // 강의 목록 조회
  $.ajax({
    url: "http://localhost:3009/lectures",
    type: "GET",
    dataType: "json",
    success: function (data) {
      displayCourses(data); // AJAX에서 받은 데이터를 displayCourses 함수에 전달
      courseList = data;
    },
  });

  // 기존 이벤트 핸들러 제거 후 다시 등록
  $(document)
    .off("click", ".delete")
    .on("click", ".delete", function (e) {
      e.preventDefault();
      const lectureId = $(this).closest(".top_courses").data("id"); // 강의 ID 가져오기
      const lectureName = $(this)
        .closest(".top_courses")
        .find(".course-title")
        .text(); // 강의 이름 가져오기
      if (confirm(`${lectureName} 강의를 삭제하시겠습니까?`)) {
        deleteCourse(lectureId); // 강의 ID로 삭제 함수 호출
      }
    });
});

// 강의 삭제 함수
function deleteCourse(id) {
  $.ajax({
    url: `http://localhost:3009/lectures/${id}`, // DELETE 요청 URL에 강의 ID 포함
    type: "DELETE",
    success: function () {
      displayCourses(courseList);
    },
  });
}

// 강의 목록 표시 함수
function displayCourses(data) {
  $("#container").empty(); // 항상 컨테이너를 비움
  data.forEach((lecture) => {
    $("#container").append(
      `
          <div class="col-12 col-lg-4 col-xl-3 col-sm-6 mb-4 top_courses" data-id="${lecture.id}">
            <div class="course_box mb-0 border-r-20">
              <div class="thumb position-relative mb-3">
                <img src="${lecture.img}" class="img-fluid w-100" alt="course_img">
                <p class="course-title">${lecture.name}</p>
                <span class="class">직무</br></span>
                <span class="due-date">학습 기간 : 서비스 종료 시 까지</span></br></br>
                <div class="row">
                  <div class="col-6">
                  </div>
                  <div class="col-6">
                    <button type="button" class="btn btn-primary update" data-bs-toggle="modal" data-bs-target="#staticBackdrop">수정</button>
                    <button type="button" class="btn btn-danger delete">삭제</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
    );
  });
}
