import log from '../helpers/log'

const Unhandled = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    log('In Unhandled')
    log(error)

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('UNHANDLED_MESSAGE'))
      .getResponse()
  }
}

export default Unhandled
