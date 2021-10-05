const menubar = document.querySelector("#mobile_menu");
const navlink = document.querySelector(".nav-flex");
const mode = document.querySelector(".modal-pager");

// window.addEventListener("DOMContentLoaded", modalpage);

// const modalpage = () => {
//   mode.innerhtml = ``;
// };

window.onclick = function (event) {
  if (!event.target.matches(".vector")) {
    navlink.classList.remove("toggle");
    menubar.classList.remove("toggle-menu");
  }
};

//Display mobile menu
const mobilemenu = () => {
  menubar.classList.toggle("toggle-menu");
  navlink.classList.toggle("toggle");
};

menubar.addEventListener("click", mobilemenu);
