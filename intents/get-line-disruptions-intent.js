import getCustomSlotValue from '../helpers/get-custom-slot-value'
import getLineDisruptions from '../tfl-api/get-line-disruptions'
import responseToSpeak from '../helpers/response-to-speak'
import fullLineName from '../helpers/full-line-name'
import log from '../helpers/log'

const GetLineDisruptionsIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' &&
      request.intent.name === 'GetLineDisruptionsIntent'
  },
  async handle (handlerInput) {
    const { dialogState, intent: { slots } } = handlerInput.requestEnvelope.request
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const line = getCustomSlotValue(slots.Line)

    if (!line.id) {
      if (dialogState === 'COMPLETED') {
        log('Dialog finished without matching to a slot value.')
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('UNHANDLED_MESSAGE'))
          .getResponse()
      }

      log("Unable to match the user's request to a valid line.")
      return this.emit(':delegate')
    }

    if (line.id === 'elizabeth') {
      return handlerInput.responseBuilder
        .speak(responseToSpeak(requestAttributes.t('ELIZABETH_LINE_INFO')))
        .withSimpleCard(
          requestAttributes.t('ELIZABETH_LINE_INFO_TITLE'), requestAttributes.t('ELIZABETH_LINE_INFO')
        )
        .getResponse()
    }

    let disruptions

    try {
      disruptions = await getLineDisruptions(line.id)
    } catch (error) {
      log(error.message)

      return handlerInput.responseBuilder
        .speak(requestAttributes.t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    if (disruptions.length === 0) {
      const goodService = requestAttributes.t('GOOD_SERVICE_MESSAGE', fullLineName(line))

      return handlerInput.responseBuilder
        .speak(responseToSpeak(goodService))
        .withSimpleCard(
          requestAttributes.t('GOOD_SERVICE_TITLE'),
          goodService
        )
        .getResponse()
    } else {
      const description = disruptions[0].description

      return handlerInput.responseBuilder
        .speak(responseToSpeak(description))
        .withSimpleCard(
          requestAttributes.t('DELAYS_TITLE'),
          description
        )
        .getResponse()
    }
  }
}

export default GetLineDisruptionsIntent
