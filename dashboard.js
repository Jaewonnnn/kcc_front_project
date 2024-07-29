$(function () {
  notification();
  legalChart();
  salesChart();
  loadRating(); // 평점 로드 함수 호출
});

function loadRating() {
  let sum;
  $.ajax({
    url: "http://localhost:3009/lectures",
    method: "GET",
    success: function (data) {
      data.forEach((lecture) => {
        sum += lecture.rating;
      });
      const ratingScore = sum / data.length() || 0; // 기본값 0
      const star = document.querySelector(".star");

      let starGradeNum = (ratingScore / 5) * 100; // 5점 만점 기준
      star.style.cssText = `background: linear-gradient(to right, #EAB838, #EAB838 ${starGradeNum}%, #E0E2E7 ${starGradeNum}%); color: transparent; background-clip: text;`;
    },
  });
}

function salesChart() {
  const ctx = document.getElementById("sales-chart").getContext("2d");
  let lectures = [];

  $.ajax({
    url: "http://localhost:3009/lectures",
    type: "GET",
    dataType: "json",
    success: function (data) {
      lectures = data;
      const salesData = generateMonthlyData(lectures);

      const labels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월"];
      const datasets = salesData.map((lecture) => ({
        label: lecture.name,
        data: lecture.monthlyEnrollments,
        borderColor: `rgba(${randomColor()}, ${Math.random()})`,
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
      }));

      const chartData = {
        labels: labels,
        datasets: datasets,
      };

      const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": " + context.raw; 
                }
                return label;
              },
            },
          },
        },
      };

      new Chart(ctx, {
        type: "line", 
        data: chartData,
        options: options,
      });
    },
    error: function (error) {
      console.error("데이터를 가져오는 데 실패했습니다:", error);
    },
  });

  // 월별 데이터 생성 함수
  function generateMonthlyData(lectures) {
    // lectures가 정의되어 있는지 확인
    if (!lectures || !Array.isArray(lectures)) {
      console.error("유효하지 않은 강의 데이터입니다.");
      return [];
    }

    return lectures.map((lecture) => {
      const total = lecture.totalEnrollment; // 총 수강신청 인원 수
      const monthlyEnrollments = [];

      // 7개월로 나누어 랜덤하게 배분
      for (let i = 0; i < 7; i++) {
        const enrollment = Math.floor(Math.random() * (total / 7) + 1);
        monthlyEnrollments.push(enrollment);
      }

      // 마지막 달에 남은 수 추가
      const totalMonthly = monthlyEnrollments.reduce((a, b) => a + b, 0);
      monthlyEnrollments[monthlyEnrollments.length - 1] += total - totalMonthly;

      return {
        name: lecture.name,
        monthlyEnrollments: monthlyEnrollments,
      };
    });
  }

  // 랜덤 색상 생성 함수
  function randomColor() {
    return (
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256)
    );
  }
}

function legalChart() {
  const ctx = document.getElementById("legal-chart").getContext("2d");
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  $.ajax({
    url: "http://localhost:3009/users",
    success: function (result) {
      result.forEach(function (item) {
        console.log(item);
        if (item.status === "completed") {
          completed++;
        } else if (item.status === "inprogress") {
          inProgress++;
        } else {
          notStarted++;
        }
      });

      const data = {
        labels: ["수강완료", "수강중", "미수강"],
        datasets: [
          {
            label: "법정의무교육 현황",
            data: [completed, inProgress, notStarted],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": " + context.raw;
                }
                return label;
              },
            },
          },
        },
      };
      new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: options,
      });
    },
  });
}

function notification() {
  $.ajax({
    url: "http://localhost:3009/notification",
    success: function (result) {
      $(".toast-panel").empty();
      result.forEach(function (item) {
        if (item.title === "수강 등록") {
          $(".toast-panel").append(`
                        <div class="toast-item success">
                            <div class="toast success">
                                <label for="t-success" class="close"></label>
                                <h3>${item.title}</h3>
                                <p>${item.content}</p>
                            </div>
                        </div>
                    `);
        } else if (item.title === "수강 완료") {
          $(".toast-panel").append(`
                        <div class="toast-item help">
                            <div class="toast help">
                                <label for="t-error" class="close"></label>
                                <h3>${item.title}</h3>
                                <p>${item.content}</p>
                            </div>
                        </div>
                    `);
        } else if (item.title === "알림") {
          $(".toast-panel").append(`
                        <div class="toast-item warning">
                            <div class="toast warning">
                                <label for="t-warning" class="close"></label>
                                <h3>${item.title}</h3>
                                <p>${item.content}</p>
                            </div>
                        </div>
                    `);
        }
      });
    },
  });
}
