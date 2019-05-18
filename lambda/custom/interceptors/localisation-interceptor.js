import sprintf from 'i18next-sprintf-postprocessor'
import { use } from 'i18next'

import translations from '../resources/translations'

const LocalisationInterceptor = {
  async process (handlerInput) {
    const { attributesManager, requestEnvelope } = handlerInput

    await use(sprintf)
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
