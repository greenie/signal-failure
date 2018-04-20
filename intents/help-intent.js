const HelpIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' &&
       request.intent.name === 'AMAZON.HelpIntent')
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const fullHelpMessage = requestAttributes.t('HELP_MESSAGE', requestAttributes.t('HELP_REPROMPT_MESSAGE'))

    return handlerInput.responseBuilder
      .speak(fullHelpMessage)
      .reprompt(requestAttributes.t('HELP_REPROMPT_MESSAGE'))
      .getResponse()
  }
}

export default HelpIntent
