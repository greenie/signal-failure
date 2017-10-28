import axios from 'axios'
import getCustomSlotValue from '../helpers/get-custom-slot-value'
import responseToSpeak from '../helpers/response-to-speak'
import fullLineName from '../helpers/full-line-name'
import getSecret from '../helpers/secrets'
import log from '../helpers/log'

export default async function () {
  const { event: { request } } = this
  const { dialogState, intent: { slots } } = request

  log(request)

  if (dialogState && dialogState !== 'COMPLETED') {
    log('Line name missing. Asking user to repeat themselves.')
    return this.emit(':delegate')
  }

  const TFL_APP_ID = await getSecret('TFL_APP_ID')
  const TFL_API_KEY = await getSecret('TFL_API_KEY')
  const line = getCustomSlotValue(slots.Line)

  if (!line.id) {
    log('Line name missing. Asking user to repeat themselves.')
    return this.emit(':elicitSlot', 'Line', this.t('UNRECOGNISED_LINE_MESSAGE'))
  }

  log(line)

  const lineDisruptionsUrl = `/Line/${line.id}/Disruption`
  const modeDisruptionsUrl = `/Line/Mode/${line.id}/Disruption`
  const requestOptions = {
    method: 'get',
    baseURL: 'https://api.tfl.gov.uk',
    url: (line.id === 'tube') ? modeDisruptionsUrl : lineDisruptionsUrl,
    params: {
      app_id: TFL_APP_ID,
      app_key: TFL_API_KEY
    },
    timeout: 3000
  }

  axios.interceptors.response.use(
    ({ status, data, headers }) => ({ status, data, headers })
  )

  axios(requestOptions)
    .then(response => {
      const { data } = response

      log(response)

      if (data.length === 0) {
        const goodService = (line.id === 'tube')
          ? this.t('GOOD_SERVICE_ALL_LINES_MESSAGE')
          : responseToSpeak(this.t('GOOD_SERVICE_MESSAGE', fullLineName(line)))

        this.emit(
          ':tellWithCard',
          goodService,
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
          description.replace(/<break[\s+\w*="\w*"]*\s*\/>/g, '\r\n')
        )
      }
    })
    .catch(error => {
      const { response } = error

      if (response) {
        const { status, data, headers } = response

        log({ status, data, headers })

        if (status === 404) {
          return this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'))
        }
      } else {
        log(error)
      }

      this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'))
    })
}
