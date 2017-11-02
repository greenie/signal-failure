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
    const description = disruptions.map(({ description }) => description).filter(d => d).join('<break strength="strong" />')

    this.emit(
      ':tellWithCard',
      responseToSpeak(description),
      this.t('DELAYS_TITLE'),
      description.replace(/<break[\s+\w*="\w*"]*\s*\/>/g, '\n\n')
    )
  }
}
