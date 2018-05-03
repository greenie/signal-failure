import getCustomSlotValue from '../helpers/get-custom-slot-value'
import getLineDisruptions from '../tfl-api/get-line-disruptions'
import fullLineName from '../helpers/full-line-name'
import log from '../helpers/log'

const InProgressGetLineDisruptionsIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope

    return request.type === 'IntentRequest' &&
      request.intent.name === 'GetLineDisruptionsIntent' &&
      request.dialogState !== 'COMPLETED'
  },
  handle (handlerInput) {
    log('In InProgressGetLineDisruptionsIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()
    const { intent } = handlerInput.requestEnvelope.request
    const { slots: { Line } } = intent
    const line = getCustomSlotValue(Line)

    if (!line.id) {
      return handlerInput.responseBuilder
        .speak(t('UNRECOGNISED_LINE_MESSAGE'))
        .reprompt(t('UNRECOGNISED_LINE_MESSAGE'))
        .addElicitSlotDirective(Line.name)
        .getResponse()
    }

    handlerInput.attributesManager.setSessionAttributes({ line })

    return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse()
  }
}

const GetLineDisruptionsIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope

    return request.type === 'IntentRequest' &&
      request.intent.name === 'GetLineDisruptionsIntent' &&
      request.dialogState === 'COMPLETED'
  },
  async handle (handlerInput) {
    log('In GetLineDisruptionsIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()
    const { line } = handlerInput.attributesManager.getSessionAttributes()

    if (line.id === 'elizabeth') {
      return handlerInput.responseBuilder
        .speak(t('ELIZABETH_LINE_INFO'))
        .withSimpleCard(
          t('ELIZABETH_LINE_INFO_TITLE'),
          t('ELIZABETH_LINE_INFO')
        )
        .getResponse()
    }

    let disruptions

    try {
      disruptions = await getLineDisruptions(line.id)
    } catch (error) {
      log(error.message)

      return handlerInput.responseBuilder
        .speak(t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    let title
    let description

    if (disruptions.length === 0) {
      title = t('GOOD_SERVICE_TITLE')
      description = t('GOOD_SERVICE_MESSAGE', fullLineName(line))
    } else {
      title = t('DELAYS_TITLE')
      description = disruptions[0].description
    }

    return handlerInput.responseBuilder
      .speak(description)
      .withSimpleCard(
        title,
        description
      )
      .getResponse()
  }
}

export {
  InProgressGetLineDisruptionsIntent,
  GetLineDisruptionsIntent
}
