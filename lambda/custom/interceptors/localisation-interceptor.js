import i18next from 'i18next'
import sprintf from 'i18next-sprintf-postprocessor'
import translations from '../resources/translations'

const LocalisationInterceptor = {
  async process (handlerInput) {
    const { attributesManager, requestEnvelope } = handlerInput

    await i18next
      .use(sprintf)
      .init({
        lng: requestEnvelope.request.locale,
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: translations,
        returnObjects: true
      })
      .then(t => attributesManager.setRequestAttributes({
        t: (...args) => t(...args)
      }))
  }
}

export default LocalisationInterceptor
