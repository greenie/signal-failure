const Unhandled = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.info('In Unhandled')
    console.error(error)

    const { t } = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder
      .speak(t('UNHANDLED_MESSAGE'))
      .getResponse()
  }
}

export default Unhandled
