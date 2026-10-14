// Single source of truth for every v2 concept. Edit projects here and all four pages update.

export const PROFILE = {
  name: 'Tochukwu Okpara',
  role: 'Software Developer',
  email: 'okpara_tochukwu@yahoo.com',
  github: 'https://github.com/xtrahuman',
  linkedin: 'https://linkedin.com/in/tochukwu-okpara-449528197',
  openToWork: true,
  // Drop your CV into v2/shared/ and set this to '../shared/resume.pdf'
  resume: '',
};

export const PROJECTS = [
  {
    id: 'car-rentals',
    title: 'Car Rentals',
    kind: 'Full-stack team project',
    img: '../shared/img/car-rentals.jpg',
    one: 'Full-stack team project: Rails API, React + Redux UI, admin tools and reservations.',
    desc: 'A car rental web app built with a team. Admins add and remove cars; users browse the fleet, open a car to see its details and book a reservation for their dates.',
    highlights: [
      'Ruby on Rails back end with a React + Redux front end',
      'Admin tools to add and remove cars from the fleet',
      'Reservation flow where each user books with their own details',
    ],
    tags: ['Ruby', 'Rails', 'React', 'Redux'],
    live: 'https://car-rental-group.netlify.app/',
    src: 'https://github.com/xtrahuman/car-rent-front-end',
  },
  {
    id: 'space-travelers',
    title: 'Space Travelers',
    kind: 'React single-page app',
    img: '../shared/img/space-travelers.jpg',
    one: 'React + Redux booking app running on live SpaceX API data.',
    desc: 'A booking app for a space travel company, built on live data from the SpaceX API. Users reserve rockets and dragons, join missions, and see everything they booked on their profile page.',
    highlights: [
      'Live data from the SpaceX API',
      'Book rockets and dragons, join or leave missions',
      'Profile page that collects everything a user booked',
    ],
    tags: ['React', 'Redux', 'JavaScript', 'CSS'],
    live: 'https://space-travelers-hub-react.netlify.app',
    src: 'https://github.com/Chimwemwe-127001/space-travelers-hub',
  },
  {
    id: 'art-gallery',
    title: 'Art Gallery',
    kind: 'React app on a public API',
    img: '../shared/img/art-gallery.jpg',
    one: 'Searchable art browser on the Art Institute of Chicago API.',
    desc: 'Browses artworks from the Art Institute of Chicago API. Search the collection by keyword; the featured works rotate on an interval.',
    highlights: [
      'Data from the Art Institute of Chicago API',
      'Keyword search across the collection',
      'Featured artworks refresh on an interval',
    ],
    tags: ['React', 'Redux', 'JavaScript', 'CSS'],
    live: 'https://art-gallery-project.netlify.app',
    src: 'https://github.com/xtrahuman/art-gallery',
  },
  {
    id: 'movie-time',
    title: 'Movie Time',
    kind: 'JavaScript capstone',
    img: '../shared/img/movie-time.jpg',
    archived: true,
    one: 'Movie list with likes and comments stored through an external API.',
    desc: 'Lists movies that visitors can like and comment on. Likes and comments are stored through an external API.',
    highlights: ['Likes and comments saved through an external API', 'Bundled with Webpack'],
    tags: ['JavaScript', 'Webpack', 'HTML', 'CSS'],
    live: 'https://shahiernashaat.github.io/javascript-capstone/',
    src: 'https://github.com/ShahierNashaat/javascript-capstone',
  },
  {
    id: 'scf-program',
    title: 'SCF Program',
    kind: 'Responsive landing page',
    img: '../shared/img/scf-program.jpg',
    archived: true,
    one: 'Fundraising site with speakers, program and about pages.',
    desc: 'A fundraising site for children in need, with a speakers list, the main program and an about page.',
    highlights: ['Speakers list, main program and about page', 'Responsive layout built with Bootstrap'],
    tags: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    live: 'https://xtrahuman.github.io/capstone-module1/',
    src: 'https://github.com/xtrahuman/capstone-module1',
  },
];

export const FEATURED = PROJECTS.filter((p) => !p.archived);
export const ARCHIVED = PROJECTS.filter((p) => p.archived);

// [name, [project titles]] sorted by how many projects use it
const countSkills = () => {
  const map = {};
  PROJECTS.forEach((p) => {
    p.tags.forEach((tag) => {
      if (!map[tag]) map[tag] = [];
      map[tag].push(p.title);
    });
  });
  return Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
};
export const SKILLS = countSkills();

export const STACK = ['JavaScript', 'Ruby', 'React', 'Redux', 'Ruby on Rails', 'RSpec', 'HTML', 'CSS', 'Bootstrap', 'Git'];

const ENTITIES = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);
export const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
