import log from '../helpers/log'

export default function () {
  const { event: { request } } = this
  log(request)

  return this.emit(':tell', this.t('UNHANDLED_MESSAGE'))
}
