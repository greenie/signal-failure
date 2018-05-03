import log from '../helpers/log'

const ExitIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope

    return request.type === 'IntentRequest' && (
      request.intent.name === 'AMAZON.StopIntent' ||
      request.intent.name === 'AMAZON.CancelIntent'
    )
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
