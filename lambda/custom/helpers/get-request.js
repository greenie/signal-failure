import { path } from 'ramda'

const getRequest = handlerInput => path(['requestEnvelope', 'request'], handlerInput)

export default getRequest
