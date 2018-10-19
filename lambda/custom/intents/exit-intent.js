import { both, compose, either } from 'ramda'
import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import isIntentRequest from '../helpers/is-intent-request'

const ExitIntent = {
  canHandle (handlerInput) {
    return compose(
      both(
        isIntentRequest,
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
