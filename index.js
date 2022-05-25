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
  title: 'SCF Program',
  img: './public/desktop-head.PNG',
  contentText:
    ' this project is a fundraising website for children in need, It contains a list of speakers, the main program section, and about page, kindly click on the links below to checkout the project',
  skills1: 'css3',
  skills2: 'html5',
  skills3: 'bootStrap',
  skills4: 'JavaScript',
  seeLive: 'https://xtrahuman.github.io/capstone-module1/',
  seeSource: 'https://github.com/xtrahuman/capstone-module1',
}, {
  title: 'Art Gallery',
  img: './public/art-gallery1.PNG',
  contentText:
      'This is a react web app that displays the list of art works gotten from art institute of chicago API, with the search option you can search the artwork, the artworks gotten through this api changes at every interval, kindly click on the link below to checkout the project',
  skills1: 'css3',
  skills2: 'React',
  skills3: 'JavaScript',
  skills4: 'Redux',
  seeLive: 'https://art-gallery-project.netlify.app',
  seeSource: 'https://github.com/xtrahuman/art-gallery',
}, {
  title: 'Space Travelers',
  img: './public/space-travelers2.PNG',
  contentText:
      'This is a single page application built with react where I worked with real live data from the SpaceX API. My task was to build a web application for a company that provides commercial and scientific space travel services. The application allows users to book rockets and dragons, and join selected space missions. each booked rockets/dragons and joined missions can be viewed in the profile section, kindly click the link below to view project',
  skills1: 'css3',
  skills2: 'React',
  skills3: 'Redux',
  skills4: 'JavaScript',
  seeLive: 'https://space-travelers-hub-react.netlify.app',
  seeSource: 'https://github.com/Chimwemwe-127001/space-travelers-hub',
}, {
  title: 'Movie Time',
  img: './public/javascript-capstone2.PNG',
  contentText:
      'Movie time is a capstone project built mainly with JavaScript, the project is about displaying a list of movies where users can like or write a comment to any of the movies, all likes and comments are stored in an interactive api, Kindly click the links below to view the project',
  skills1: 'css3',
  skills2: 'html',
  skills3: 'Webpack',
  skills4: 'JavaScript',
  seeLive: 'mic-car-rental.netlify.app/',
  seeSource: 'https://github.com/ShahierNashaat/javascript-capstone',
}, {
  title: 'Car Rentals',
  img: './public/Car-rental-img2.PNG',
  contentText:
      'Car service Webapp where admin can add cars and delete cars. User can navigate smoothly across the differents pages, where he can explore all cars options and details, and make a reservation for a selected item and with his specific details.',
  skills1: 'Ruby',
  skills2: 'Rails',
  skills3: 'React',
  skills4: 'Redux',
  seeLive: 'https://shahiernashaat.github.io/javascript-capstone/',
  seeSource: 'https://github.com/Taher-web-dev/car-rent-front-end',
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
                        <li>${PageContent[index].skills1}</li>
                        <li>${PageContent[index].skills2}</li>
                        <li>${PageContent[index].skills3}</li>
                        <li>${PageContent[index].skills4}</li>
                    </ul>
                </div>
                </div>

            </div>
            <div class='view-btn'>
            <button type="button" class="btn btn1 nopad"><a href=${PageContent[index].seeLive}>see live<span><img src="./asset/Icon.svg"></span></a></button>
            <button type="button" class="btn btn2 nopad"><a href=${PageContent[index].seeSource}>see source<span><img src="./asset/Vector1.png"></span></a></button>
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
