import getModeDisruptions from '../tfl-api/get-mode-disruptions'
import responseToSpeak from '../helpers/response-to-speak'
import log from '../helpers/log'

export default async function () {
  const { event: { request } } = this
  let disruptions

  log(request)

  try {
    disruptions = await getModeDisruptions('tube')
  } catch (error) {
    log(error)
    this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'))
  }

  if (disruptions.length === 0) {
    const goodService = this.t('GOOD_SERVICE_ALL_LINES_MESSAGE')

    this.emit(
      ':tellWithCard',
      goodService,
      this.t('GOOD_SERVICE_TITLE'),
      goodService
    )
  } else {
    const uniqueDisruptions = new Set(disruptions
      .map(({ description }) => description)
      .filter(d => d))

    const description = Array.from(uniqueDisruptions)
      .concat([this.t('GOOD_SERVICE_ALL_OTHER_LINES_MESSAGE')])

    const descriptionToSpeak = responseToSpeak(description.map(d => `<p>${d}</p>`).join(''))
    const descriptionForCard = description.join('\n\n')

    this.emit(
      ':tellWithCard',
      descriptionToSpeak,
      this.t('DELAYS_TITLE'),
      descriptionForCard
    )
  }
}
