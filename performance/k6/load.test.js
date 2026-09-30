import { thresholds } from './config.js'
import { postsFlow } from './scenarios/posts.js'
import { buildSummary } from './summary.js'

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds,
}

export default postsFlow

export function handleSummary(data) {
  return buildSummary(data, 'k6-load')
}
