import { thresholds } from './config.js'
import { postsFlow } from './scenarios/posts.js'
import { buildSummary } from './summary.js'

export const options = {
  vus: 1,
  duration: '30s',
  thresholds,
}

export default postsFlow

export function handleSummary(data) {
  return buildSummary(data, 'k6-smoke')
}
