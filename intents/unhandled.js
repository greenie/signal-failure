import log from '../helpers/log'

const Unhandled = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    log(error)

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('UNHANDLED_MESSAGE'))
      .getResponse()
  }
}

export default Unhandled
