import log from '../helpers/log'

const HelpIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope

    return request.type === 'LaunchRequest' || (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    )
  },
  handle (handlerInput) {
    log('In HelpIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('HELP_MESSAGE', t('HELP_REPROMPT_MESSAGE')))
      .reprompt(t('HELP_REPROMPT_MESSAGE'))
      .getResponse()
  }
}

export default HelpIntent
