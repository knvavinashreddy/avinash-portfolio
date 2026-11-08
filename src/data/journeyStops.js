// The journey map: the section heading, and the nine stops in order.
// Stops are placed evenly around the heart in this order (see features/journey/heart/heartShape.js).
// story: wrap words in **double stars** to highlight them. upcoming: true = still in the future.

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
    color: '#a33c52',
    when: '2021', // year of your 10th, edit if needed
    place: 'Bhimavaram',
    headline: 'A Journey Beyond Academics',
    // a blank line between paragraphs ("\n\n") starts a new paragraph on the story card
    story:
      'My school life was more about sports, games, friendships, and cultural activities. Academics, especially mathematics, were a struggle. After 9th grade, I started focusing on my basics through private coaching during COVID. Though I was never a topper, I gradually improved through consistent effort.',
    gallery: [{ caption: 'School days' }, { caption: 'The classroom' }, { caption: '10th results day' }],
  },
  {
    id: 'aditya',
    org: 'Aditya Junior College',
    short: 'Aditya Jr. College',
    badge: 'AJC',
    color: '#a33c52',
    when: '2021 – 2023',
    place: 'Bhimavaram',
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
    color: '#a33c52',
    when: '2023',
    place: 'Online',
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
    color: '#a33c52',
    when: '2023 – 2024',
    place: 'Tumakuru, Karnataka',
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
    color: '#6b2a4a',
    when: '2024',
    place: 'Tumakuru, Karnataka',
    headline: 'I dropped out from SIT',
    story:
      'It was theory, mugging, exams, repeat. Nothing I could actually build with. After first year I made the hardest call so far: I **dropped out**, even with good placements on the table.',
    gallery: [{ caption: 'Last day on campus' }, { caption: 'Packing up' }],
  },
  {
    id: 'niat',
    org: 'NIAT',
    short: 'NIAT',
    badge: 'NIAT',
    color: '#a33c52',
    when: '2024',
    place: 'Financial District, Hyderabad',
    headline: 'NxtWave Institute of Advanced Technologies',
    story:
      'I joined **NIAT**, NxtWave’s four-year program, with my **BSc in Computer Science**. No mugging, just the skills companies actually hire for. Next door: **Google, Amazon, Microsoft, Accenture, Infosys, Wipro**. Meeting engineers, managers and HRs here changed how I think.',
    gallery: [{ caption: 'First day' }, { caption: 'The neighbourhood' }, { caption: 'My batch' }, { caption: 'Industry visit' }],
  },
  {
    id: 'first-video',
    org: 'Creator corner',
    short: 'First video',
    badge: '●',
    color: '#a33c52',
    when: '2024',
    place: 'Hyderabad',
    headline: 'Hit record, cringed, kept going.',
    story:
      'Two months into NIAT I recorded my **first piece of content**. Rough? Very. But it was the start of something I really care about.',
    gallery: [
      { caption: 'The first take', src: '/photos/first-video-memoji.jpg' },
      { caption: 'Face to camera', src: '/photos/first-video-on-camera.jpg' },
    ],
  },
  {
    id: 'builder',
    org: 'Builder mode',
    short: 'Builder mode',
    badge: '</>',
    color: '#a33c52',
    when: '2025 – 2026', // edit if needed
    place: 'Hyderabad',
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
    color: '#a33c52',
    when: 'January 2027',
    place: 'Hyderabad',
    upcoming: true,
    headline: 'Going big on YouTube.',
    story:
      'In **January 2027** I’m launching my Telugu tech channel properly. Programming and AI, taught the way I wish someone had taught me.',
    gallery: [{ caption: 'The studio, ready for 2027', src: '/photos/youtube-studio-2027.jpg' }],
  },
]
