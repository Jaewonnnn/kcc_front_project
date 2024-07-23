class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>
      <link rel="stylesheet" href="/sidebar/sidebar.css">
      <header>
        <form id="header_search"><input type="text"></form>
        <button id="bell"></button>
        <button id="mail"></button>
        <button id="login">Login</button>
      </header>
      <section id="sidebar">
        <div id="title"><img src="/img/title.png"></div>
        <div id="user">
          <p></p>
        </div>
        <div id="side_menu">
          <p class="side_menu_title">Main</p>
          <ul class="main">
            <li class="selector"><i class="fa-solid fa-earth-americas"></i><a href="/main.html">HOME</a></li>
            <li><i class="fa-solid fa-chart-simple"></i><a href="/statistics/statistics.html">통계 관리</a></li>
            <li>
              <i class="fa-solid fa-book"></i><a href="#">교육 관리</a>
              <ul class="side_menu_detail">
              </ul>
            </li>
            <li><i class="fa-solid fa-user"></i><a href="#">직원 관리</a></li>
            <li><i class="fa-solid fa-clipboard"></i><a href="#">수강 관리</a></li>
          </ul>
          <p class="side_menu_title">Short Cut</p>
          <ul class="main">
            <li><a href="#">HOME</a></li>
            <li><a href="#">통계</a></li>
            <li><a href="#">교육과정관리</a></li>
          </ul>
        </div>
        <button id="side_close">
          <i class="fa-solid fa-angles-left"></i>
        </button>
      </section>
    `;
  }
}

customElements.define("sidebar-component", Sidebar);

document.addEventListener("DOMContentLoaded", () => {
  sidemenu();
  sidemenuClose();
});

function sidemenu() {
  const shadowRoot = document.querySelector("sidebar-component").shadowRoot;
  const menuItems = shadowRoot.querySelectorAll("ul.main > li");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      shadowRoot
        .querySelector("ul.main > li.selector")
        .classList.remove("selector");
      item.classList.add("selector");

      // 클릭된 메뉴 항목의 href 속성 값을 로컬 스토리지에 저장합니다.
      const href = item.querySelector("a").getAttribute("href");
      localStorage.setItem("selectedMenu", href);
    });
  });

  // 로컬 스토리지에서 저장된 선택된 메뉴 항목을 불러와서 설정합니다.
  const selectedMenu = localStorage.getItem("selectedMenu");
  if (selectedMenu) {
    const selectedItem = Array.from(menuItems).find((item) => {
      return item.querySelector("a").getAttribute("href") === selectedMenu;
    });

    if (selectedItem) {
      shadowRoot
        .querySelector("ul.main > li.selector")
        .classList.remove("selector");
      selectedItem.classList.add("selector");
    }
  }
}

function sidemenuClose() {
  const shadowRoot = document.querySelector("sidebar-component").shadowRoot;
  const closeButton = shadowRoot.querySelector("#side_close");
  const sidebar = shadowRoot.querySelector("#sidebar");
  const header = shadowRoot.querySelector("header");

  closeButton.addEventListener("click", () => {
    gsap.to(sidebar, {
      left: -150 + "px",
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        gsap.set(sidebar, { left: -150 + "px" });
      },
    });
    gsap.to(header, { left: 100 + "px", duration: 0.5, ease: "power1.out" });
  });
}
