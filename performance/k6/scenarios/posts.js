import http from 'k6/http'
import { check, sleep } from 'k6'
import { BASE_URL } from '../config.js'

export function postsFlow() {
  const list = http.get(`${BASE_URL}/posts`)
  check(list, {
    'list: status 200': (r) => r.status === 200,
    'list: returns array': (r) => Array.isArray(r.json()),
  })

  const one = http.get(`${BASE_URL}/posts/1`)
  check(one, {
    'get: status 200': (r) => r.status === 200,
    'get: id is 1': (r) => r.json('id') === 1,
  })

  const created = http.post(
    `${BASE_URL}/posts`,
    JSON.stringify({ title: 'k6', body: 'load', userId: 1 }),
    { headers: { 'Content-Type': 'application/json' } },
  )
  check(created, {
    'create: status 201': (r) => r.status === 201,
    'create: has id': (r) => r.json('id') !== undefined,
  })

  sleep(1)
}
