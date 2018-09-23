import i18n from 'i18next'
import sprintf from 'i18next-sprintf-postprocessor'
import translations from '../resources/translations'

const LocalisationInterceptor = {
  process (handlerInput) {
    const client = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: translations,
      returnObjects: true
    })

    handlerInput.attributesManager.setRequestAttributes({
      t: (...args) => client.t(...args)
    })
  }
}

export default LocalisationInterceptor
