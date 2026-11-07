// The three proof chips, built from my real data so the numbers stay in sync:
//   value + label  shown on the chip
//   detail         tooltip on hover
//   sectionId      where a click glides to
//   position       where the chip floats around the sun (see ProofChips.css)

import { codingRatings } from '../../../data/codingRatings'
import { projects } from '../../../data/projects'

const hrChatbot = projects.find((project) => project.id === 'hr-chatbot')
const careOps = projects.find((project) => project.id === 'careops')
const leetCode = codingRatings.find((rating) => rating.platform === 'LeetCode')

export const proofChips = [
  hrChatbot && {
    id: 'rag-score',
    value: hrChatbot.stats[0].value,
    label: 'RAG challenge',
    detail: `${hrChatbot.name}, NIAT RAG Challenge`,
    sectionId: 'work',
    position: 'is-upper-left',
  },
  careOps && {
    id: 'hackathon',
    value: careOps.stats[0].value,
    label: 'hackathon build',
    detail: `${careOps.name}, idea to demo`,
    sectionId: 'work',
    position: 'is-right',
  },
  leetCode && {
    id: 'leetcode',
    value: leetCode.value.toLocaleString('en-IN'),
    label: 'LeetCode',
    detail: 'Grinding one contest at a time',
    sectionId: 'toolkit',
    position: 'is-lower-left',
  },
].filter(Boolean) // drop any chip whose data is missing
