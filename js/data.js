// Everything the desktop shows about me and my work. Edit here and every window updates.

export const PROFILE = {
  name: 'Tochukwu Okpara',
  role: 'Software Engineer',
  email: 'okpara_tochukwu@yahoo.com',
  github: 'https://github.com/xtrahuman',
  linkedin: 'https://www.linkedin.com/in/tochukwuokpara/',
  openToBuild: true,
  resume: 'resume.pdf',
};

export const PUBLICATION = {
  title: 'Autoencoders for anomaly detection: a comprehensive architectural review, comparative insights, and practical guidance',
  authors: 'Chikezie, C. I., Okpara, T. C., & Mmadumbu, A. C.',
  venue: 'International Journal of Engineering Research and Technology, 8(5), 2025',
  url: 'https://doi.org/10.70382/tijert.v08i5.010',
};

export const PROJECTS = [
  {
    id: 'scanmora',
    title: 'Scanmora',
    kind: 'Live product · personal project',
    img: 'img/projects/scanmora.jpg',
    one: 'Browser-based PDF toolkit with 13 tools: Next.js front end, Python back end.',
    desc: "A browser-based PDF toolkit with 13 tools, including merging PDFs, turning JPG and PNG images into PDFs, and extracting text with OCR for scanned pages. Files stay on the user's device by default, with no sign-up.",
    highlights: [
      'Next.js front end with a Python back end',
      'OCR text extraction for scanned pages',
      'Local by default: files only leave the device if the user confirms a server conversion',
      'Built with Claude Code agents',
    ],
    tags: ['Next.js', 'React', 'Python'],
    live: 'https://scanmora.com',
  },
  {
    id: 'scandiweb-store',
    title: 'Scandiweb Store',
    kind: 'React storefront · Scandiweb screening test',
    img: 'img/projects/scandiweb-store-cart.jpg',
    shots: [
      { src: 'img/projects/scandiweb-store-cart.jpg', alt: 'Product page with the cart overlay open' },
      { src: 'img/projects/scandiweb-store.jpg', alt: 'Category page with quick add and an out-of-stock product' },
    ],
    one: 'React + Redux storefront with product data from a GraphQL API via Apollo Client.',
    desc: 'A minimalist e-commerce storefront built for the Scandiweb developer screening test. Products, categories and prices come from a GraphQL endpoint through Apollo Client, with Redux for state management.',
    highlights: [
      'Product data fetched from a GraphQL endpoint with Apollo Client',
      'Category pages (All, Clothes, Tech) and a currency switcher',
      'Cart overlay with size options, quantities, tax and order total',
      'Out-of-stock products clearly marked on the listing',
    ],
    tags: ['React', 'Redux', 'GraphQL', 'JavaScript'],
    src: 'https://github.com/xtrahuman/scandiweb-ecommerce-frontend',
  },
  {
    id: 'car-rentals',
    title: 'Car Rentals',
    kind: 'Full-stack team project',
    img: 'img/projects/car-rentals.jpg',
    one: 'Full-stack team project: Rails API, React + Redux UI, admin tools and reservations.',
    desc: 'A car rental web app built with a team. Admins add and remove cars; users browse the fleet, open a car to see its details and book a reservation for their dates.',
    highlights: [
      'Ruby on Rails back end with a React + Redux front end',
      'Admin tools to add and remove cars from the fleet',
      'Reservation flow where each user books with their own details',
    ],
    tags: ['Ruby', 'Rails', 'React', 'Redux'],
    src: 'https://github.com/xtrahuman/car-rent-front-end',
  },
  {
    id: 'space-travelers',
    title: 'Space Travelers',
    kind: 'React single-page app',
    img: 'img/projects/space-travelers.jpg',
    one: 'React + Redux booking app running on live SpaceX API data.',
    desc: 'A booking app for a space travel company, built on live data from the SpaceX API. Users reserve rockets and dragons, join missions, and see everything they booked on their profile page.',
    highlights: [
      'Live data from the SpaceX API',
      'Book rockets and dragons, join or leave missions',
      'Profile page that collects everything a user booked',
    ],
    tags: ['React', 'Redux', 'JavaScript', 'CSS'],
    src: 'https://github.com/Chimwemwe-127001/space-travelers-hub',
  },
  {
    id: 'art-gallery',
    title: 'Art Gallery',
    kind: 'React app on a public API',
    img: 'img/projects/art-gallery.jpg',
    one: 'Searchable art browser on the Art Institute of Chicago API.',
    desc: 'Browses artworks from the Art Institute of Chicago API. Search the collection by keyword; the featured works rotate on an interval.',
    highlights: [
      'Data from the Art Institute of Chicago API',
      'Keyword search across the collection',
      'Featured artworks refresh on an interval',
    ],
    tags: ['React', 'Redux', 'JavaScript', 'CSS'],
    src: 'https://github.com/xtrahuman/art-gallery',
  },
  {
    id: 'movie-time',
    title: 'Movie Time',
    kind: 'JavaScript capstone',
    img: 'img/projects/movie-time.jpg',
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
    img: 'img/projects/scf-program.jpg',
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

export const STACK = ['Python', 'TypeScript', 'JavaScript', 'Ruby', 'Django', 'Node.js', 'Next.js', 'React', 'Redux', 'Ruby on Rails', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Claude Code'];

const ENTITIES = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);
export const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
