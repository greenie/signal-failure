import getCustomSlotValue from '../helpers/get-custom-slot-value'
import getLineDisruptions from '../tfl-api/get-line-disruptions'
import responseToSpeak from '../helpers/response-to-speak'
import fullLineName from '../helpers/full-line-name'
import log from '../helpers/log'

export default async function () {
  const { event: { request } } = this
  const { intent: { slots } } = request
  const line = getCustomSlotValue(slots.Line)

  log(request)

  if (!line.id) {
    log('Line name missing. Asking user to repeat themselves.')
    return this.emit(':delegate')
  }

  let disruptions

  try {
    disruptions = await getLineDisruptions(line.id)
  } catch (error) {
    log(error)

    return error.status && error.status === 404
      ? this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'))
      : this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'))
  }

  if (disruptions.length === 0) {
    const goodService = this.t('GOOD_SERVICE_MESSAGE', fullLineName(line))

    this.emit(
      ':tellWithCard',
      responseToSpeak(goodService),
      this.t('GOOD_SERVICE_TITLE'),
      goodService
    )
  } else {
    const description = disruptions[0].description

    this.emit(
      ':tellWithCard',
      responseToSpeak(description),
      this.t('DELAYS_TITLE'),
      description
    )
  }
}
