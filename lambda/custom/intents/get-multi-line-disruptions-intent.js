import {
  allPass,
  complement,
  compose,
  cond,
  isEmpty,
  join,
  map,
  pluck,
  prop,
  T
} from 'ramda'
import fullLineName from '../helpers/full-line-name'
import getAllSlotsValues from '../helpers/get-all-slots-values'
import getDescriptions from '../helpers/get-descriptions'
import getIntent from '../helpers/get-intent'
import getRequest from '../helpers/get-request'
import intentNameIs from '../helpers/intent-name-is'
import isIntentRequest from '../helpers/is-intent-request'
import requestDialogIs from '../helpers/request-dialog-is'
import toSentence from '../helpers/to-sentence'
import getLineDisruptions from '../tfl-api/get-line-disruptions'

const InProgressGetMultiLineDisruptionsIntent = {
  canHandle (handlerInput) {
    return compose(
      allPass([
        isIntentRequest,
        intentNameIs('GetMultiLineDisruptionsIntent'),
        complement(requestDialogIs('COMPLETED'))
      ]),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    console.info('In InProgressGetMultiLineDisruptionsIntent')

    const intent = compose(
      getIntent,
      getRequest
    )(handlerInput)

    return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse()
  }
}

const GetMultiLineDisruptionsIntent = {
  canHandle (handlerInput) {
    return compose(
      allPass([
        isIntentRequest,
        intentNameIs('GetMultiLineDisruptionsIntent'),
        requestDialogIs('COMPLETED')
      ]),
      getRequest
    )(handlerInput)
  },
  async handle (handlerInput) {
    console.info('In GetMultiLineDisruptionsIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()
    const slots = ['LineA', 'LineB', 'LineC']
    const lines = compose(
      getAllSlotsValues(slots),
      prop('slots'),
      getIntent,
      getRequest
    )(handlerInput)

    let disruptions

    try {
      disruptions = await getLineDisruptions(...pluck('id', lines))
    } catch (error) {
      console.error(error.message)

      return handlerInput.responseBuilder
        .speak(t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    const [title, descriptionToSpeak, descriptionForCard] = cond([
      [
        isEmpty,
        () => {
          const message = compose(
            toSentence,
            map(fullLineName)
          )(lines)

          return [
            t('GOOD_SERVICE_TITLE'),
            t('GOOD_SERVICE_MESSAGE', message),
            t('GOOD_SERVICE_MESSAGE', message)
          ]
        }
      ],
      [
        T,
        disruptions => [
          t('DELAYS_TITLE'),
          compose(
            join(''),
            map(d => `<p>${d}</p>`),
            getDescriptions
          )(disruptions),
          compose(
            join('\n\n'),
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

export {
  InProgressGetMultiLineDisruptionsIntent,
  GetMultiLineDisruptionsIntent
}
