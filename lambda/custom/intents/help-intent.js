import { both, compose, either } from 'ramda'

import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import requestTypeIs from '../helpers/request-type-is'

const HelpIntent = {
  canHandle (handlerInput) {
    return compose(
      either(
        requestTypeIs('LaunchRequest'),
        both(
          requestTypeIs('IntentRequest'),
          intentNameIs('AMAZON.HelpIntent')
        )
      ),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    console.info('In HelpIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('HELP_MESSAGE', t('HELP_REPROMPT_MESSAGE')))
      .reprompt(t('HELP_REPROMPT_MESSAGE'))
      .getResponse()
  }
}

export default HelpIntent
