import { both, compose, either } from 'ramda'

import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import requestTypeIs from '../helpers/request-type-is'

const ExitIntent = {
  canHandle (handlerInput) {
    return compose(
      both(
        requestTypeIs('IntentRequest'),
        either(
          intentNameIs('AMAZON.StopIntent'),
          intentNameIs('AMAZON.CancelIntent')
        )
      ),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    console.info('In ExitIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('STOP_MESSAGE'))
      .getResponse()
  }
}

export default ExitIntent
