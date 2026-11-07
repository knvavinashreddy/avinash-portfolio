// Projects shown in the Work section's card deck.

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
