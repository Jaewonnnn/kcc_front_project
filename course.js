$(function () {
  let courseList = [];

  // 강의 목록 조회
  $.ajax({
    url: "http://localhost:3009/lectures",
    type: "GET",
    dataType: "json",
    success: function (data) {
      displayCourses(data);
      courseList = data;
    },
  });

  // 강의 삭제 이벤트 핸들러
  $(document)
    .off("click", ".delete")
    .on("click", ".delete", function (e) {
      e.preventDefault();
      const lectureId = $(this).closest(".top_courses").data("id");
      const lectureName = $(this)
        .closest(".top_courses")
        .find(".course-title")
        .text();
      if (confirm(`${lectureName} 강의를 삭제하시겠습니까?`)) {
        deleteCourse(lectureId);
      }
    });

  // 강의 수정 이벤트 핸들러
  $(document)
    .off("click", ".update")
    .on("click", ".update", function (e) {
      e.preventDefault();
      const lectureId = $(this).closest(".top_courses").data("id");
      getCourse(lectureId);
    });

  // 모달 폼 클릭 이벤트 방지
  $(document).on("click", "#modal_body", function (e) {
    e.stopPropagation(); // 모달 내부 클릭 시 이벤트 전파 방지
  });

  // 모달 외부 클릭 시 모달 닫히도록 처리
  $(document).on("click", "#modal", function (e) {
    if (e.target.id === "modal") {
      // 모달 외부를 클릭했을 때만 닫기
      $("#modal").fadeOut();
      $("#modal_body").fadeOut();
    }
  });

  // update-course 버튼 클릭 이벤트 핸들러
  $(document).on("click", ".update-course", function (e) {
    e.preventDefault();
    const lectureId = $("#modal").data("id");
    const updatedCourse = {
      name: $("#courseName").val(),
      content: $("#courseContent").val(),
      detail: $("#courseDetail").val(),
      requirements: $("#courseRequirements").val(),
      totalEnrollment: parseInt($("#totalEnrollment").val(), 10),
      img: $("#courseImage").val(),
      rating: parseFloat($("#courseRating").val()),
    };
    updateCourse(lectureId, updatedCourse);
  });
});

// 강의 정보 가져오기 함수
function getCourse(id) {
  $.ajax({
    url: `http://localhost:3009/lectures/${id}`,
    type: "GET",
    success: function (data) {
      $("#sub-box").append(`
        <div id="modal" data-id="${id}">
          <div id="modal_body">
            <form id="addCourseForm">
              <div class="mb-3">
                <label for="courseName" class="form-label">강의명</label>
                <input type="text" class="form-control" id="courseName" value="${data.name}" required />
              </div>
              <div class="mb-3">
                <label for="courseContent" class="form-label">강의 내용</label>
                <textarea class="form-control" id="courseContent" rows="3" required>${data.content}</textarea>
              </div>
              <div class="mb-3">
                <label for="courseDetail" class="form-label">강의 상세 설명</label>
                <textarea class="form-control" id="courseDetail" rows="3" required>${data.detail}</textarea>
              </div>
              <div class="mb-3">
                <label for="courseRequirements" class="form-label">필요 조건</label>
                <input type="text" class="form-control" id="courseRequirements" value="${data.requirements}" required />
              </div>
              <div class="mb-3">
                <label for="totalEnrollment" class="form-label">총 수강 인원</label>
                <input type="number" class="form-control" id="totalEnrollment" value="${data.totalEnrollment}" required />
              </div>
              <div class="mb-3">
                <label for="courseImage" class="form-label">이미지 URL</label>
                <input type="text" class="form-control" id="courseImage" value="${data.img}" required />
              </div>
              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupFile02">첨부파일</label>
                <input type="file" class="form-control" id="inputGroupFile02">
              </div>
              <div class="mb-3">
                <label for="courseRating" class="form-label">평점</label>
                <input type="number" class="form-control" id="courseRating" step="0.1" min="0" max="5" value="${data.rating}" required />
              </div>
              <button type="button" class="btn btn-primary update-course">강의 수정</button>
            </form>
          </div>
        </div>
      `);
      $("#modal").fadeIn();
      $("#modal_body").fadeIn();
    },
  });
}

// 강의 삭제 함수
function deleteCourse(id) {
  $.ajax({
    url: `http://localhost:3009/lectures/${id}`,
    type: "DELETE",
    success: function () {
      courseList = courseList.filter((course) => course.id !== id);
      displayCourses(courseList);
    },
  });
}

// 강의 업데이트 함수
function updateCourse(id, updatedCourse) {
  $.ajax({
    url: `http://localhost:3009/lectures/${id}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedCourse),
    success: function () {
      courseList = courseList.map((course) =>
        course.id === id ? { ...course, ...updatedCourse } : course
      );

      $("#modal").fadeOut();
      $("#modal_body").fadeOut();
    },
  });
  displayCourses(courseList);
}

// 강의 목록 표시 함수
function displayCourses(data) {
  $("#container").empty();
  data.forEach((lecture) => {
    $("#container").append(`
      <div class="col-12 col-lg-4 col-xl-3 col-sm-6 mb-4 top_courses" data-id="${lecture.id}">
        <div class="course_box mb-0 border-r-20">
          <div class="thumb position-relative mb-3">
            <img src="${lecture.img}" class="img-fluid w-100" alt="course_img">
            <p class="course-title">${lecture.name}</p>
            <span class="class">직무</br></span>
            <span class="due-date">학습 기간 : 서비스 종료 시 까지</span></br></br>
            <div class="row">
              <div class="col-6"></div>
              <div class="col-6">
                <button type="button" class="btn btn-primary update" data-bs-toggle="modal" data-bs-target="#staticBackdrop">수정</button>
                <button type="button" class="btn btn-danger delete">삭제</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  });
}
