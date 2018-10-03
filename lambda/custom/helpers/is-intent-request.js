import { propEq } from 'ramda'

const isIntentRequest = propEq('type', 'IntentRequest')

export default isIntentRequest
