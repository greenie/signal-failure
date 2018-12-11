import {
  allPass,
  always,
  complement,
  compose,
  cond,
  isEmpty,
  path,
  T
} from 'ramda'
import fullLineName from '../helpers/full-line-name'
import getIntent from '../helpers/get-intent'
import getRequest from '../helpers/get-request'
import getSlotValue from '../helpers/get-slot-value'
import intentNameIs from '../helpers/intent-name-is'
import isIntentRequest from '../helpers/is-intent-request'
import requestDialogIs from '../helpers/request-dialog-is'
import getLineDisruptions from '../tfl-api/get-line-disruptions'

const InProgressGetLineDisruptionsIntent = {
  canHandle (handlerInput) {
    return compose(
      allPass([
        isIntentRequest,
        intentNameIs('GetLineDisruptionsIntent'),
        complement(requestDialogIs('COMPLETED'))
      ]),
      getRequest
    )(handlerInput)
  },
  handle (handlerInput) {
    console.info('In InProgressGetLineDisruptionsIntent')

    return handlerInput.responseBuilder
      .addDelegateDirective()
      .getResponse()
  }
}

const GetLineDisruptionsIntent = {
  canHandle (handlerInput) {
    return compose(
      allPass([
        isIntentRequest,
        intentNameIs('GetLineDisruptionsIntent'),
        requestDialogIs('COMPLETED')
      ]),
      getRequest
    )(handlerInput)
  },
  async handle (handlerInput) {
    console.info('In GetLineDisruptionsIntent')

    const { t } = handlerInput.attributesManager.getRequestAttributes()
    const line = compose(
      getSlotValue,
      path(['slots', 'Line']),
      getIntent,
      getRequest
    )(handlerInput)

    if (line.id === 'elizabeth') {
      return handlerInput.responseBuilder
        .speak(t('ELIZABETH_LINE_INFO'))
        .withSimpleCard(
          t('ELIZABETH_LINE_INFO_TITLE'),
          t('ELIZABETH_LINE_INFO')
        )
        .getResponse()
    }

    let disruptions

    try {
      disruptions = await getLineDisruptions(line.id)
    } catch (error) {
      console.error(error.message)

      return handlerInput.responseBuilder
        .speak(t('REQUEST_ERROR_MESSAGE'))
        .getResponse()
    }

    const [title, description] = cond([
      [
        isEmpty,
        always([
          t('GOOD_SERVICE_TITLE'),
          t('GOOD_SERVICE_MESSAGE', fullLineName(line))
        ])
      ],
      [
        T,
        disruptions => [
          t('DELAYS_TITLE'),
          disruptions[0].description
        ]
      ]
    ])(disruptions)

    return handlerInput.responseBuilder
      .speak(description)
      .withSimpleCard(
        title,
        description
      )
      .getResponse()
  }
}

export {
  InProgressGetLineDisruptionsIntent,
  GetLineDisruptionsIntent
}
