$(function () {
  $("#addCourseForm").on("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    // 입력된 데이터 가져오기
    let newCourse = {
      id: Date.now().toString(), // 현재 시간을 ID로 사용
      name: $("#courseName").val(),
      content: $("#courseContent").val(),
      detail: $("#courseDetail").val(),
      requirements: $("#courseRequirements").val(), // "Requirements"를 "requirements"로 변경
      totalEnrollment: parseInt($("#totalEnrollment").val(), 10),
      img: $("#courseImage").val(),
      rating: parseFloat($("#courseRating").val()),
    };

    $.ajax({
      url: "http://localhost:3009/lectures",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newCourse),
      success: function () {
        alert("강의가 성공적으로 등록되었습니다!");
        $("#addCourseForm")[0].reset(); // 폼 초기화
      },
      error: function (jqXHR) {
        console.error("등록 실패:", jqXHR);
        alert("강의 등록에 실패했습니다: " + jqXHR.responseText);
      },
    });
  });
});
