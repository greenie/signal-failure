import { compose } from 'ramda'
import getRequest from '../helpers/get-request'
import requestTypeIs from '../helpers/request-type-is'

const SessionEndedIntent = {
  canHandle (handlerInput) {
    return compose(
      requestTypeIs('SessionEndedRequest'),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    console.info('In SessionEndedIntent')
  }
}

export default SessionEndedIntent
