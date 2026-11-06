// ─────────────────────────────────────────────────────────────
//  Everything you'll want to edit lives in this one file.
//  Links marked PLACEHOLDER still need your real URLs.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Avinash Reddy Konala',
  short: 'Avinash',
  headline: 'I build AI that answers the question you actually asked.',
  intro:
    'Full-stack dev and RAG tinkerer from Bhimavaram. Started coding in 2023 and still haven’t found the off switch.',
  degree: 'BSc Computer Science, BITS Pilani',
  photoNote: 'yes, the headphones stay on',
}

export const links = {
  email: 'avinashreddykonala1@gmail.com',
  github: 'https://github.com/knvavinashreddy',
  linkedin: 'https://www.linkedin.com/in/avinash-reddy-konala-352a2427a/',
  leetcode: 'https://leetcode.com/u/Avinash_Reddy_Konala/',
  codeforces: 'https://codeforces.com/profile/avinashreddykonala',
  codechef: 'https://www.codechef.com/users/algovanguard',
  youtube: 'https://www.youtube.com/', // PLACEHOLDER: your channel URL
  resume: '/resume.pdf', // PLACEHOLDER: drop resume.pdf into /public
}

// Clickable spots on the hero landscape. x / y are percentages of the scene.
export const places = [
  {
    id: 'home',
    x: 13,
    y: 64,
    label: 'Bhimavaram',
    title: 'Home base',
    text: 'Paddy fields, fish ponds and the best food in Andhra. I will not be taking questions.',
  },
  {
    id: 'school',
    x: 24,
    y: 58,
    label: 'Sri Chaitanya',
    title: 'Sri Chaitanya Techno School',
    text: 'Where I learned that every problem has a formula. Mostly.',
  },
  {
    id: 'college',
    x: 36,
    y: 62,
    label: 'Aditya Jr. College',
    title: 'Aditya Junior College · 2023',
    text: 'Intermediate. Joined CCBP 4.0 in second year and wrote my first line of code. First bug, same day.',
  },
  {
    id: 'bits',
    x: 67,
    y: 55,
    label: 'NIAT',
    title: 'NIAT · 2024',
    text: 'Four years of practical, company-ready skills in Hyderabad’s Financial District, with Google and Amazon as neighbours.',
  },
  {
    id: 'now',
    x: 87,
    y: 47,
    label: 'Now',
    title: 'Right now',
    text: 'Shipping RAG apps, learning Three.js, and getting ready to raise my first open source PRs.',
  },
]

// ─── The journey map ───
// Nine stops, in order. `pos` is where the pin sits on the map (map is 2400 × 1700).
// `gallery` items: add `src: '/photos/your-image.jpg'` (files go in /public/photos).
// Wrap words in **double stars** to highlight them in the story.
export const journeyIntro = {
  title: 'Dropout by choice, builder by obsession.',
  text: 'Nine stops from Bhimavaram to Hyderabad. Open the map and walk the path.',
}

export const journeyStops = [
  {
    id: 'school',
    org: 'Sri Chaitanya Techno School',
    short: 'Sri Chaitanya',
    badge: 'SC',
    color: '#2f6fd6',
    when: '2021', // year of your 10th, edit if needed
    place: 'Bhimavaram',
    pos: { x: 1950, y: 1090 },
    headline: 'Not the topper. Not even close.',
    story:
      'I did my schooling and **10th** at **Sri Chaitanya Techno School**. Studies and I didn’t get along, and I honestly believed I was just bad at them.',
    gallery: [{ caption: 'School days' }, { caption: 'The classroom' }, { caption: '10th results day' }],
  },
  {
    id: 'aditya',
    org: 'Aditya Junior College',
    short: 'Aditya Jr. College',
    badge: 'AJC',
    color: '#e0702f',
    when: '2021 – 2023',
    place: 'Bhimavaram',
    pos: { x: 2060, y: 960 },
    headline: 'Same textbooks, same doubt.',
    story:
      'Intermediate at **Aditya Junior College**. Somewhere in those two years I made a promise to myself: after this, I’m leaving my **comfort zone**. New state, new start.',
    gallery: [{ caption: 'The campus' }, { caption: 'My batch' }, { caption: 'Exam season' }],
  },
  {
    id: 'ccbp',
    org: 'CCBP 4.0 by NxtWave',
    short: 'CCBP 4.0',
    badge: '4.0',
    color: '#7b4dff',
    when: '2023',
    place: 'Bhimavaram · online',
    pos: { x: 1830, y: 1010 },
    headline: 'It wasn’t me. It was the system.',
    story:
      'In intermediate second year I joined **CCBP 4.0**, NxtWave’s online course, and wrote my first line of code. For the first time, learning clicked. I wasn’t bad at studies. The way I was being taught was. That’s where my real journey started.',
    gallery: [{ caption: 'First line of code' }, { caption: 'Late-night sessions' }, { caption: 'First project' }],
  },
  {
    id: 'sit',
    org: 'Siddaganga Institute of Technology',
    short: 'SIT Tumakuru',
    badge: 'SIT',
    color: '#0f9d8a',
    when: '2023 – 2024',
    place: 'Tumakuru, Karnataka',
    pos: { x: 575, y: 1310 },
    headline: 'Out of my comfort zone, out of my state.',
    story:
      'I wrote **COMEDK**, got a rank around **7,600**, and landed **Information Science Engineering** at **Siddaganga Institute of Technology**, one of Karnataka’s top 10 colleges. Great campus, great placements. I thought a new state meant a new kind of education.',
    gallery: [{ caption: 'First day' }, { caption: 'The campus' }, { caption: 'Hostel life' }],
  },
  {
    id: 'dropout',
    org: 'The dropout',
    short: 'The dropout',
    badge: '✕',
    color: '#d63c4a',
    when: '2024',
    place: 'Tumakuru, Karnataka',
    pos: { x: 470, y: 1430 },
    headline: 'Same story, different state.',
    story:
      'It was theory, mugging, exams, repeat. Nothing I could actually build with. After first year I made the hardest call so far: I **dropped out**, even with good placements on the table.',
    gallery: [{ caption: 'Last day on campus' }, { caption: 'Packing up' }],
  },
  {
    id: 'niat',
    org: 'NIAT',
    short: 'NIAT',
    badge: 'NIAT',
    color: '#f5c518',
    dark: true,
    when: '2024',
    place: 'Financial District, Hyderabad',
    pos: { x: 1075, y: 500 },
    headline: 'Finally, a college that builds.',
    story:
      'I joined **NIAT**, NxtWave’s four-year program, with my **BSc in Computer Science**. No mugging, just the skills companies actually hire for. Next door: **Google, Amazon, Microsoft, Accenture, Infosys, Wipro**. Meeting engineers, managers and HRs here changed how I think.',
    gallery: [{ caption: 'First day' }, { caption: 'The neighbourhood' }, { caption: 'My batch' }, { caption: 'Industry visit' }],
  },
  {
    id: 'first-video',
    org: 'Creator corner',
    short: 'First video',
    badge: '●',
    color: '#e43f7a',
    when: '2024',
    place: 'Hyderabad',
    pos: { x: 1175, y: 385 },
    headline: 'Hit record, cringed, kept going.',
    story:
      'Two months into NIAT I recorded my **first piece of content**. Rough? Very. But it was the start of something I really care about.',
    gallery: [{ caption: 'The first take' }, { caption: 'Behind the scenes' }],
  },
  {
    id: 'builder',
    org: 'Builder mode',
    short: 'Builder mode',
    badge: '</>',
    color: '#2aa36b',
    when: '2025 – 2026', // edit if needed
    place: 'Hyderabad',
    pos: { x: 1300, y: 575 },
    headline: 'From learning to shipping.',
    story:
      'MERN apps, RAG systems and n8n automations. My **HR chatbot** scored **90.54** in the NIAT RAG Challenge, and **CareOps** came together in a 24-hour hackathon.',
    gallery: [{ caption: 'HR chatbot' }, { caption: 'CareOps demo' }, { caption: 'Hackathon night' }],
  },
  {
    id: 'youtube',
    org: 'YouTube',
    short: 'YouTube',
    badge: '▶',
    color: '#ff3b30',
    when: 'January 2027',
    place: 'Hyderabad',
    pos: { x: 1445, y: 410 },
    upcoming: true,
    headline: 'Going big on YouTube.',
    story:
      'In **January 2027** I’m launching my Telugu tech channel properly. Programming and AI, taught the way I wish someone had taught me.',
    gallery: [{ caption: 'Coming soon' }],
  },
]

export const projects = [
  {
    id: 'careops',
    emoji: '🏥',
    name: 'CareOps',
    tagline: 'A clinic front desk that never sleeps',
    summary:
      'An AI agent that answers patient FAQs, books appointments and knows when to call a human. Built in 24 hours by a team of three. I owned the RAG microservice and pitched in on the Node backend.',
    stats: [
      { value: '24h', label: 'from idea to demo' },
      { value: '3', label: 'person team' },
      { value: '3', label: 'jobs: FAQs, booking, escalation' },
    ],
    highlights: [
      'Multi-turn booking flow built as a state machine',
      'LLM intent classifier to route every message',
      'A dedicated /escalation-check endpoint to stop false alarms',
    ],
    stack: ['FastAPI', 'FAISS', 'sentence-transformers', 'Groq · Qwen3-32B', 'Node / Express', 'SQLite'],
    repo: 'https://github.com/knvavinashreddy', // PLACEHOLDER: repo URL
    live: '#', // PLACEHOLDER: demo URL
  },
  {
    id: 'hr-chatbot',
    emoji: '💼',
    name: 'Zyro HR Chatbot',
    tagline: 'Ask HR anything, get the policy',
    summary:
      'A RAG chatbot that answers employee questions from company HR policies, built for the NIAT Masterclass RAG Challenge. Deployed with full tracing so every bad answer has a paper trail.',
    stats: [
      { value: '90.54', label: 'challenge score out of 100' },
      { value: '750', label: 'token chunks, 150 overlap' },
      { value: 'k=12', label: 'retrieval sweet spot' },
    ],
    highlights: [
      'Fixed leaking “think” blocks from the model',
      'Stopped out-of-scope questions sneaking past the guardrails',
      'Handled questions that span multiple policies',
    ],
    stack: ['LangChain LCEL', 'FAISS', 'Groq · Qwen3-32B', 'Streamlit', 'LangSmith'],
    repo: 'https://github.com/knvavinashreddy', // PLACEHOLDER: repo URL
    live: '#', // PLACEHOLDER: Streamlit URL
  },
  {
    id: 'ladder',
    emoji: '🪜',
    name: 'Project Ladder',
    tagline: 'One feature a day, every day',
    summary:
      'My long game: a Node and React roadmap of ten projects per lane, one lane at a time for four to six weeks. Small daily ships, big compound interest.',
    stats: [
      { value: '10', label: 'projects per lane' },
      { value: '1', label: 'feature a day' },
      { value: '∞', label: 'commits pending' },
    ],
    highlights: [
      'GenAI + full-stack lane first',
      'Every project ships, even the ugly ones',
      'Built in public on GitHub',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    repo: 'https://github.com/knvavinashreddy',
    live: '#',
  },
]

export const toolkit = [
  {
    group: 'Building the app',
    tools: [
      { name: 'React', note: 'Every interface I ship, including this one.' },
      { name: 'Node.js', note: 'APIs, scripts and the occasional 2 a.m. cron job.' },
      { name: 'Express', note: 'The backend glue for CareOps and my MERN projects.' },
      { name: 'MongoDB', note: 'Where the M in MERN keeps its stuff.' },
      { name: 'JavaScript', note: 'My first love. Still forgives my semicolons.' },
      { name: 'Three.js', note: 'Currently learning. The 3D era is coming.' },
    ],
  },
  {
    group: 'Building the brain',
    tools: [
      { name: 'Python', note: 'For anything that needs to think.' },
      { name: 'FastAPI', note: 'Powered the CareOps RAG microservice.' },
      { name: 'LangChain', note: 'LCEL pipelines for my HR chatbot.' },
      { name: 'FAISS', note: 'Fast vector search. My retrieval workhorse.' },
      { name: 'Groq', note: 'Runs Qwen3-32B fast enough to feel like magic.' },
      { name: 'sentence-transformers', note: 'Turns text into vectors I can search.' },
      { name: 'LangSmith', note: 'So I can see exactly why the bot said that.' },
      { name: 'Streamlit', note: 'Quickest way to put a chatbot online.' },
    ],
  },
  {
    group: 'Keeping it moving',
    tools: [
      { name: 'n8n', note: 'Workflow automation for boring, repeatable stuff.' },
      { name: 'Git & GitHub', note: 'Version control and my build-in-public diary.' },
      { name: 'SQLite', note: 'Tiny database, big help in hackathons.' },
      { name: 'Figma', note: 'Sketching before I code.' }, // edit if you don’t use it
    ],
  },
]

export const ratings = [
  { platform: 'LeetCode', value: 1200, handle: 'Avinash_Reddy_Konala', url: links.leetcode },
  { platform: 'Codeforces', value: 900, handle: 'avinashreddykonala', url: links.codeforces },
  { platform: 'CodeChef', value: 1200, handle: 'algovanguard', url: links.codechef },
]

export const youtube = {
  launch: '2027-01-01T00:00:00+05:30', // edit to your exact launch date
  title: 'My Telugu tech channel goes live in January 2027.',
  text: 'MERN, RAG and AI, explained in Telugu. The stuff I wish someone had explained to me when I started.',
}

// Items on the draggable “off the clock” board. x / y are pixels on a 920×560 board.
export const boardItems = [
  { id: 'sports', type: 'note', color: 'n1', x: 40, y: 40, rot: -4, title: 'Sports', text: 'Will drop everything for a match. Yes, even a deadline.' },
  { id: 'music', type: 'note', color: 'n2', x: 290, y: 70, rot: 3, title: 'Music lover', text: 'Headphones on, world off. Hit the record player up top.' },
  { id: 'food', type: 'note', color: 'n3', x: 40, y: 290, rot: 2, title: 'Food lover', text: 'Bhimavaram food is a personality trait. Ask me for recommendations.' },
  { id: 'games', type: 'note', color: 'n4', x: 300, y: 320, rot: -3, title: 'Gamer', text: 'Ranked queue builds character. Debugging builds more.' },
  { id: 'ticket', type: 'ticket', x: 560, y: 40, rot: 2 },
  { id: 'photo1', type: 'photo', x: 560, y: 230, rot: -5, caption: 'add a photo' },
  { id: 'photo2', type: 'photo', x: 715, y: 270, rot: 4, caption: 'and another' },
]
