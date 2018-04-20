const ExitIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
       request.intent.name === 'AMAZON.CancelIntent')
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse()
  }
}

export default ExitIntent
