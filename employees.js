$(function () {
  let allUsers = []; // 전체 사용자 목록을 저장할 배열
  let currentPage = 1;
  let usersPerPage = 10;
  let start = 0;
  let end = 0;
  $.ajax({
    url: "http://localhost:3009/users",
    type: "GET",
    success: function (response) {
      allUsers = response; // 전체 사용자 목록 저장
      let length = allUsers.length;

      //페이지 링크 설정
      let totalPages = Math.ceil(length / usersPerPage); // 총 페이지 수
      $("#page-number").empty(); // 기존 페이지 번호 초기화

      for (let page = 1; page <= totalPages; page++) {
        $("#page-number").append(
          `<a href="#" class="page-link number" data-page="${page}">${page}</a>`
        );
      }

      // 첫 페이지 데이터 표시
      displayUsers(allUsers, 1, usersPerPage);

      // 페이지 번호 클릭 이벤트 설정
      $(".number").click(function (e) {
        e.preventDefault();
        currentPage = $(this).data("page");
        displayUsers(allUsers, currentPage, usersPerPage);
      });
    },
  });

  $("th").on("mouseover", function () {
    $(this).addClass("hover");
  });
  $("th").on("mouseout", function () {
    $(this).removeClass("hover");
  });

  // th 클릭 시 sort기능
  $("th").click(function () {
    const text = $(this).text();
    console.log(text);
    if (text.includes("사원번호")) {
      console.log("called");
      allUsers.sort((a, b) => a.id - b.id);
    } else if (text.includes("이름")) {
      allUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (text.includes("부서")) {
      allUsers.sort((a, b) => a.department.localeCompare(b.department));
    } else if (text.includes("직급")) {
      allUsers.sort((a, b) => a.position.localeCompare(b.position));
    } else if (text.includes("입사일")) {
      allUsers.sort((a, b) => new Date(a.hiredate) - new Date(b.hiredate));
    }
    displayUsers(allUsers, 1, usersPerPage);
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

  function displayUsers(users, page, usersPerPage) {
    // 페이지에 맞는 사용자 목록 결정
    start = (page - 1) * usersPerPage;
    end = start + usersPerPage;
    usersToDisplay = users.slice(start, end);

    // 테이블 내용 초기화
    $("tbody").empty();
    // 선택된 사용자 목록 테이블에 추가
    usersToDisplay.forEach((user) => {
      $("tbody").append(
        `<tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.department}</td>
          <td>${user.position}</td>
          <td>${user.hiredate}</td>
        </tr>`
      );
    });
    $("caption").empty();
    $("caption").append(
      `Showing ${start} to ${end} of ${allUsers.length} results`
    );
  }

  // 검색 기능
  $("#search-box").keyup(function () {
    let word = $(this).val().toLowerCase(); // 입력된 검색어를 소문자로 변환
    let filteredUsers = allUsers.filter(
      (user) =>
        user.name.includes(word) || // 이름에 검색어 포함
        user.department.toLowerCase().includes(word) || // 부서에 검색어 포함
        user.position.includes(word) // 직급에 검색어 포함
    );

    // 필터링된 사용자 목록을 첫 페이지로 표시
    displayUsers(filteredUsers, 1, usersPerPage);

    // 페이지 링크 업데이트
    let totalPages = Math.ceil(filteredUsers.length / 10);
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
