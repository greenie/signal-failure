import { propEq } from 'ramda'

const isIntentRequest = request => propEq('type', 'IntentRequest')

export default isIntentRequest
