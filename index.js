const menubar = document.querySelector("#mobile_menu");
const navlink = document.querySelector(".nav-flex");
const modal = document.querySelector(".modal-pager");
const links = document.querySelectorAll(".targetlink");
const projectButton = document.querySelectorAll(".open-btn");
const bodyfix = document.querySelector("body");



const AddModal = () => {
  modal.innerHTML = `
  <div class="modal-pos">
  <div class="modal-container">
        <div class="modal">
     
            <div class="modal-head">
               <h3>${PageContent.title}</h3>
               <div class='close-btn'><i class="fa fa-times"></i></div>
            </div>
            <div class="image-sizing">
             <img src=${PageContent.img} alt="">
            </div>
            <div class="text-center">
            <div class='modal-text'>
               <p>${PageContent.contentText}</p>
            </div>
           
            <div class="tools modal-tools">
                <div class="tool-skill">
                    <ul>
                        <li><a href=${PageContent.skillsLink1}></a>${PageContent.skills1}</li>
                        <li><a href=${PageContent.skillsLink2}></a>${PageContent.skills2}</li>
                        <li><a href=${PageContent.skillsLink3}></a>${PageContent.skills3}</li>
                        <li><a href=${PageContent.skillsLink4}></a>${PageContent.skills4}</li>
                    </ul>
                </div>
                </div>

            </div>
            <div class='view-btn'>
            <button type="button" class="btn btn1">see project</button>
            <button type="button" class="btn btn2">see project</button>
            </div>
        </div>   
 </div>
</div>`;
  const closeproject = document.querySelector(".close-btn");
  const closebtn = () => {
    modal.classList.remove("show");
    bodyfix.classList.remove("static");
  };
  closeproject.addEventListener("click", closebtn);
};

window.addEventListener("DOMContentLoaded", AddModal);

projectButton.forEach((button) => {
  button.addEventListener("click", () => {
    modal.classList.add("show");
    bodyfix.classList.add("static");
  });
});

window.onclick = function check(event) {
  for (let i = 0; i < links.length; i++) {
    if (
      event.target.matches(".targetlink") ||
      event.target.matches(".check") ||
      event.target.matches(".fa-angle-right")
    ) {
      navlink.classList.remove("toggle");
      menubar.classList.remove("toggle-menu");
      bodyfix.classList.remove("static");
    }
  }
};

// Display mobile menu

const mobilemenu = () => {
  menubar.classList.toggle("toggle-menu");
  navlink.classList.toggle("toggle");
  bodyfix.classList.toggle("static");
};

menubar.addEventListener("click", mobilemenu);
