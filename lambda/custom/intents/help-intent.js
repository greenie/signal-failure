import { both, compose, or } from 'ramda'
import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import isLaunchRequest from '../helpers/is-launch-request'
import isIntentRequest from '../helpers/is-intent-request'

const HelpIntent = {
  canHandle (handlerInput) {
    return compose(
      or(
        isLaunchRequest,
        both(
          isIntentRequest,
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
