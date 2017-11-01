import getCustomSlotValue from '../helpers/get-custom-slot-value'
import responseToSpeak from '../helpers/response-to-speak'
import fullLineName from '../helpers/full-line-name'
import getLineDisruptions from '../helpers/tfl-api/get-line-disruptions'
import log from '../helpers/log'

export default async function () {
  const { event: { request } } = this
  const { dialogState, intent: { slots } } = request

  log(request)

  if (dialogState && dialogState !== 'COMPLETED') {
    log('Line name missing. Asking user to repeat themselves.')
    return this.emit(':delegate')
  }

  const line = getCustomSlotValue(slots.Line)

  if (!line.id) {
    log('Line name missing. Asking user to repeat themselves.')
    return this.emit(':elicitSlot', 'Line', this.t('UNRECOGNISED_LINE_MESSAGE'))
  }

  try {
    const disruptions = await getLineDisruptions(line.id)
    const { data } = disruptions

    if (data.length === 0) {
      const goodService = (line.id === 'tube')
        ? this.t('GOOD_SERVICE_ALL_LINES_MESSAGE')
        : this.t('GOOD_SERVICE_MESSAGE', fullLineName(line))

      this.emit(
        ':tellWithCard',
        responseToSpeak(goodService),
        this.t('GOOD_SERVICE_TITLE'),
        goodService
      )
    } else {
      const description = (line.id === 'tube')
        ? data.map(({ description }) => description).filter(d => d).join('<break strength="strong" />')
        : data[0].description

      this.emit(
        ':tellWithCard',
        responseToSpeak(description),
        this.t('DELAYS_TITLE'),
        description.replace(/<break[\s+\w*="\w*"]*\s*\/>/g, '\n\n')
      )
    }
  } catch (error) {
    log(error)

    error.status && error.status === 404
      ? this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'))
      : this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'))
  }
}
