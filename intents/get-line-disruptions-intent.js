import getCustomSlotValue from '../helpers/get-custom-slot-value'
import getLineDisruptions from '../tfl-api/get-line-disruptions'
import responseToSpeak from '../helpers/response-to-speak'
import fullLineName from '../helpers/full-line-name'
import log from '../helpers/log'

const GetLineDisruptionsIntent = async function () {
  const { event: { request } } = this
  const { dialogState, intent: { slots } } = request
  const line = getCustomSlotValue(slots.Line)

  log(request)

  if (!line.id) {
    if (dialogState === 'COMPLETED') {
      log('Dialog finished without matching to a slot value.')
      return this.emit(':tell', this.t('UNHANDLED_MESSAGE'))
    }

    log("Unable to match the user's request to a valid line.")
    return this.emit(':delegate')
  }

  if (line.id === 'elizabeth') {
    return this.emit(
      ':tellWithCard',
      responseToSpeak(this.t('ELIZABETH_LINE_INFO')),
      this.t('ELIZABETH_LINE_INFO_TITLE'),
      this.t('ELIZABETH_LINE_INFO')
    )
  }

  let disruptions

  try {
    disruptions = await getLineDisruptions(line.id)
  } catch (error) {
    log(error.message)
    return this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'))
  }

  if (disruptions.length === 0) {
    const goodService = this.t('GOOD_SERVICE_MESSAGE', fullLineName(line))

    return this.emit(
      ':tellWithCard',
      responseToSpeak(goodService),
      this.t('GOOD_SERVICE_TITLE'),
      goodService
    )
  } else {
    const description = disruptions[0].description

    return this.emit(
      ':tellWithCard',
      responseToSpeak(description),
      this.t('DELAYS_TITLE'),
      description
    )
  }
}

export default GetLineDisruptionsIntent
