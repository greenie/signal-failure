import getModeDisruptions from '../tfl-api/get-mode-disruptions'
import responseToSpeak from '../helpers/response-to-speak'
import log from '../helpers/log'

const GetTubeDisruptionsIntent = {
  canHandle (handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' &&
      request.intent.name === 'GetTubeDisruptionsIntent'
  },
  async handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    let disruptions

    try {
      disruptions = await getModeDisruptions('tube')
    } catch (error) {
      log(error.message)
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    if (disruptions.length === 0) {
      const goodService = requestAttributes.t('GOOD_SERVICE_ALL_LINES_MESSAGE')

      return handlerInput.responseBuilder
        .speak(goodService)
        .withSimpleCard(
          requestAttributes.t('GOOD_SERVICE_TITLE'),
          goodService
        )
        .getResponse()
    } else {
      const uniqueDisruptions = new Set(
        disruptions
          .map(({ description }) => description)
          .filter(d => d)
      )

      const description = Array.from(uniqueDisruptions)
        .concat([requestAttributes.t('GOOD_SERVICE_ALL_OTHER_LINES_MESSAGE')])

      const descriptionToSpeak = responseToSpeak(description.map(d => `<p>${d}</p>`).join(''))
      const descriptionForCard = description.join('\n\n')

      return handlerInput.responseBuilder
        .speak(descriptionToSpeak)
        .withSimpleCard(
          requestAttributes.t('DELAYS_TITLE'),
          descriptionForCard
        )
        .getResponse()
    }
  }
}

export default GetTubeDisruptionsIntent
