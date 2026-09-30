export const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com'

export const thresholds = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<800'],
  checks: ['rate>0.99'],
}
