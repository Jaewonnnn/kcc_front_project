$(function () {
  let allUsers = []; // 전체 사용자 목록을 저장할 배열
  let currentPage = 1;
  let usersPerPage = 10;
  let start = 0;
  let end = 0;
  let sortOrder = {
    id: "desc",
    name: "asc",
    department: "asc",
    position: "asc",
    hiredate: "asc",
    status: "asc",
  };

  $.ajax({
    url: "http://localhost:3009/users",
    type: "GET",
    success: function (response) {
      allUsers = response; // 전체 사용자 목록 저장
      let length = allUsers.length;

      // 페이지 링크 설정
      let totalPages = Math.ceil(length / usersPerPage); // 총 페이지 수
      $("#page-number").empty(); // 기존 페이지 번호 초기화

      for (let page = 1; page <= totalPages; page++) {
        $("#page-number").append(
          `<a href="#" class="page-link number" data-page="${page}">${page}</a>`
        );
      }

      // 첫 페이지 데이터 표시
      displayUsers(allUsers, currentPage, usersPerPage);

      // 페이지 번호 클릭 이벤트 설정
      $(".number").click(function (e) {
        e.preventDefault();
        currentPage = $(this).data("page");
        displayUsers(allUsers, currentPage, usersPerPage);
      });
    },
  });

  // $(document).on("click", "button", function (e) {
  //   // e.preventDefault();
  //   console.log("button clicked"); // 버튼 클릭 시 로그 출력
  // });

  $("th").on("mouseover", function () {
    $(this).addClass("hover");
  });
  $("th").on("mouseout", function () {
    $(this).removeClass("hover");
  });

  // th 클릭 시 sort 기능
  $("th").click(function () {
    let newUsers = [...allUsers]; // 전체 사용자 목록을 복사
    const text = $(this).text();
    let key;

    if (text.includes("사원번호")) {
      key = "id";
    } else if (text.includes("이름")) {
      key = "name";
    } else if (text.includes("부서")) {
      key = "department";
    } else if (text.includes("직급")) {
      key = "position";
    } else if (text.includes("입사일")) {
      key = "hiredate";
    } else if (text.includes("법정의무교육")) {
      key = "status";
    }

    newUsers.sort((a, b) => {
      if (key === "id") {
        return sortOrder[key] === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return sortOrder[key] === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });

    sortOrder[key] = sortOrder[key] === "asc" ? "desc" : "asc";
    displayUsers(newUsers, 1, usersPerPage);
  });

  $(".prev").click(function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayUsers(allUsers, currentPage, usersPerPage);
    }
  });

  $(".next").click(function (e) {
    e.preventDefault();
    if (currentPage < Math.ceil(allUsers.length / usersPerPage)) {
      currentPage++;
      displayUsers(allUsers, currentPage, usersPerPage);
    }
  });

  $(document).on("click", "button", function (e) {
    const empId = $(this).closest("tr").find("td:first").text();
    $("#modal").remove();
    $("#container").append(
      `
      <div id="modal">
      <div id="modal_body">
        <p id="titld">${allUsers[empId - 1].name}${
        allUsers[empId - 1].position
      }님의 법정의무교육 수강률</p>
        <div id="progress-bar">
          <div>
            <h6>직장 내 장애인 인식개선 교육</h6>
            <div
              class="progress"
              role="progressbar"
              aria-label="Default striped example"
              aria-valuenow="${allUsers[empId - 1]["1"]}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar progress-bar-striped"
                style="width: ${allUsers[empId - 1]["1"]}%"
              >${allUsers[empId - 1]["1"]}%</div>
            </div>
          </div>
          <div class="mt-2">
            <h6>산업안전보건교육</h6>
            <div
              class="progress"
              role="progressbar"
              aria-label="Success striped example"
              aria-valuenow="${allUsers[empId - 1]["2"]}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar progress-bar-striped bg-success"
                style="width: ${allUsers[empId - 1]["2"]}%"
              >${allUsers[empId - 1]["2"]}%</div>
            </div>
          </div>
          <div class="mt-2">
            <h6>직장 내 성희롱 예방교육</h6>
            <div
              class="progress"
              role="progressbar"
              aria-label="Info striped example"
              aria-valuenow="${allUsers[empId - 1]["3"]}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar progress-bar-striped bg-info"
                style="width: ${allUsers[empId - 1]["3"]}%"
              >${allUsers[empId - 1]["3"]}%</div>
            </div>
          </div>
          <div class="mt-2">
            <h6>개인정보 보호교육</h6>
            <div
              class="progress"
              role="progressbar"
              aria-label="Warning striped example"
              aria-valuenow="${allUsers[empId - 1]["4"]}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar progress-bar-striped bg-warning"
                style="width: ${allUsers[empId - 1]["4"]}%"
              >${allUsers[empId - 1]["4"]}%</div>
            </div>
          </div>
          <div class="mt-2">
            <h6>퇴직연금교육</h6>
            <div
              class="progress"
              role="progressbar"
              aria-label="Danger striped example"
              aria-valuenow="${allUsers[empId - 1]["5"]}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar progress-bar-striped bg-danger"
                style="width: ${allUsers[empId - 1]["5"]}%"
              >${allUsers[empId - 1]["5"]}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `
    );
    $("#modal").fadeIn();
    $("#modal_body").fadeIn();
  });

  $(document).on("click", "#modal", function () {
    $("#modal").fadeOut();
    $("#modal_body").fadeOut();
  });

  function displayUsers(users, page, usersPerPage) {
    // 페이지에 맞는 사용자 목록 결정
    start = (page - 1) * usersPerPage;
    end = start + usersPerPage;
    let usersToDisplay = users.slice(start, end);

    const completed =
      '<button type="button" class="btn btn-primary complete" data-bs-toggle="modal" data-bs-target="#staticBackdrop">completed</button>';
    const inProgress =
      '<button type="button" class="btn btn-primary inprogress" data-bs-toggle="modal" data-bs-target="#staticBackdrop">In Progress</button>';
    const notStarted =
      '<button type="button" class="btn btn-primary notstarted" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Not Started</button>';

    // 테이블 내용 초기화
    $("tbody").empty();
    // 선택된 사용자 목록 테이블에 추가
    usersToDisplay.forEach((user) => {
      let icon;
      if (user.status === "completed") {
        icon = completed;
      } else if (user.status === "inprogress") {
        icon = inProgress;
      } else {
        icon = notStarted;
      }
      $("tbody").append(
        `<tr>
          <td id="user-id">${user.id}</td>
          <td>${user.name}</td>
          <td>${user.department}</td>
          <td>${user.position}</td>
          <td>${user.hiredate}</td>
          <td>${icon}</td>   
        </tr>`
      );
    });

    $("caption").empty();
    $("caption").append(
      `Showing ${start + 1} to ${Math.min(end, allUsers.length)} of ${
        allUsers.length
      } results`
    );
  }

  // 검색 기능
  $("#search-box").keyup(function () {
    let word = $(this).val().toLowerCase(); // 입력된 검색어를 소문자로 변환
    let filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(word) || // 이름에 검색어 포함
        user.department.toLowerCase().includes(word) || // 부서에 검색어 포함
        user.position.toLowerCase().includes(word) // 직급에 검색어 포함
    );

    // 필터링된 사용자 목록을 첫 페이지로 표시
    displayUsers(filteredUsers, 1, usersPerPage);

    // 페이지 링크 업데이트
    let totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    $("#page-number").empty(); // 기존 페이지 번호 초기화
    for (let page = 1; page <= totalPages; page++) {
      $("#page-number").append(
        `<a href="#" class="page-link" data-page="${page}">${page}</a>`
      );
    }

    // 페이지 링크 클릭 이벤트 재설정
    $(".page-link")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        let newpage = $(this).data("page");
        displayUsers(filteredUsers, newpage, usersPerPage);
      });
  });
});
