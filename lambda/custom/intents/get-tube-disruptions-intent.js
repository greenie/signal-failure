import {
  always,
  append,
  both,
  compose,
  cond,
  isEmpty,
  join,
  map,
  T
} from 'ramda'
import getModeDisruptions from '../tfl-api/get-mode-disruptions'
import getDescriptions from '../helpers/get-descriptions'
import isIntentRequest from '../helpers/is-intent-request'
import intentNameIs from '../helpers/intent-name-is'
import getRequest from '../helpers/get-request'

const GetTubeDisruptionsIntent = {
  canHandle (handlerInput) {
    return compose(
      both(
        isIntentRequest,
        intentNameIs('GetTubeDisruptionsIntent')
      ),
      getRequest
    )(handlerInput)
  },
  async handle (handlerInput) {
    console.info('In GetTubeDisruptionsIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()
    let disruptions

    try {
      disruptions = await getModeDisruptions('tube')
    } catch (error) {
      console.error(error.message)

      return handlerInput.responseBuilder
        .speak(t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    const [title, descriptionToSpeak, descriptionForCard] = cond([
      [
        isEmpty,
        always([
          t('GOOD_SERVICE_TITLE'),
          t('GOOD_SERVICE_ALL_LINES_MESSAGE'),
          t('GOOD_SERVICE_ALL_LINES_MESSAGE')
        ])
      ],
      [
        T,
        disruptions => [
          t('DELAYS_TITLE'),
          compose(
            join('\n\n'),
            append(t('GOOD_SERVICE_ALL_OTHER_LINES_MESSAGE')),
            getDescriptions
          )(disruptions),
          compose(
            join,
            map(d => `<p>${d}</p>`),
            append(t('GOOD_SERVICE_ALL_OTHER_LINES_MESSAGE')),
            getDescriptions
          )(disruptions)
        ]
      ]
    ])(disruptions)

    return handlerInput.responseBuilder
      .speak(descriptionToSpeak)
      .withSimpleCard(
        title,
        descriptionForCard
      )
      .getResponse()
  }
}

export default GetTubeDisruptionsIntent
