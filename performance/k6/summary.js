import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

export function buildSummary(data, name) {
  return {
    [`performance/reports/${name}-summary.json`]: JSON.stringify(data, null, 2),
    [`performance/reports/${name}-report.html`]: htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
