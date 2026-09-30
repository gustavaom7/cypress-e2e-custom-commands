import './commands'
import addContext from 'mochawesome/addContext'
import 'cypress-axe'
import '@cypress-audit/lighthouse/commands'
import { register as registerCypressGrep } from '@cypress/grep'

registerCypressGrep()

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `cypress/screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
    addContext({ test }, screenshot)
  }
})
