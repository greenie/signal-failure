import { both, compose, or } from 'ramda'
import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import isIntentRequest from '../helpers/is-intent-request'
import log from '../helpers/log'

const ExitIntent = {
  canHandle (handlerInput) {
    return compose(
      both(
        isIntentRequest,
        or(
          intentNameIs('AMAZON.StopIntent'),
          intentNameIs('AMAZON.CancelIntent')
        )
      ),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    log('In ExitIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('STOP_MESSAGE'))
      .getResponse()
  }
}

export default ExitIntent
