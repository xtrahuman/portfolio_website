const menubar = document.querySelector('#mobile_menu');
const navlink = document.querySelector('.nav-flex');
const modal = document.querySelector('.modal-pager');
const projectButton = document.querySelectorAll('.open-btn');
const errorMsg = document.querySelector('#error');
const submitForm = document.querySelector('.form');
const email = document.getElementById('mail');
const bodyfix = document.querySelector('body');

function lowerCase(email) {
  const str = email.value.toLowerCase();
  return email.value === str;
}

function showError() {
  if (email.validity.typeMismatch) {
    errorMsg.textContent = '*Please Enter Valid email';
    errorMsg.classList.add('show-error');
    setTimeout(() => {
      errorMsg.textContent = '';
      errorMsg.classList.remove('show-error');
    }, 2000);
  }
  if (email.validity.valueMissing) {
    errorMsg.textContent = '*Please you need to enter an email address';
    errorMsg.classList.add('show-error');
  }
  if (!lowerCase(email)) {
    errorMsg.textContent = '* Your email should be in small letters';
    errorMsg.classList.add('show-error');
    setTimeout(() => {
      errorMsg.textContent = '';
      errorMsg.classList.remove('show-error');
    }, 6000);
  }
}

submitForm.addEventListener('submit', (e) => {
  if (!email.validity.valid) {
    showError();
    e.preventDefault();
  }
  if (!lowerCase(email)) {
    showError();
    e.preventDefault();
  }
});

const PageContent = [{
  title: 'Save a child Fundraising Program',
  img: './public/desktop-head.PNG',
  contentText:
    'My first Microverse capstone project is a fundraising program website for children in need, It contains a list of speakers, the main program section, and about page',
  skillsLink1: 'https://github.com/xtrahuman/',
  skillsLink2: 'https://github.com/xtrahuman/',
  skillsLink3: 'https://github.com/xtrahuman/',
  skillsLink4: 'https://github.com/xtrahuman/',
  skills1: 'css1',
  skills2: 'html',
  skills3: 'bootStrap',
  skills4: 'JavaScript',
}, {
  title: 'Multi-post story',
  img: '/public/desktop-head.PNG',
  contentText:
      "Lorem ummy ext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown ptext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scramble.",
  skillsLink1: 'https://github.com/xtrahuman/',
  skillsLink2: 'https://github.com/xtrahuman/',
  skillsLink3: 'https://github.com/xtrahuman/',
  skillsLink4: 'https://github.com/xtrahuman/',
  skills1: 'css2',
  skills2: 'html',
  skills3: 'bootStrap',
  skills4: 'ruby',
}, {
  title: 'Multi-post story',
  img: 'asset/Snapshoot_Portfolio.png',
  contentText:
      "Lorem ummy ext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown ptext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scramble.",
  skillsLink1: 'https://github.com/xtrahuman/',
  skillsLink2: 'https://github.com/xtrahuman/',
  skillsLink3: 'https://github.com/xtrahuman/',
  skillsLink4: 'https://github.com/xtrahuman/',
  skills1: 'css3',
  skills2: 'html',
  skills3: 'bootStrap',
  skills4: 'ruby',
}, {
  title: 'Multi-post story',
  img: 'asset/Snapshoot_Portfolio.png',
  contentText:
      "Lorem ummy ext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown ptext of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scramble.",
  skillsLink1: 'https://github.com/xtrahuman/',
  skillsLink2: 'https://github.com/xtrahuman/',
  skillsLink3: 'https://github.com/xtrahuman/',
  skillsLink4: 'https://github.com/xtrahuman/',
  skills1: 'css4',
  skills2: 'html',
  skills3: 'bootStrap',
  skills4: 'ruby',
}];

const AddModal = () => {
  projectButton.forEach((button, index) => {
    button.addEventListener('click', () => {
      modal.innerHTML = `
  <div class="modal-pos">
  <div class="modal-container">
        <div class="modal">
     
            <div class="modal-head">
               <h3>${PageContent[index].title}</h3>
               <div class='close-btn'><i class="fa fa-times"></i></div>
            </div>
            <div class="image-sizing">
             <img src=${PageContent[index].img} alt="">
            </div>
            <div class="text-center">
            <div class='modal-text'>
               <p>${PageContent[index].contentText}</p>
            </div>
           
            <div class="tools modal-tools">
                <div class="tool-skill">
                    <ul>
                        <li><a href=${PageContent[index].skillsLink1}></a>${PageContent[index].skills1}</li>
                        <li><a href=${PageContent[index].skillsLink2}></a>${PageContent[index].skills2}</li>
                        <li><a href=${PageContent[index].skillsLink3}></a>${PageContent[index].skills3}</li>
                        <li><a href=${PageContent[index].skillsLink4}></a>${PageContent[index].skills4}</li>
                    </ul>
                </div>
                </div>

            </div>
            <div class='view-btn'>
            <button type="button" class="btn btn1">see live<span><img src="./asset/Icon.svg"></span></button>
            <button type="button" class="btn btn2">see source<span><img src="./asset/Vector1.png"></span></button>
            </div>
        </div>   
 </div>
</div>`;
      const closeproject = document.querySelector('.close-btn');
      const closebtn = () => {
        modal.classList.remove('show');
        bodyfix.classList.remove('static');
      };
      closeproject.addEventListener('click', closebtn);
    });
  });
};

window.addEventListener('DOMContentLoaded', AddModal);

projectButton.forEach((button) => {
  button.addEventListener('click', () => {
    modal.classList.add('show');
    bodyfix.classList.add('static');
  });
});

window.onclick = function check(event) {
  if (
    event.target.matches('.targetlink')
      || event.target.matches('.check')
      || event.target.matches('.fa-angle-right')
  ) {
    navlink.classList.remove('toggle');
    menubar.classList.remove('toggle-menu');
    bodyfix.classList.remove('static');
  }
};

// Display mobile menu

const mobilemenu = () => {
  menubar.classList.toggle('toggle-menu');
  navlink.classList.toggle('toggle');
  bodyfix.classList.toggle('static');
};

menubar.addEventListener('click', mobilemenu);
